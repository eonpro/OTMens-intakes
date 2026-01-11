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
  if (!addressData) return null;
  
  try {
    const parsed = JSON.parse(addressData);
    return {
      street: parsed.street || '',
      unit: parsed.unit || '',
      city: parsed.city || '',
      state: parsed.state || '',
      zipCode: parsed.zipCode || '',
      fullAddress: parsed.fullAddress || '',
    };
  } catch {
    return null;
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
  if (nameData) {
    try {
      const parsed = JSON.parse(nameData);
      firstName = parsed.firstName || '';
      lastName = parsed.lastName || '';
    } catch {
      // ignore
    }
  }
  
  // Get contact
  const contactData = sessionStorage.getItem('intake_contact');
  if (contactData) {
    try {
      const parsed = JSON.parse(contactData);
      email = parsed.email || '';
      phone = parsed.phone || '';
    } catch {
      // ignore
    }
  }
  
  // Get DOB
  const dobData = sessionStorage.getItem('intake_dob');
  if (dobData) {
    try {
      const parsed = JSON.parse(dobData);
      if (parsed.month && parsed.day && parsed.year) {
        dob = `${parsed.month}/${parsed.day}/${parsed.year}`;
      }
    } catch {
      dob = dobData;
    }
  }
  
  return { firstName, lastName, email, phone, dob };
}
