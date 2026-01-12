'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import OTMensLogo from '@/components/OTMensLogo';
import CopyrightText from '@/components/CopyrightText';
import { useCheckoutStore, getPatientInfoFromIntake } from '@/store/checkoutStore';
import { trackMetaEvent } from '@/lib/meta';

const translations = {
  en: {
    title: 'Order Confirmed!',
    subtitle: 'Thank you for your purchase',
    orderNumber: 'Order Number',
    emailSent: 'A confirmation email has been sent to',
    whatHappensNext: 'What Happens Next',
    steps: [
      {
        title: 'Medical Review',
        description: 'Our licensed physician will review your intake within 24-48 hours.',
      },
      {
        title: 'Prescription Approval',
        description: 'Once approved, your prescription will be sent to our pharmacy.',
      },
      {
        title: 'Fast Shipping',
        description: 'Your medication will be shipped directly to your door with cold packaging.',
      },
      {
        title: 'Ongoing Support',
        description: 'Our medical team is available to answer any questions along the way.',
      },
    ],
    returnHome: 'Return to Home',
    questions: 'Have questions?',
    contactSupport: 'Contact our support team',
    processingPayment: 'Processing your payment...',
  },
  es: {
    title: '¡Orden Confirmada!',
    subtitle: 'Gracias por tu compra',
    orderNumber: 'Número de Orden',
    emailSent: 'Se ha enviado un correo de confirmación a',
    whatHappensNext: 'Qué Sucede Después',
    steps: [
      {
        title: 'Revisión Médica',
        description: 'Nuestro médico licenciado revisará tu cuestionario en 24-48 horas.',
      },
      {
        title: 'Aprobación de Receta',
        description: 'Una vez aprobada, tu receta será enviada a nuestra farmacia.',
      },
      {
        title: 'Envío Rápido',
        description: 'Tu medicamento será enviado directamente a tu puerta con empaque frío.',
      },
      {
        title: 'Soporte Continuo',
        description: 'Nuestro equipo médico está disponible para responder cualquier pregunta.',
      },
    ],
    returnHome: 'Volver al Inicio',
    questions: '¿Tienes preguntas?',
    contactSupport: 'Contacta a nuestro equipo de soporte',
    processingPayment: 'Procesando tu pago...',
  },
};

// Loading component for Suspense fallback
function LoadingState() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cab172] mb-4"></div>
      <p className="text-[#413d3d]">Loading...</p>
    </div>
  );
}

// Inner component that uses useSearchParams
function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const { selectedProduct, paymentIntentId, reset } = useCheckoutStore();
  const [patientInfo, setPatientInfo] = useState({ firstName: '', lastName: '', email: '', phone: '', dob: '' });
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [verifying, setVerifying] = useState(true);
  const confettiRef = useRef<boolean>(false);

  // Load patient info
  useEffect(() => {
    const info = getPatientInfoFromIntake();
    setPatientInfo(info);
  }, []);

  // Verify payment and set order number
  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    // Generate order number
    const orderId = paymentIntent || paymentIntentId || `ORD-${Date.now()}`;
    setOrderNumber(orderId.slice(-12).toUpperCase());

    // If redirected from Stripe
    if (redirectStatus === 'succeeded') {
      setVerifying(false);
      fireConfetti();
      
      // Track Purchase event
      trackMetaEvent('Purchase', {
        currency: 'USD',
        value: selectedProduct?.price ? selectedProduct.price / 100 : 0,
      });
    } else if (paymentIntentId) {
      // Direct navigation (no redirect)
      setVerifying(false);
      fireConfetti();
      
      // Track Purchase event
      trackMetaEvent('Purchase', {
        currency: 'USD',
        value: selectedProduct?.price ? selectedProduct.price / 100 : 0,
      });
    } else {
      // No payment info - might be direct navigation
      setVerifying(false);
    }
  }, [searchParams, paymentIntentId, selectedProduct]);

  // Confetti function
  const fireConfetti = () => {
    if (confettiRef.current) return;
    confettiRef.current = true;

    // Load confetti library dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.0/dist/confetti.browser.min.js';
    script.onload = () => {
      const confetti = (window as unknown as { confetti: (opts: unknown) => void }).confetti;
      if (confetti) {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 10,
            angle: 270,
            spread: 180,
            origin: { x: 0.5, y: 0 },
            gravity: 1.5,
            startVelocity: 30,
            colors: ['#cab172', '#f5ecd8', '#413d3d', '#ffffff', '#1dd1a1']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };

        frame();
      }
    };
    document.head.appendChild(script);
  };

  const handleReturnHome = () => {
    // Clear checkout state
    reset();
    // Clear session storage
    sessionStorage.clear();
    // Navigate to home
    router.push('/');
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cab172] mb-4"></div>
        <p className="text-[#413d3d]">{t.processingPayment}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar - complete */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-full bg-[#cab172] transition-all duration-300"></div>
      </div>

      {/* Logo */}
      <div className="pt-6">
        <OTMensLogo compact={true} showLottie={false} />
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 lg:px-8 py-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-6">
          {/* Success icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-[#f5ecd8] rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-[#cab172]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="page-title mb-2">{t.title}</h1>
            <p className="page-subtitle">{t.subtitle}</p>
          </div>

          {/* Order details */}
          <div className="bg-[#f5ecd8] rounded-2xl p-4 text-center">
            <p className="text-sm text-[#413d3d]/70">{t.orderNumber}</p>
            <p className="text-xl font-bold text-[#413d3d] font-mono">{orderNumber}</p>
            {patientInfo.email && (
              <p className="text-sm text-[#413d3d]/70 mt-3">
                {t.emailSent}<br />
                <span className="font-medium text-[#413d3d]">{patientInfo.email}</span>
              </p>
            )}
          </div>

          {/* What happens next */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg text-[#413d3d]">{t.whatHappensNext}</h2>
            
            <div className="space-y-4">
              {t.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#cab172] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#413d3d]">{step.title}</h3>
                    <p className="text-sm text-[#413d3d]/70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support link */}
          <div className="text-center pt-4">
            <p className="text-sm text-[#413d3d]/70">{t.questions}</p>
            <a 
              href="mailto:support@otmenhealth.com"
              className="text-[#cab172] hover:underline font-medium"
            >
              {t.contactSupport}
            </a>
          </div>
        </div>
      </div>

      {/* Sticky bottom button */}
      <div className="sticky-bottom-button max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={handleReturnHome}
          className="continue-button"
        >
          <span>{t.returnHome}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        
        {/* Copyright footer */}
        <div className="mt-6 text-center">
          <CopyrightText />
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense wrapper
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ConfirmationContent />
    </Suspense>
  );
}
