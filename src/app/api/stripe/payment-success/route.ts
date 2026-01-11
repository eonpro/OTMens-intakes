import { NextRequest, NextResponse } from 'next/server';

// Airtable configuration
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Intake Submissions';

interface PaymentSuccessRequest {
  intakeId: string;
  paymentIntentId: string;
  productName: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentSuccessRequest = await request.json();
    const { intakeId, paymentIntentId, productName, amount } = body;

    if (!intakeId) {
      return NextResponse.json(
        { error: 'Missing intake ID' },
        { status: 400 }
      );
    }

    // Update Airtable
    if (AIRTABLE_PAT && AIRTABLE_BASE_ID) {
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
                'Payment Status': 'Paid',
                'Payment Intent ID': paymentIntentId,
                'Order Amount': amount ? amount / 100 : 0,
                'Selected Product': productName,
                'Payment Date': new Date().toISOString(),
              },
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Airtable update failed:', errorText);
          // Don't fail the request - payment already succeeded
        } else {
          console.log('Airtable updated successfully for intake:', intakeId);
        }
      } catch (airtableError) {
        console.error('Airtable update error:', airtableError);
        // Don't fail the request - payment already succeeded
      }
    }

    // TODO: Update IntakeQ patient record
    // This would call the IntakeQ API to update the patient's payment status

    return NextResponse.json({
      success: true,
      message: 'Payment recorded successfully',
    });
  } catch (error) {
    console.error('Payment success handler error:', error);
    return NextResponse.json(
      { error: 'Failed to record payment' },
      { status: 500 }
    );
  }
}
