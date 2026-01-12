'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';
import CopyrightText from '@/components/CopyrightText';

export default function PersonalizedTreatmentPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState('');

  // Auto-advance on selection
  const handleSelect = (value: string) => {
    setSelected(value);
    sessionStorage.setItem('personalized_treatment_interest', value);
    setTimeout(() => {
      router.push('/intake/referral-source');
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col page-fade-in">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[92%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href="/intake/common-side-effects" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <EonmedsLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <h1 className="page-title" style={{ lineHeight: '1.35' }}>
            {language === 'es' 
              ? <>¿Te interesaría que tu proveedor considere un plan de <span style={{ backgroundColor: '#f2fdb4', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' } as React.CSSProperties}>tratamiento personalizado sin costo adicional</span> para ayudarte a manejar cualquier efecto secundario?</>
              : <>Would you be interested in having your provider consider a <span style={{ backgroundColor: '#f2fdb4', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' } as React.CSSProperties}>personalized treatment plan at no extra cost</span> to help you manage any side effects?</>}
          </h1>

          {/* Yes/No options - auto-advance on selection */}
          <div className="space-y-3">
            <button
              onClick={() => handleSelect('yes')}
              className={`w-full p-4 text-left rounded-2xl transition-all flex items-center ${
                selected === 'yes'
                  ? 'bg-[#f5ecd8] border border-[#cab172]'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center mr-3 transition-all ${
                selected === 'yes' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'
              }`}>
                {selected === 'yes' && (
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-base lg:text-lg">
                {language === 'es' ? 'Sí, por favor' : 'Yes, please'}
              </span>
            </button>

            <button
              onClick={() => handleSelect('no')}
              className={`w-full p-4 text-left rounded-2xl transition-all flex items-center ${
                selected === 'no'
                  ? 'bg-[#f5ecd8] border border-[#cab172]'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center mr-3 transition-all ${
                selected === 'no' ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'
              }`}>
                {selected === 'no' && (
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-base lg:text-lg">
                {language === 'es' ? 'No, estoy bien' : "No, I'm ok"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Copyright footer */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <CopyrightText />
      </div>
    </div>
  );
}
