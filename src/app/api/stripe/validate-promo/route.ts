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

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false, error: 'No code provided' });
    }

    const stripe = getStripe();

    // Try to find the promotion code with expanded coupon
    const promotionCodes = await stripe.promotionCodes.list({
      code: code.toUpperCase(),
      active: true,
      limit: 1,
      expand: ['data.coupon'],
    });

    if (promotionCodes.data.length === 0) {
      return NextResponse.json({ valid: false, error: 'Code not found' });
    }

    const promoCode = promotionCodes.data[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coupon = (promoCode as any).coupon as Stripe.Coupon;

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'Coupon not found' });
    }

    // Check if coupon is valid
    if (!coupon.valid) {
      return NextResponse.json({ valid: false, error: 'Coupon is not valid' });
    }

    // Check redemption limits
    if (coupon.max_redemptions && coupon.times_redeemed && coupon.times_redeemed >= coupon.max_redemptions) {
      return NextResponse.json({ valid: false, error: 'Coupon has reached max redemptions' });
    }

    // Check expiration
    if (coupon.redeem_by && coupon.redeem_by < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ valid: false, error: 'Coupon has expired' });
    }

    return NextResponse.json({
      valid: true,
      couponId: coupon.id,
      promotionCodeId: promoCode.id,
      percentOff: coupon.percent_off || undefined,
      amountOff: coupon.amount_off || undefined,
      currency: coupon.currency || 'usd',
      name: coupon.name,
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json({ valid: false, error: 'Failed to validate code' });
  }
}
