'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';
import CopyrightText from '@/components/CopyrightText';

export default function TirzepatideSuccessPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState('');

  const successOptions = [
    {
      id: 'very_successful',
      es: 'Muy exitosa, bajé de peso y lo mantuve',
      en: 'Very successful, I lost weight and kept it off'
    },
    {
      id: 'somewhat_successful',
      es: 'Algo exitosa, bajé de peso pero volví a subir algo',
      en: 'Somewhat successful, I lost weight but gained some back'
    },
    {
      id: 'not_successful',
      es: 'No fue exitosa, no bajé mucho de peso',
      en: "Not successful, I didn't lose much weight"
    },
    {
      id: 'hard_consistency',
      es: 'Me costó mantener la constancia',
      en: 'I had trouble maintaining consistency'
    }
  ];

  // Auto-advance on selection
  const handleSelect = (value: string) => {
    setSelected(value);
    sessionStorage.setItem('tirzepatide_success', value);
    setTimeout(() => {
      router.push('/intake/dosage-satisfaction');
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[86%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/tirzepatide-side-effects" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
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
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Qué tan exitosa ha sido su experiencia con tirzepatide (Mounjaro®, Zepbound®)?'
              : 'How successful has your experience been with tirzepatide (Mounjaro®, Zepbound®)?'}
          </h1>

          <div className="space-y-3">
            {successOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full p-4 text-left rounded-2xl transition-all flex items-center ${
                  selected === option.id
                    ? 'bg-[#f5ecd8] border border-[#cab172]'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center mr-3 transition-all ${
                  selected === option.id ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'
                }`}>
                  {selected === option.id && (
                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-base lg:text-lg">
                  {language === 'es' ? option.es : option.en}
                </span>
              </button>
            ))}
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
