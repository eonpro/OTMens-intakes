'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function IdealWeightPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [idealWeight, setIdealWeight] = useState('');

  const handleContinue = () => {
    if (idealWeight) {
      sessionStorage.setItem('intake_ideal_weight', idealWeight);
      router.push('/intake/current-weight');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-2/6 bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href="/intake/address" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* EONMeds Logo */}
      <EonmedsLogo />
      
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-48 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <h1 className="page-title">{t('idealWeight.title')}</h1>
          
          <div className="space-y-3">
            <p className="page-subtitle">{t('idealWeight.subtitle')}</p>
            
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder=""
                value={idealWeight}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setIdealWeight(value);
                }}
                className="input-field w-full pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-gray-500">{t('common.lbs')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky bottom button */}
      <div className="sticky-bottom-button max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={handleContinue}
          disabled={!idealWeight}
          className="continue-button"
        >
          <span>{t('idealWeight.continue')}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright footer */}
        <div className="mt-6 text-center">
          <p className="copyright-text">
            {language === 'es' ? (
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
  );
}
