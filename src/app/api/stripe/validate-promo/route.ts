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
    console.log('Validating promo code:', code);

    if (!code) {
      return NextResponse.json({ valid: false, error: 'No code provided' });
    }

    const stripe = getStripe();

    // Try to find the promotion code
    const promotionCodes = await stripe.promotionCodes.list({
      code: code.toUpperCase(),
      active: true,
      limit: 1,
    });

    console.log('Promotion codes found:', promotionCodes.data.length);

    if (promotionCodes.data.length === 0) {
      // Try lowercase as fallback
      const promotionCodesLower = await stripe.promotionCodes.list({
        code: code.toLowerCase(),
        active: true,
        limit: 1,
      });
      
      if (promotionCodesLower.data.length === 0) {
        return NextResponse.json({ valid: false, error: 'Code not found' });
      }
      
      promotionCodes.data = promotionCodesLower.data;
    }

    const promoCode = promotionCodes.data[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promoCodeAny = promoCode as any;
    console.log('Promo code found:', promoCode.id, 'coupon:', promoCodeAny.coupon);

    // Get the coupon - it might be a string ID or an expanded object
    let coupon: Stripe.Coupon;
    if (typeof promoCodeAny.coupon === 'string') {
      // Coupon is just an ID, fetch it
      coupon = await stripe.coupons.retrieve(promoCodeAny.coupon);
    } else {
      coupon = promoCodeAny.coupon;
    }

    console.log('Coupon details:', coupon.id, 'valid:', coupon.valid, 'percent_off:', coupon.percent_off, 'amount_off:', coupon.amount_off);

    if (!coupon) {
      return NextResponse.json({ valid: false, error: 'Coupon not found' });
    }

    // Check if coupon is valid
    if (!coupon.valid) {
      return NextResponse.json({ valid: false, error: 'Coupon is not valid' });
    }

    // Check redemption limits on coupon
    if (coupon.max_redemptions && coupon.times_redeemed !== undefined && coupon.times_redeemed >= coupon.max_redemptions) {
      return NextResponse.json({ valid: false, error: 'Coupon has reached max redemptions' });
    }

    // Check expiration
    if (coupon.redeem_by && coupon.redeem_by < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ valid: false, error: 'Coupon has expired' });
    }

    const response = {
      valid: true,
      couponId: coupon.id,
      promotionCodeId: promoCode.id,
      percentOff: coupon.percent_off || undefined,
      amountOff: coupon.amount_off || undefined,
      currency: coupon.currency || 'usd',
      name: coupon.name,
    };

    console.log('Returning valid promo:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json({ valid: false, error: 'Failed to validate code' });
  }
}
