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
      // Create a Subscription with incomplete payment
      console.log('Creating subscription for customer:', customer.id, 'with price:', priceId);
      
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          productId,
          productName,
          source: 'otmens-intake',
          ...metadata,
        },
      });

      console.log('Subscription created:', subscription.id, 'status:', subscription.status);

      // Get the client secret from the invoice's payment intent
      const invoice = subscription.latest_invoice;
      
      if (!invoice || typeof invoice === 'string') {
        console.error('Invoice not expanded or missing');
        throw new Error('Failed to retrieve invoice from subscription');
      }

      // Type assertion for expanded payment_intent
      const invoiceObj = invoice as Stripe.Invoice & { payment_intent?: Stripe.PaymentIntent | string | null };
      const paymentIntent = invoiceObj.payment_intent;
      
      if (!paymentIntent || typeof paymentIntent === 'string') {
        console.error('Payment intent not expanded or missing. Invoice ID:', invoiceObj.id);
        
        // If payment_intent is a string ID, we need to fetch it
        if (typeof paymentIntent === 'string') {
          const fetchedIntent = await stripe.paymentIntents.retrieve(paymentIntent);
          return NextResponse.json({
            clientSecret: fetchedIntent.client_secret,
            paymentIntentId: fetchedIntent.id,
            subscriptionId: subscription.id,
            customerId: customer.id,
            type: 'subscription',
          });
        }
        
        throw new Error('Payment intent not available on subscription invoice');
      }

      console.log('Payment intent retrieved:', paymentIntent.id);

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        subscriptionId: subscription.id,
        customerId: customer.id,
        type: 'subscription',
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
