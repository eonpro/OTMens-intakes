'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import OTMensLogo from '@/components/OTMensLogo';
import CopyrightText from '@/components/CopyrightText';
import { useCheckoutStore, loadShippingFromIntake, getPatientInfoFromIntake } from '@/store/checkoutStore';
import type { Product, ShippingAddress } from '@/types/checkout';

interface StripePrice {
  id: string;
  unitAmount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  nickname: string | null;
  label: string;
}

interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  prices: StripePrice[];
}

const translations = {
  en: {
    title: 'Select Your Plan',
    subtitle: 'Choose the billing cycle that works best for you',
    orderSummary: 'Order Summary',
    shipping: 'Shipping Address',
    editAddress: 'Edit',
    selectPlan: 'Select a plan to continue',
    continueToPayment: 'Continue to Payment',
    perMonth: '/month',
    every3Months: 'every 3 months',
    every6Months: 'every 6 months',
    oneTime: 'one-time',
    bestValue: 'Best Value',
    mostPopular: 'Most Popular',
    loadingProducts: 'Loading treatment options...',
    noProducts: 'No products available. Please contact support.',
    included: 'What\'s Included:',
    includes: [
      'Licensed physician consultation',
      'GLP-1 medication shipped to your door',
      'Cold-chain packaging for freshness',
      'Ongoing support & monitoring',
    ],
    savings: 'Save',
    monthlyEquivalent: '/mo equivalent',
  },
  es: {
    title: 'Selecciona Tu Plan',
    subtitle: 'Elige el ciclo de facturación que mejor se adapte a ti',
    orderSummary: 'Resumen del Pedido',
    shipping: 'Dirección de Envío',
    editAddress: 'Editar',
    selectPlan: 'Selecciona un plan para continuar',
    continueToPayment: 'Continuar al Pago',
    perMonth: '/mes',
    every3Months: 'cada 3 meses',
    every6Months: 'cada 6 meses',
    oneTime: 'único pago',
    bestValue: 'Mejor Valor',
    mostPopular: 'Más Popular',
    loadingProducts: 'Cargando opciones de tratamiento...',
    noProducts: 'No hay productos disponibles. Por favor contacta soporte.',
    included: 'Qué Incluye:',
    includes: [
      'Consulta con médico licenciado',
      'Medicamento GLP-1 enviado a tu puerta',
      'Empaque de cadena de frío para frescura',
      'Soporte y monitoreo continuo',
    ],
    savings: 'Ahorra',
    monthlyEquivalent: '/mes equivalente',
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const { 
    selectedProduct, 
    setSelectedProduct, 
    shippingAddress,
    setShippingAddress,
  } = useCheckoutStore();
  
  const [stripeProduct, setStripeProduct] = useState<StripeProduct | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState({ firstName: '', lastName: '', email: '', phone: '', dob: '' });
  const [editingAddress, setEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState<ShippingAddress | null>(null);

  // Load patient info and address from intake
  useEffect(() => {
    const info = getPatientInfoFromIntake();
    setPatientInfo(info);
    
    // Load shipping address
    const address = shippingAddress || loadShippingFromIntake();
    if (address) {
      setShippingAddress(address);
      setEditedAddress(address);
    }
  }, [shippingAddress, setShippingAddress]);

  // Load product from Stripe
  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch('/api/stripe/products');
        const data = await response.json();
        
        if (data.success && data.product) {
          setStripeProduct(data.product);
          
          // Pre-select the monthly price (first/lowest)
          if (data.product.prices.length > 0) {
            // Find the monthly price (interval_count = 1)
            const monthlyPrice = data.product.prices.find(
              (p: StripePrice) => p.interval === 'month' && p.intervalCount === 1
            );
            if (monthlyPrice) {
              setSelectedPriceId(monthlyPrice.id);
            }
          }
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, []);

  // Update selected product when price changes
  useEffect(() => {
    if (stripeProduct && selectedPriceId) {
      const selectedPrice = stripeProduct.prices.find(p => p.id === selectedPriceId);
      if (selectedPrice) {
        const product: Product = {
          id: stripeProduct.id,
          name: stripeProduct.name,
          description: stripeProduct.description || '',
          priceId: selectedPriceId,
          price: selectedPrice.unitAmount,
          currency: selectedPrice.currency,
          interval: selectedPrice.interval === 'month' && selectedPrice.intervalCount === 1 
            ? 'month' 
            : 'one_time', // Treat multi-month as one-time for display
          metadata: {
            medication: 'Tirzepatide',
            intervalCount: String(selectedPrice.intervalCount),
          },
        };
        setSelectedProduct(product);
      }
    }
  }, [selectedPriceId, stripeProduct, setSelectedProduct]);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-US' : 'en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getIntervalLabel = (price: StripePrice) => {
    if (price.interval === 'month') {
      if (price.intervalCount === 1) return t.perMonth;
      if (price.intervalCount === 3) return t.every3Months;
      if (price.intervalCount === 6) return t.every6Months;
    }
    return t.oneTime;
  };

  const getMonthlyEquivalent = (price: StripePrice) => {
    if (price.interval === 'month' && price.intervalCount > 1) {
      const monthly = price.unitAmount / price.intervalCount;
      return formatPrice(monthly, price.currency);
    }
    return null;
  };

  const getSavingsPercent = (price: StripePrice, monthlyPrice: StripePrice | undefined) => {
    if (!monthlyPrice || price.intervalCount === 1) return null;
    
    const monthlyTotal = monthlyPrice.unitAmount * price.intervalCount;
    const savings = monthlyTotal - price.unitAmount;
    const percent = Math.round((savings / monthlyTotal) * 100);
    
    return percent > 0 ? percent : null;
  };

  const handleContinue = () => {
    if (selectedProduct) {
      router.push('/checkout/payment');
    }
  };

  const handleSaveAddress = () => {
    if (editedAddress) {
      setShippingAddress(editedAddress);
      sessionStorage.setItem('intake_address', JSON.stringify(editedAddress));
    }
    setEditingAddress(false);
  };

  // Get monthly price for savings calculation
  const monthlyPrice = stripeProduct?.prices.find(
    p => p.interval === 'month' && p.intervalCount === 1
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-1/3 bg-[#cab172] transition-all duration-300"></div>
      </div>

      {/* Back button */}
      <div className="px-[15px] pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={() => router.back()}
          className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      {/* Logo */}
      <OTMensLogo compact={true} />

      {/* Main content */}
      <div className="flex-1 px-[15px] py-4 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h1 className="page-title mb-2">{t.title}</h1>
            <p className="page-subtitle">{t.subtitle}</p>
          </div>

          {/* Product Info */}
          {stripeProduct && (
            <div className="flex items-center space-x-4 p-4 bg-[#f5ecd8] rounded-2xl">
              {stripeProduct.image && (
                <img 
                  src={stripeProduct.image} 
                  alt={stripeProduct.name}
                  className="w-16 h-16 object-cover rounded-xl"
                />
              )}
              <div>
                <h2 className="font-semibold text-[#413d3d]">{stripeProduct.name}</h2>
                {stripeProduct.description && (
                  <p className="text-sm text-[#413d3d]/70">{stripeProduct.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Shipping Address Card */}
          {shippingAddress && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-[#413d3d]">{t.shipping}</h3>
                <button 
                  onClick={() => setEditingAddress(!editingAddress)}
                  className="text-sm text-[#cab172] hover:underline font-medium"
                >
                  {t.editAddress}
                </button>
              </div>
              
              {editingAddress ? (
                <div className="space-y-3 mt-3">
                  <input
                    type="text"
                    value={editedAddress?.street || ''}
                    onChange={(e) => setEditedAddress({ ...editedAddress!, street: e.target.value })}
                    placeholder="Street address"
                    className="input-field w-full"
                  />
                  <input
                    type="text"
                    value={editedAddress?.unit || ''}
                    onChange={(e) => setEditedAddress({ ...editedAddress!, unit: e.target.value })}
                    placeholder="Apt, Suite (optional)"
                    className="input-field w-full"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editedAddress?.city || ''}
                      onChange={(e) => setEditedAddress({ ...editedAddress!, city: e.target.value })}
                      placeholder="City"
                      className="input-field w-full"
                    />
                    <input
                      type="text"
                      value={editedAddress?.zipCode || ''}
                      onChange={(e) => setEditedAddress({ ...editedAddress!, zipCode: e.target.value })}
                      placeholder="ZIP Code"
                      className="input-field w-full"
                    />
                  </div>
                  <button
                    onClick={handleSaveAddress}
                    className="w-full py-2 bg-[#413d3d] text-white rounded-full text-sm font-medium"
                  >
                    Save Address
                  </button>
                </div>
              ) : (
                <div className="text-sm text-[#413d3d]/80">
                  <p className="font-medium">{patientInfo.firstName} {patientInfo.lastName}</p>
                  <p>{shippingAddress.street}{shippingAddress.unit ? `, ${shippingAddress.unit}` : ''}</p>
                  {patientInfo.email && <p>{patientInfo.email}</p>}
                  {patientInfo.phone && <p>{patientInfo.phone}</p>}
                </div>
              )}
            </div>
          )}

          {/* Pricing Options */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cab172]"></div>
              <span className="ml-3 text-[#413d3d]/70">{t.loadingProducts}</span>
            </div>
          ) : !stripeProduct ? (
            <div className="text-center py-12 text-[#413d3d]/70">
              {t.noProducts}
            </div>
          ) : (
            <div className="space-y-3">
              {stripeProduct.prices.map((price, index) => {
                const savings = getSavingsPercent(price, monthlyPrice);
                const monthlyEquiv = getMonthlyEquivalent(price);
                const isSelected = selectedPriceId === price.id;
                const isBestValue = price.intervalCount === 6;
                const isPopular = price.intervalCount === 1;

                return (
                  <button
                    key={price.id}
                    onClick={() => setSelectedPriceId(price.id)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all relative ${
                      isSelected
                        ? 'border-[#cab172] bg-[#f5ecd8]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Badge */}
                    {(isBestValue || isPopular) && (
                      <span 
                        className={`absolute -top-3 left-4 px-3 py-1 text-xs font-medium rounded-full ${
                          isBestValue 
                            ? 'bg-[#cab172]' 
                            : 'bg-[#413d3d]'
                        }`}
                        style={{ color: '#ffffff' }}
                      >
                        {isBestValue ? t.bestValue : t.mostPopular}
                      </span>
                    )}
                    
                    <div className="flex items-center justify-between">
                      {/* Left side - Price info */}
                      <div className="flex items-center space-x-3">
                        {/* Selection circle */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'border-[#cab172] bg-[#cab172]'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        <div>
                          <div className="font-semibold text-[#413d3d]">
                            {price.label}
                          </div>
                          {monthlyEquiv && (
                            <div className="text-xs text-[#413d3d]/60">
                              {monthlyEquiv}{t.monthlyEquivalent}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right side - Amount & savings */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#413d3d]">
                          {formatPrice(price.unitAmount, price.currency)}
                        </div>
                        {savings && (
                          <div className="text-xs text-green-600 font-medium">
                            {t.savings} {savings}%
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* What's Included */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-[#413d3d] mb-3">{t.included}</h3>
            <ul className="space-y-2">
              {t.includes.map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-[#cab172] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-[#413d3d]/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-[15px] pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={handleContinue}
          disabled={!selectedProduct}
          className="continue-button"
        >
          <span>{selectedProduct ? t.continueToPayment : t.selectPlan}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Order summary when product selected */}
        {selectedProduct && (
          <div className="mt-4 p-3 bg-[#f5ecd8] rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#413d3d]/70">{t.orderSummary}</span>
              <span className="font-semibold text-[#413d3d]">
                {formatPrice(selectedProduct.price, selectedProduct.currency)}
              </span>
            </div>
          </div>
        )}
        
        {/* Copyright footer */}
        <div className="mt-6 text-center">
          <CopyrightText />
        </div>
      </div>
    </div>
  );
}
