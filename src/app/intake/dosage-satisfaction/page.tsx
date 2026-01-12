'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function DosageSatisfactionPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();

  // Check if user has GLP-1 history - if not, skip this page
  useEffect(() => {
    const glp1History = sessionStorage.getItem('glp1_history');
    if (glp1History === 'never_taken') {
      router.push('/intake/alcohol-consumption');
    }
  }, [router]);

  const options = [
    {
      id: 'increase',
      es: 'Sí, pero me gustaría aumentar mi dosis si hay dosis más altas disponibles y son adecuadas para mí',
      en: 'Yes, but I would like to increase my dose if higher doses are available and appropriate for me'
    },
    {
      id: 'maintain',
      es: 'Sí, quiero mantener mi dosis actual',
      en: 'Yes, I want to maintain my current dose'
    },
    {
      id: 'reduce',
      es: 'No, quiero reducir mi dosis actual',
      en: 'No, I want to reduce my current dose'
    }
  ];

  const handleSelect = (value: string) => {
    sessionStorage.setItem('dosage_satisfaction', value);
    router.push('/intake/alcohol-consumption');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[87%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/digestive-conditions" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Está satisfecho con su dosis actual de GLP-1?'
              : 'Are you satisfied with your current GLP-1 dose?'}
          </h1>

          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className="option-button w-full p-4 text-left rounded-2xl transition-all"
              >
                <span className="text-base lg:text-lg">
                  {language === 'es' ? option.es : option.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright footer */}
      <div className="px-6 lg:px-8 pb-6 max-w-md lg:max-w-lg mx-auto w-full">
        <p className="copyright-text text-center">
          {language === 'es' ? (
            <>
              © 2025 Overtime Men's Health. Todos los derechos reservados.<br/>
              Proceso exclusivo y protegido. Copiar o reproducir sin autorización está prohibido.
            </>
          ) : (
            <>
              © 2025 Overtime Men's Health. All rights reserved.<br/>
              Exclusive and protected process. Copying or reproduction without authorization is prohibited.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
