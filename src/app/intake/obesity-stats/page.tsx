'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEnterNavigation } from '@/hooks/useEnterNavigation';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function ObesityStatsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [showContainer, setShowContainer] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    setMounted(true);
    // Trigger container animation after a delay
    const timer = setTimeout(() => {
      setShowContainer(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Auto-advance after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/medication-preference');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  const handleNext = () => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      router.push('/intake/medication-preference');
    }
  };

  // Enable Enter key navigation
  useEnterNavigation(handleNext);

  const handleBack = () => {
    router.push('/intake/goals');
  };

  if (!mounted) return null;

  const isSpanish = language === 'es';
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[4%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button - extra top padding for mobile */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <button
          onClick={handleBack}
          className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg"
        >
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      {/* EONMeds Logo */}
      <EonmedsLogo compact={true} />

      {/* Image and Reference - matching support-info page structure */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className={`relative w-full transition-all duration-1000 ease-out transform ${
          showContainer ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}>
          <Image
            src={isSpanish 
              ? "https://static.wixstatic.com/media/c49a9b_97794b4b6d264743b5eb4ccd8dc1e7a2~mv2.webp"
              : "https://static.wixstatic.com/media/c49a9b_a9abfe04c0984333bd15070af7de2a72~mv2.webp"
            }
            alt="Obesity statistics"
            width={500}
            height={600}
            className="w-full h-auto rounded-2xl"
            priority
          />
          
          {/* Reference Link */}
          <div className="mt-4 text-left">
            <a 
              href={isSpanish 
                ? "https://minorityhealth.hhs.gov/obesity-and-hispanic-americans?utm_source=chatgpt.com"
                : "https://www.tfah.org/story/new-national-adult-obesity-data-show-level-trend/?utm_source=chatgpt.com"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#413d3d]/60 hover:text-[#413d3d]/80 underline transition-colors"
            >
              {isSpanish 
                ? 'Fuente: Oficina de Salud de Minorías - HHS' 
                : 'Source: Trust for America\'s Health'}
            </a>
          </div>

          {/* Copyright footer - positioned below image and link */}
          <div className="mt-6 text-center">
            <p className="copyright-text">
              {isSpanish ? (
                <>
                  © 2025 EONPro, LLC. Todos los derechos reservados.<br/>
                  Proceso exclusivo y protegido. Copiar o reproducir sin autorización está prohibido.
                </>
              ) : (
                <>
                  © 2025 EONPro, LLC. All rights reserved.<br/>
                  Exclusive and protected process. Copying or reproduction without authorization is prohibited.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}