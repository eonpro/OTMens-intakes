'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import CopyrightText from '@/components/CopyrightText';
import { trackMetaEvent } from '@/lib/meta';

export default function QualifiedPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<boolean>(false);

  useEffect(() => {
    // Track Lead event when user reaches qualified page
    trackMetaEvent('Lead');

    // Get user name from session
    const nameData = sessionStorage.getItem('intake_name');

    if (nameData) {
      try {
        const parsed = JSON.parse(nameData);
        setFirstName(parsed.firstName || '');
      } catch {
        setFirstName('');
      }
    }

    // Fire confetti after a short delay
    setTimeout(() => {
      setShowConfetti(true);
      fireConfetti();
    }, 500);
  }, []);

  // Confetti function
  const fireConfetti = () => {
    if (confettiRef.current) return;
    confettiRef.current = true;

    const runConfetti = () => {
      const confetti = (window as unknown as { confetti: (opts: unknown) => void }).confetti;
      if (confetti) {
        // Initial burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#cab172', '#f5ecd8', '#EFECE7', '#feca57', '#f7d06b']
        });

        // Continuous rain effect
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#cab172', '#EFECE7', '#feca57']
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#cab172', '#EFECE7', '#feca57']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };

        frame();
      }
    };

    // Check if confetti is already loaded
    if ((window as unknown as { confetti: unknown }).confetti) {
      runConfetti();
      return;
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src*="canvas-confetti"]');
    if (existingScript) {
      existingScript.addEventListener('load', runConfetti);
      return;
    }

    // Load confetti library dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.0/dist/confetti.browser.min.js';
    script.async = true;
    script.onload = runConfetti;
    script.onerror = () => console.error('Failed to load confetti library');
    document.head.appendChild(script);
  };

  const handleCheckout = () => {
    // Navigate to native checkout flow
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-full bg-[#f5ecd8] transition-all duration-300"></div>
      </div>

      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={() => window.history.back()}
          className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      {/* Main content - LEFT ALIGNED */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Happy couple image */}
        <div className="w-56 h-48 mb-6 rounded-xl overflow-hidden">
          <img
            src="https://static.wixstatic.com/media/c49a9b_e424b9a0a7264ab3a9f667231c71a57b~mv2.webp"
            alt="Happy couple"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title with emoji - LEFT ALIGNED */}
        <div className="space-y-4 mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
            <mark style={{ backgroundColor: '#EFECE7' }}>
              {language === 'es' ? '¡Excelentes noticias' : 'Great news'} {firstName}
            </mark>{' '}
            <span>🥳</span>{' '}
            <span className="text-[#413d3d]">—</span>
            <br />
            <span className="text-[#413d3d]">
              {language === 'es' 
                ? <>Según tus respuestas, calificas para tratamiento con <mark style={{ backgroundColor: '#EFECE7' }}>Semaglutida</mark> o <mark style={{ backgroundColor: '#EFECE7' }}>Tirzepatida</mark>.</>
                : <>Based on your answers, you qualify for treatment with either <mark style={{ backgroundColor: '#EFECE7' }}>Semaglutide</mark> or <mark style={{ backgroundColor: '#EFECE7' }}>Tirzepatide</mark>.</>
              }
            </span>
          </h1>

          <p className="text-base text-[#413d3d]">
            {language === 'es'
              ? <>Ambos son <mark style={{ backgroundColor: '#EFECE7' }}>medicamentos GLP-1</mark> altamente efectivos clínicamente comprobados para apoyar la pérdida de peso, mejorar la salud metabólica y ayudar a controlar el apetito.</>
              : <>Both are highly effective <mark style={{ backgroundColor: '#EFECE7' }}>GLP-1 medications</mark> clinically proven to support weight loss, improve metabolic health, and help curb appetite.</>
            }
          </p>
        </div>

        {/* Checkout button */}
        <button
          onClick={handleCheckout}
          className="w-full max-w-sm bg-[#413d3d] hover:bg-[#2a2727] py-3 px-6 rounded-full flex items-center justify-between transition-colors"
        >
          <div className="text-left leading-tight">
            <div className="font-semibold text-base" style={{ color: '#ffffff' }}>
              {language === 'es' ? 'Selecciona tu tratamiento' : 'Select your treatment'}
            </div>
            <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {language === 'es' ? 'Descuentos calificados serán aplicados' : 'Qualifying discounts will be applied'}
            </div>
          </div>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12m0 0l-4-4m4 4l-4 4"></path>
          </svg>
        </button>
      </div>

      {/* Confetti canvas will be added by the library */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50" />
      )}

      {/* Copyright footer */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <CopyrightText />
      </div>
    </div>
  );
}

