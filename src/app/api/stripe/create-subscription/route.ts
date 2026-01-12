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

interface SubscriptionRequest {
  customerId: string;
  priceId: string;
  paymentMethodId: string;
  productId?: string;
  productName?: string;
  metadata?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscriptionRequest = await request.json();
    
    const { customerId, priceId, paymentMethodId, productId, productName, metadata } = body;

    // Validate required fields
    if (!customerId || !priceId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'customerId, priceId, and paymentMethodId are required' },
        { status: 400 }
      );
    }

    // Get Stripe instance (lazy initialization)
    const stripe = getStripe();

    // Attach payment method to customer if not already attached
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
    } catch (attachError) {
      // Payment method might already be attached, that's OK
      console.log('Payment method attach result:', attachError instanceof Error ? attachError.message : 'attached');
    }

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    console.log('Creating subscription for customer:', customerId, 'with price:', priceId, 'paymentMethod:', paymentMethodId);

    // Create the subscription - payment method is already attached and set as default
    // Use 'allow_incomplete' to handle 3D Secure cases gracefully
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      payment_behavior: 'allow_incomplete', // Allow 3D Secure or other auth requirements
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        productId: productId || '',
        productName: productName || '',
        source: 'otmens-intake',
        ...metadata,
      },
    });

    console.log('Subscription created:', subscription.id, 'status:', subscription.status);

    // Check subscription status
    if (subscription.status === 'active' || subscription.status === 'trialing') {
      // Subscription is active, payment was successful
      return NextResponse.json({
        subscriptionId: subscription.id,
        status: subscription.status,
        customerId: customerId,
        success: true,
      });
    }

    // If subscription requires payment, get the payment intent from the invoice
    const invoice = subscription.latest_invoice as Stripe.Invoice & { payment_intent?: Stripe.PaymentIntent | string | null };
    if (invoice && invoice.payment_intent) {
      const paymentIntent = typeof invoice.payment_intent === 'string'
        ? await stripe.paymentIntents.retrieve(invoice.payment_intent)
        : invoice.payment_intent;

      if (paymentIntent.status === 'succeeded') {
        return NextResponse.json({
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: customerId,
          success: true,
        });
      }

      // Payment requires action
      return NextResponse.json({
        subscriptionId: subscription.id,
        status: subscription.status,
        customerId: customerId,
        clientSecret: paymentIntent.client_secret,
        requiresAction: true,
      });
    }

    // For other statuses (incomplete, etc.), return with success: false
    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      customerId: customerId,
      success: false,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode || 500 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
