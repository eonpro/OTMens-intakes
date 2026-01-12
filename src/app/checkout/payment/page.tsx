'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import EonmedsLogo from '@/components/EonmedsLogo';
import CopyrightText from '@/components/CopyrightText';
import { useCheckoutStore, getPatientInfoFromIntake } from '@/store/checkoutStore';

const translations = {
  en: {
    title: 'Payment Details',
    subtitle: 'Complete your order securely',
    orderSummary: 'Order Summary',
    product: 'Product',
    subtotal: 'Subtotal',
    total: 'Total',
    payNow: 'Pay Now',
    processing: 'Processing...',
    backToProducts: 'Back to product selection',
    securePayment: 'Secure payment powered by Stripe',
    noProductSelected: 'No product selected. Please go back and select a treatment.',
    paymentError: 'Payment failed. Please try again.',
    perMonth: '/month',
    oneTime: 'one-time',
    billingInfo: 'Billing Information',
    email: 'Email',
  },
  es: {
    title: 'Detalles de Pago',
    subtitle: 'Completa tu orden de forma segura',
    orderSummary: 'Resumen del Pedido',
    product: 'Producto',
    subtotal: 'Subtotal',
    total: 'Total',
    payNow: 'Pagar Ahora',
    processing: 'Procesando...',
    backToProducts: 'Volver a selección de productos',
    securePayment: 'Pago seguro procesado por Stripe',
    noProductSelected: 'No hay producto seleccionado. Por favor regresa y selecciona un tratamiento.',
    paymentError: 'El pago falló. Por favor intenta de nuevo.',
    perMonth: '/mes',
    oneTime: 'único pago',
    billingInfo: 'Información de Facturación',
    email: 'Correo Electrónico',
  },
};

export default function PaymentPage() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const { selectedProduct, setPaymentStatus, setPaymentIntentId } = useCheckoutStore();
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState({ firstName: '', lastName: '', email: '', phone: '', dob: '' });

  // Load patient info
  useEffect(() => {
    const info = getPatientInfoFromIntake();
    setPatientInfo(info);
  }, []);

  // Create PaymentIntent when component loads
  useEffect(() => {
    if (!selectedProduct) {
      setLoading(false);
      return;
    }

    async function createPaymentIntent() {
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: selectedProduct!.price,
            currency: selectedProduct!.currency,
            productId: selectedProduct!.id,
            productName: selectedProduct!.name,
            priceId: selectedProduct!.priceId, // Stripe Price ID for subscription handling
            customerEmail: patientInfo.email,
            customerName: `${patientInfo.firstName} ${patientInfo.lastName}`,
            metadata: {
              intakeId: sessionStorage.getItem('submitted_intake_id') || '',
              medication: selectedProduct!.metadata?.medication || '',
              intervalCount: selectedProduct!.metadata?.intervalCount || '1',
            },
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (err) {
        console.error('Error creating payment:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    }

    if (patientInfo.email) {
      createPaymentIntent();
    }
  }, [selectedProduct, patientInfo.email, setPaymentIntentId]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-US' : 'en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price / 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setError(null);
    setPaymentStatus('processing');

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
          payment_method_data: {
            billing_details: {
              name: `${patientInfo.firstName} ${patientInfo.lastName}`,
              email: patientInfo.email,
            },
          },
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        throw paymentError;
      }

      if (paymentIntent?.status === 'succeeded') {
        setPaymentStatus('succeeded');
        
        // Update Airtable with payment status
        const intakeId = sessionStorage.getItem('submitted_intake_id');
        if (intakeId) {
          await fetch('/api/stripe/payment-success', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              intakeId,
              paymentIntentId: paymentIntent.id,
              productName: selectedProduct?.name,
              amount: selectedProduct?.price,
            }),
          }).catch(console.error); // Don't block on this
        }
        
        router.push('/checkout/confirmation');
      } else if (paymentIntent?.status === 'requires_action') {
        // Handle 3D Secure or other required actions
        // Stripe will handle the redirect automatically
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentStatus('failed');
      setError(err instanceof Error ? err.message : t.paymentError);
    } finally {
      setProcessing(false);
    }
  };

  // No product selected
  if (!selectedProduct && !loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-[#cab172] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-[#413d3d] mb-6">{t.noProductSelected}</p>
          <button
            onClick={() => router.push('/checkout')}
            className="continue-button"
          >
            <span>{t.backToProducts}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-2/3 bg-[#cab172] transition-all duration-300"></div>
      </div>

      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
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
      <EonmedsLogo compact={true} />

      {/* Main content */}
      <div className="flex-1 px-6 lg:px-8 py-4 pb-48 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h1 className="page-title mb-2">{t.title}</h1>
            <p className="page-subtitle">{t.subtitle}</p>
          </div>

          {/* Order Summary */}
          {selectedProduct && (
            <div className="bg-[#f5ecd8] rounded-2xl p-4">
              <h3 className="font-semibold text-[#413d3d] mb-3">{t.orderSummary}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#413d3d]/70">{t.product}</span>
                  <span className="text-[#413d3d]">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#413d3d]/70">{t.subtotal}</span>
                  <span className="text-[#413d3d]">
                    {formatPrice(selectedProduct.price, selectedProduct.currency)}
                    <span className="text-xs text-[#413d3d]/60 ml-1">
                      {selectedProduct.interval === 'one_time' ? t.oneTime : t.perMonth}
                    </span>
                  </span>
                </div>
                <div className="border-t border-[#cab172]/30 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-[#413d3d]">{t.total}</span>
                    <span className="text-[#413d3d]">
                      {formatPrice(selectedProduct.price, selectedProduct.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Info */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-[#413d3d] mb-3">{t.billingInfo}</h3>
            <div className="text-sm text-[#413d3d]/80">
              <p>{patientInfo.firstName} {patientInfo.lastName}</p>
              <p>{patientInfo.email}</p>
            </div>
          </div>

          {/* Payment Form */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#cab172]"></div>
            </div>
          ) : clientSecret ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-4">
                <PaymentElement
                  options={{
                    layout: 'tabs',
                  }}
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Secure payment badge */}
              <div className="flex items-center justify-center text-sm text-[#413d3d]/60">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                {t.securePayment}
              </div>
            </form>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Sticky bottom button */}
      <div className="sticky-bottom-button max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={handleSubmit}
          disabled={!stripe || !clientSecret || processing}
          className="continue-button"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              <span>{t.processing}</span>
            </>
          ) : (
            <>
              <span>{t.payNow}</span>
              {selectedProduct && (
                <span className="ml-2">
                  ({formatPrice(selectedProduct.price, selectedProduct.currency)})
                </span>
              )}
            </>
          )}
        </button>
        
        {/* Copyright footer */}
        <div className="mt-6 text-center">
          <CopyrightText />
        </div>
      </div>
    </div>
  );
}
