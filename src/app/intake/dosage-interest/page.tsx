'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function DosageInterestPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const [selected, setSelected] = useState('');

  const options = isSpanish ? [
    { id: 'yes', label: 'Sí' },
    { id: 'no', label: 'No' },
    { id: 'not_sure', label: 'No estoy seguro' }
  ] : [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
    { id: 'not_sure', label: 'I\'m not sure' }
  ];

  const handleContinue = () => {
    if (selected) {
      sessionStorage.setItem('dosage_interest', selected);
      router.push('/intake/glp1-data');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[91%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/side-effects-info" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <EonmedsLogo />

      {/* Main Content */}
      <div className="flex-1 px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          {/* Title */}
          <div className="text-left">
            <h1 className="page-title">
              {isSpanish 
                ? '¿Estarías interesado en que tu proveedor considere un plan de dosis personalizado que pueda ayudar a manejar los efectos secundarios gastrointestinales como náuseas, vómitos, estreñimiento y diarrea?'
                : 'Would you be interested in your provider considering a personalized dosage plan that can help manage gastrointestinal side effects like nausea, vomiting, constipation, and diarrhea?'}
            </h1>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-left ${
                  selected === option.id
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-white border-gray-200'
                }`}
              >
                <span className="text-base lg:text-lg">{option.label}</span>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  selected === option.id
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-white border-gray-300'
                }`}>
                  {selected === option.id && (
                    <div className="w-3 h-3 rounded-full bg-black" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-2xl mx-auto w-full">
        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full py-4 px-8 rounded-full text-lg font-medium flex items-center justify-center space-x-3 transition-all ${
            selected
              ? 'bg-black text-white hover:bg-gray-900'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>{isSpanish ? 'Continuar' : 'Continue'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright text */}
        <p className="copyright-text text-center mt-4">
          {isSpanish ? (
            <>© 2025 EONPro, LLC. Todos los derechos reservados.<br/>
            Proceso exclusivo y protegido. Copiar o reproducir<br/>
            sin autorización está prohibido.</>
          ) : (
            <>© 2025 EONPro, LLC. All rights reserved.<br/>
            Exclusive and protected process. Copying or reproduction<br/>
            without authorization is prohibited.</>
          )}
        </p>
      </div>
    </div>
  );
}
