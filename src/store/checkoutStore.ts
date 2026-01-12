import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CheckoutState, Product, ShippingAddress, CheckoutStep } from '@/types/checkout';

const initialState = {
  currentStep: 'product' as CheckoutStep,
  selectedProduct: null as Product | null,
  shippingAddress: null as ShippingAddress | null,
  billingAddressSameAsShipping: true,
  paymentIntentId: null as string | null,
  paymentStatus: 'idle' as CheckoutState['paymentStatus'],
  error: null as string | null,
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setSelectedProduct: (product: Product | null) => 
        set({ selectedProduct: product }),
      
      setShippingAddress: (address: ShippingAddress) => 
        set({ shippingAddress: address }),
      
      setBillingAddressSameAsShipping: (same: boolean) => 
        set({ billingAddressSameAsShipping: same }),
      
      setPaymentIntentId: (id: string) => 
        set({ paymentIntentId: id }),
      
      setPaymentStatus: (status: CheckoutState['paymentStatus']) => 
        set({ paymentStatus: status }),
      
      setError: (error: string | null) => 
        set({ error }),
      
      setCurrentStep: (step: CheckoutStep) => 
        set({ currentStep: step }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'checkout-storage',
      // Only persist selected product and shipping address
      partialize: (state) => ({
        selectedProduct: state.selectedProduct,
        shippingAddress: state.shippingAddress,
        billingAddressSameAsShipping: state.billingAddressSameAsShipping,
      }),
    }
  )
);

// Helper to load shipping address from intake sessionStorage
export function loadShippingFromIntake(): ShippingAddress | null {
  if (typeof window === 'undefined') return null;
  
  const addressData = sessionStorage.getItem('intake_address');
  const parsed = safeJsonParse<{
    street?: string;
    unit?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    fullAddress?: string;
  }>(addressData, {});
  
  if (!parsed.street && !parsed.fullAddress) return null;
  
  return {
    street: parsed.street || '',
    unit: parsed.unit || '',
    city: parsed.city || '',
    state: parsed.state || '',
    zipCode: parsed.zipCode || '',
    fullAddress: parsed.fullAddress || '',
  };
}

// Safe JSON parse helper
function safeJsonParse<T>(data: string | null, fallback: T): T {
  if (!data) return fallback;
  
  // Check if it looks like JSON (starts with { or [)
  const trimmed = data.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return fallback;
  }
  
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    console.warn('Failed to parse JSON from session storage:', e);
    return fallback;
  }
}

// Helper to get patient info from intake sessionStorage
export function getPatientInfoFromIntake(): {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
} {
  if (typeof window === 'undefined') {
    return { firstName: '', lastName: '', email: '', phone: '', dob: '' };
  }
  
  let firstName = '';
  let lastName = '';
  let email = '';
  let phone = '';
  let dob = '';
  
  // Get name
  const nameData = sessionStorage.getItem('intake_name');
  const nameParsed = safeJsonParse<{ firstName?: string; lastName?: string }>(nameData, {});
  firstName = nameParsed.firstName || '';
  lastName = nameParsed.lastName || '';
  
  // Get contact
  const contactData = sessionStorage.getItem('intake_contact');
  const contactParsed = safeJsonParse<{ email?: string; phone?: string }>(contactData, {});
  email = contactParsed.email || '';
  phone = contactParsed.phone || '';
  
  // Get DOB
  const dobData = sessionStorage.getItem('intake_dob');
  const dobParsed = safeJsonParse<{ month?: string; day?: string; year?: string }>(dobData, {});
  if (dobParsed.month && dobParsed.day && dobParsed.year) {
    dob = `${dobParsed.month}/${dobParsed.day}/${dobParsed.year}`;
  }
  
  return { firstName, lastName, email, phone, dob };
}
