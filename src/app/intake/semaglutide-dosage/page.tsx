'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';
import CopyrightText from '@/components/CopyrightText';

export default function SemaglutideDosagePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState('');

  const dosages = [
    '0.25mg',
    '0.50mg',
    '0.75mg',
    '1mg',
    '1.25mg',
    '1.7mg',
    '2mg',
    '2.4mg'
  ];

  // Auto-advance on selection
  const handleSelect = (value: string) => {
    setSelected(value);
    sessionStorage.setItem('semaglutide_dosage', value);
    setTimeout(() => {
      router.push('/intake/semaglutide-side-effects');
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[84%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/glp1-type" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <EonmedsLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          <div>
            <h1 className="page-title mb-2">
              {language === 'es' 
                ? '¿Qué dosis de semaglutida inyectable (Ozempic®, Wegovy® o compuesta) está tomando?'
                : 'What dose of injectable semaglutide (Ozempic®, Wegovy® or compounded) are you taking?'}
            </h1>
            <p className="page-subtitle text-sm">
              {language === 'es'
                ? 'Indique su dosis actual en miligramos (mg) por semana.'
                : 'Indicate your current dose in milligrams (mg) per week.'}
            </p>
          </div>

          <div className="space-y-3">
            {dosages.map((dosage) => (
              <button
                key={dosage}
                onClick={() => handleSelect(dosage)}
                className={`w-full p-4 text-left rounded-2xl transition-all flex items-center ${
                  selected === dosage
                    ? 'bg-[#f5ecd8] border border-[#cab172]'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center mr-3 transition-all ${
                  selected === dosage ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'
                }`}>
                  {selected === dosage && (
                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-base lg:text-lg">{dosage}</span>
              </button>
            ))}
            
            {/* Oral option */}
            <button
              onClick={() => handleSelect('oral')}
              className={`w-full p-4 text-left rounded-2xl transition-all flex items-center ${
                selected === 'oral'
                  ? 'bg-[#f5ecd8] border border-[#cab172]'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center mr-3 transition-all ${
                selected === 'oral' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'
              }`}>
                {selected === 'oral' && (
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-base lg:text-lg">
                {language === 'es' 
                  ? 'Estoy tomando Semaglutida Oral'
                  : 'I am taking Oral Semaglutide'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Copyright footer */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-2xl mx-auto w-full">
        <CopyrightText />
      </div>
    </div>
  );
}
