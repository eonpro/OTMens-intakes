import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
  });
}

// Airtable configuration
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Intake Submissions';

async function updateAirtablePaymentStatus(
  intakeId: string,
  paymentStatus: string,
  paymentIntentId: string,
  amount: number,
  productName: string
) {
  if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID || !intakeId) {
    console.log('Skipping Airtable update - missing config or intakeId');
    return;
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${intakeId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Payment Status': paymentStatus,
            'Payment Intent ID': paymentIntentId,
            'Order Amount': amount / 100, // Convert from cents
            'Selected Product': productName,
            'Payment Date': new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable update failed:', errorText);
    } else {
      console.log('Airtable updated successfully for intake:', intakeId);
    }
  } catch (error) {
    console.error('Error updating Airtable:', error);
  }
}

async function updateIntakeQPaymentStatus(intakeId: string, paymentStatus: string) {
  // TODO: Implement IntakeQ update when API details are available
  // This would update the existing patient record with payment status
  console.log('IntakeQ update placeholder for intake:', intakeId, 'status:', paymentStatus);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Get Stripe instance (lazy initialization)
    const stripe = getStripe();

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        
        const intakeId = paymentIntent.metadata?.intakeId;
        const productName = paymentIntent.metadata?.productName || '';
        
        // Update Airtable
        await updateAirtablePaymentStatus(
          intakeId || '',
          'Paid',
          paymentIntent.id,
          paymentIntent.amount,
          productName
        );
        
        // Update IntakeQ
        if (intakeId) {
          await updateIntakeQPaymentStatus(intakeId, 'Paid');
        }
        
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        
        const intakeId = paymentIntent.metadata?.intakeId;
        const productName = paymentIntent.metadata?.productName || '';
        
        // Update Airtable with failed status
        await updateAirtablePaymentStatus(
          intakeId || '',
          'Failed',
          paymentIntent.id,
          paymentIntent.amount,
          productName
        );
        
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription created:', subscription.id);
        // Handle subscription creation
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id);
        // Handle subscription update
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', subscription.id);
        // Handle subscription cancellation
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Webhooks need raw body, so we need to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};
