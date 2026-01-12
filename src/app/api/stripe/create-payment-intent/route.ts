import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error('STRIPE_SECRET_KEY is missing from environment variables');
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(secretKey);
}

interface PaymentRequest {
  amount: number;
  currency: string;
  productId: string;
  productName: string;
  priceId: string; // Stripe Price ID
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();
    
    const { amount, currency, productId, productName, priceId, customerEmail, customerName, metadata } = body;

    // Validate required fields
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get Stripe instance (lazy initialization)
    const stripe = getStripe();

    // Fetch the price to check if it's recurring
    const price = await stripe.prices.retrieve(priceId);
    const isSubscription = !!price.recurring;

    // Create or retrieve customer
    let customer: Stripe.Customer;
    
    if (customerEmail) {
      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        
        // Update customer name if provided
        if (customerName && customer.name !== customerName) {
          customer = await stripe.customers.update(customer.id, {
            name: customerName,
          });
        }
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
          metadata: {
            source: 'otmens-intake',
            ...metadata,
          },
        });
      }
    } else {
      // Create customer with name only
      customer = await stripe.customers.create({
        name: customerName || 'Guest',
        metadata: {
          source: 'otmens-intake',
          ...metadata,
        },
      });
    }

    if (isSubscription) {
      // For subscriptions, we'll create a SetupIntent first, then create the subscription
      // This ensures we can always collect the payment method
      console.log('Creating subscription for customer:', customer.id, 'with price:', priceId);
      
      // First, create a SetupIntent to collect payment method
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
        usage: 'off_session',
        metadata: {
          productId,
          productName,
          priceId,
          source: 'otmens-intake',
          ...metadata,
        },
      });

      console.log('SetupIntent created:', setupIntent.id);

      // Return the SetupIntent client secret
      // The frontend will:
      // 1. Collect payment method with SetupIntent
      // 2. On success, call a separate endpoint to create the subscription
      return NextResponse.json({
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
        customerId: customer.id,
        priceId: priceId,
        type: 'subscription_setup',
      });
    } else {
      // One-time payment - create PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price.unit_amount || amount,
        currency: price.currency || currency.toLowerCase(),
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          productId,
          productName,
          priceId,
          source: 'otmens-intake',
          ...metadata,
        },
        receipt_email: customerEmail || undefined,
        description: `Order for ${productName}`,
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        customerId: customer.id,
        type: 'payment',
      });
    }
  } catch (error) {
    console.error('Error creating payment:', error);
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode || 500 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment' },
      { status: 500 }
    );
  }
}
