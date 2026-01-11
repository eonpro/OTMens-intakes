// Checkout types for the native checkout flow

export interface Product {
  id: string;
  name: string;
  description: string;
  priceId: string; // Stripe Price ID
  price: number; // Price in cents
  currency: string;
  interval?: 'month' | 'year' | 'one_time';
  metadata?: {
    medication?: string;
    dosage?: string;
    category?: string;
    intervalCount?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutSession {
  // Patient info from intake
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: string;
  
  // Shipping address from intake
  shippingAddress: ShippingAddress;
  
  // Selected product
  selectedProduct: Product | null;
  
  // Payment info
  paymentIntentId?: string;
  paymentStatus?: 'pending' | 'processing' | 'succeeded' | 'failed';
  
  // Reference IDs
  intakeId?: string; // Airtable record ID
  intakeQId?: string; // IntakeQ client ID
  
  // Timestamps
  createdAt: string;
  completedAt?: string;
}

export interface ShippingAddress {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
}

export interface PaymentIntentRequest {
  amount: number; // in cents
  currency: string;
  productId: string;
  productName: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// Checkout step for progress tracking
export type CheckoutStep = 'product' | 'payment' | 'confirmation';

// Checkout store state
export interface CheckoutState {
  currentStep: CheckoutStep;
  selectedProduct: Product | null;
  shippingAddress: ShippingAddress | null;
  billingAddressSameAsShipping: boolean;
  paymentIntentId: string | null;
  paymentStatus: 'idle' | 'processing' | 'succeeded' | 'failed';
  error: string | null;
  
  // Actions
  setSelectedProduct: (product: Product | null) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setBillingAddressSameAsShipping: (same: boolean) => void;
  setPaymentIntentId: (id: string) => void;
  setPaymentStatus: (status: CheckoutState['paymentStatus']) => void;
  setError: (error: string | null) => void;
  setCurrentStep: (step: CheckoutStep) => void;
  reset: () => void;
}
