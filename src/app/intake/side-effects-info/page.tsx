'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import OTMensLogo from '@/components/OTMensLogo';

export default function SideEffectsInfoPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger animation with delay
    const timer = setTimeout(() => setShowContent(true), 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleNext = () => {
    router.push('/intake/dosage-interest');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[89%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/weight-loss-support" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <OTMensLogo compact={true} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 lg:px-8 py-8">
        <div className="max-w-md lg:max-w-lg w-full">
          {/* Animated text */}
          <div className={`transition-all duration-800 ease-out ${
            showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}>
            <h1 className="text-3xl lg:text-4xl font-medium text-black leading-tight">
              {isSpanish
                ? 'Las náuseas, vómitos, estreñimiento y diarrea son efectos secundarios tempranos comunes de los medicamentos para perder peso.'
                : 'Nausea, vomiting, constipation, and diarrhea are common early side effects of weight loss medication.'}
            </h1>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Next button */}
        <button
          onClick={handleNext}
          className="w-full py-4 px-8 rounded-full text-lg font-medium bg-black text-white hover:bg-gray-900 flex items-center justify-center space-x-3 transition-all"
        >
          <span>{isSpanish ? 'Siguiente' : 'Next'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright text */}
        <p className="copyright-text text-center mt-4">
          {isSpanish ? (
            <>© 2025 Overtime Men's Health. Todos los derechos reservados.<br/>
            Proceso exclusivo y protegido. Copiar o reproducir<br/>
            sin autorización está prohibido.</>
          ) : (
            <>© 2025 Overtime Men's Health. All rights reserved.<br/>
            Exclusive and protected process. Copying or reproduction<br/>
            without authorization is prohibited.</>
          )}
        </p>
      </div>
    </div>
  );
}
