'use client';

import { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';

interface CheckoutLayoutProps {
  children: ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const stripePromise = getStripe();
  
  return (
    <Elements 
      stripe={stripePromise}
      options={{
        mode: 'setup', // Default mode for collecting payment methods
        currency: 'usd',
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#cab172',
            colorBackground: '#ffffff',
            colorText: '#413d3d',
            colorDanger: '#ef4444',
            fontFamily: '"sofia-pro", sans-serif',
            borderRadius: '16px',
            spacingUnit: '4px',
          },
          rules: {
            '.Input': {
              border: '2px solid rgba(0, 0, 0, 0.1)',
              padding: '16px',
              fontSize: '17px',
            },
            '.Input:focus': {
              borderColor: '#cab172',
              boxShadow: 'none',
            },
            '.Label': {
              fontWeight: '500',
              marginBottom: '8px',
            },
          },
        },
      }}
    >
      <div className="min-h-screen bg-white">
        {children}
      </div>
    </Elements>
  );
}
