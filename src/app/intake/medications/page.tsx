'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import OTMensLogo from '@/components/OTMensLogo';

export default function MedicationsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [selected, setSelected] = useState<'yes' | 'no' | null>(null);

  // Auto-advance on selection
  const handleSelect = (option: 'yes' | 'no') => {
    setSelected(option);
    sessionStorage.setItem('taking_medications', option);

    // Navigate after brief delay for visual feedback
    setTimeout(() => {
      if (option === 'yes') {
        router.push('/intake/medications-selection');
      } else {
        // Skip allergies page and go directly to kidney conditions
        router.push('/intake/kidney-conditions');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[85%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href="/intake/digestive-conditions" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* OTMens Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Estás tomando algún medicamento o suplemento actualmente?'
              : 'Are you currently taking any medications or supplements?'}
          </h1>
          
          {/* Yes/No Options - auto-advance on selection */}
          <div className="space-y-3">
            <button
              onClick={() => handleSelect('yes')}
              className={`option-button w-full text-left p-4 rounded-2xl transition-all ${
                selected === 'yes' ? 'selected' : ''
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded mr-3 flex items-center justify-center flex-shrink-0 border ${
                  selected === 'yes'
                    ? 'bg-[#f5ecd8] border-[#413d3d]'
                    : 'border-gray-300 bg-white'
                }`}>
                  {selected === 'yes' && (
                    <svg className="w-3 h-3 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[16px] lg:text-lg font-medium leading-tight text-[#413d3d]">
                  {language === 'es' ? 'Sí' : 'Yes'}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => handleSelect('no')}
              className={`option-button w-full text-left p-4 rounded-2xl transition-all ${
                selected === 'no' ? 'selected' : ''
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded mr-3 flex items-center justify-center flex-shrink-0 border ${
                  selected === 'no'
                    ? 'bg-[#f5ecd8] border-[#413d3d]'
                    : 'border-gray-300 bg-white'
                }`}>
                  {selected === 'no' && (
                    <svg className="w-3 h-3 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[16px] lg:text-lg font-medium leading-tight text-[#413d3d]">
                  {language === 'es' ? 'No' : 'No'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Copyright footer */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
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
