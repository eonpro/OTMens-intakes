'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function GastroparesisPersonalPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState('');

  // Get next page based on selected family conditions
  const getNextPage = () => {
    const conditions = JSON.parse(sessionStorage.getItem('family_conditions') || '[]');
    
    // Check if diabetes_t2 was selected
    if (conditions.includes('diabetes_t2')) {
      return '/intake/diabetes-personal';
    }
    return '/intake/pregnancy';
  };

  // Auto-advance on selection
  const handleSelect = (value: string) => {
    setSelected(value);
    sessionStorage.setItem('personal_gastroparesis', value);
    setTimeout(() => {
      router.push(getNextPage());
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[95%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/pancreatitis-personal" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
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
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Tienes antecedentes personales de gastroparesia (vaciamiento gástrico retardado)?'
              : 'Do you have a personal history of gastroparesis (delayed gastric emptying)?'}
          </h1>
          
          {/* Yes/No options - auto-advance on selection */}
          <div className="space-y-3">
            <button
              onClick={() => handleSelect('yes')}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selected === 'yes'
                  ? 'border-[#f5ecd8] bg-[#f5ecd8]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                  selected === 'yes'
                    ? 'border-[#f5ecd8] bg-[#f5ecd8]'
                    : 'border-gray-300'
                }`}>
                  {selected === 'yes' && (
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[16px] lg:text-lg font-medium leading-tight">
                  {language === 'es' ? 'Sí' : 'Yes'}
                </span>
              </div>
            </button>
            
            <button
              onClick={() => handleSelect('no')}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selected === 'no'
                  ? 'border-[#f5ecd8] bg-[#f5ecd8]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                  selected === 'no'
                    ? 'border-[#f5ecd8] bg-[#f5ecd8]'
                    : 'border-gray-300'
                }`}>
                  {selected === 'no' && (
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[16px] lg:text-lg font-medium leading-tight">
                  No
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Copyright footer */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="text-center">
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
