'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import EonmedsLogo from '@/components/EonmedsLogo';
import { useTranslation } from '@/hooks/useTranslation';

export default function MentalHealthConditionsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);

  const conditions = language === 'es' ? [
    { value: 'none', label: 'No, nunca.' },
    { value: 'depression', label: 'Depresión' },
    { value: 'bipolar', label: 'Trastorno bipolar' },
    { value: 'bpd', label: 'Trastorno límite de personalidad', subtext: '(TLP)' },
    { value: 'panic', label: 'Ataques de pánico' },
    { value: 'schizophrenia', label: 'Esquizofrenia' },
    { value: 'psychosis', label: 'Psicosis' }
  ] : [
    { value: 'none', label: 'No, never.' },
    { value: 'depression', label: 'Depression' },
    { value: 'bipolar', label: 'Bipolar disorder' },
    { value: 'bpd', label: 'Borderline personality disorder', subtext: '(BPD)' },
    { value: 'panic', label: 'Panic attacks' },
    { value: 'schizophrenia', label: 'Schizophrenia' },
    { value: 'psychosis', label: 'Psychosis' }
  ];

  const handleSelect = (value: string) => {
    // Single select with auto-advance
    setSelected([value]);
    sessionStorage.setItem('mental_health_conditions', JSON.stringify([value]));
    setTimeout(() => {
      router.push('/intake/programs-include');
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[72%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/mental-health" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* EONMeds Logo */}
      <EonmedsLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-8 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          {/* Title */}
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Has sido diagnosticado con alguno de los siguientes?'
              : 'Have you been diagnosed with any of the following?'}
          </h1>
          
          {/* Description */}
          <p className="page-subtitle">
            {language === 'es'
              ? 'Preguntamos esto porque algunas de estas condiciones pueden influir en el tipo de tratamiento más adecuado para ti.'
              : 'We ask this because some of these conditions may influence the type of treatment that is most appropriate for you.'}
          </p>
          
          {/* Options */}
          <div className="space-y-3">
            {conditions.map((condition) => (
              <button
                key={condition.value}
                onClick={() => handleSelect(condition.value)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selected.includes(condition.value)
                    ? 'border-[#f5ecd8] bg-[#f5ecd8]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                    selected.includes(condition.value)
                      ? 'border-[#f5ecd8] bg-[#f5ecd8]'
                      : 'border-gray-300'
                  }`}>
                    {selected.includes(condition.value) && (
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-[16px] lg:text-lg font-medium leading-tight">{condition.label}</span>
                    {condition.subtext && (
                      <div className="text-sm text-gray-500 mt-0.5">{condition.subtext}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
