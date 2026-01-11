import { NextResponse } from 'next/server';
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

// Product ID for OT Mens Tirzepatide
const TIRZEPATIDE_PRODUCT_ID = 'prod_Tlz6Xoylok5j7H';

// Fallback product image
const PRODUCT_IMAGE = 'https://static.wixstatic.com/media/c49a9b_b87d0b24fd2c46a4817d308db9b8122c~mv2.webp';

// Price IDs in order (monthly, 3-month, 6-month)
const PRICE_ORDER = [
  'price_1SoR8eDQIH4O9FhrvfFwzZgX',  // Monthly - $399
  'price_1SoRAGDQIH4O9Fhr1FF5EPtD',  // 3 months - $1,049
  'price_1SoRASDQIH4O9FhrHyAhVxMf',  // 6 months - $1,914
];

export async function GET() {
  try {
    const stripe = getStripe();

    // Fetch the product
    const product = await stripe.products.retrieve(TIRZEPATIDE_PRODUCT_ID);

    // Fetch all prices for this product
    const prices = await stripe.prices.list({
      product: TIRZEPATIDE_PRODUCT_ID,
      active: true,
    });

    // Sort prices by interval_count (1 month, 3 months, 6 months)
    const sortedPrices = prices.data.sort((a, b) => {
      const aIndex = PRICE_ORDER.indexOf(a.id);
      const bIndex = PRICE_ORDER.indexOf(b.id);
      // If both are in the order array, sort by that order
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // Otherwise sort by interval_count
      const aCount = a.recurring?.interval_count || 1;
      const bCount = b.recurring?.interval_count || 1;
      return aCount - bCount;
    });

    // Format the response
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.images?.[0] || PRODUCT_IMAGE,
      prices: sortedPrices.map((price) => ({
        id: price.id,
        unitAmount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval || 'one_time',
        intervalCount: price.recurring?.interval_count || 1,
        nickname: price.nickname,
        // Human-readable label
        label: getPriceLabel(price),
      })),
    };

    return NextResponse.json({
      success: true,
      product: formattedProduct,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

function getPriceLabel(price: Stripe.Price): string {
  if (!price.recurring) {
    return 'One-time payment';
  }

  const interval = price.recurring.interval;
  const count = price.recurring.interval_count;

  if (interval === 'month') {
    if (count === 1) return 'Monthly';
    if (count === 3) return 'Every 3 months';
    if (count === 6) return 'Every 6 months';
    return `Every ${count} months`;
  }

  if (interval === 'year') {
    if (count === 1) return 'Yearly';
    return `Every ${count} years`;
  }

  return `Every ${count} ${interval}(s)`;
}
