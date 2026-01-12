'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function MENPersonalPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState('');

  // Get next page based on selected family conditions
  const getNextPage = () => {
    const conditions = JSON.parse(sessionStorage.getItem('family_conditions') || '[]');
    const conditionOrder = ['pancreatitis', 'gastroparesis', 'diabetes_t2'];
    const routeMap: { [key: string]: string } = {
      'pancreatitis': '/intake/pancreatitis-personal',
      'gastroparesis': '/intake/gastroparesis-personal',
      'diabetes_t2': '/intake/diabetes-personal',
    };
    
    for (const condition of conditionOrder) {
      if (conditions.includes(condition)) {
        return routeMap[condition];
      }
    }
    return '/intake/pregnancy';
  };

  // Auto-advance on selection
  const handleSelect = (value: string) => {
    setSelected(value);
    sessionStorage.setItem('personal_men', value);
    setTimeout(() => {
      router.push(getNextPage());
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[93%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/thyroid-cancer-personal" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-6">
          <div>
            <h1 className="page-title">
              {language === 'es' 
                ? '¿Tienes antecedentes personales de neoplasia endocrina múltiple tipo 2?'
                : 'Do you have a personal history of multiple endocrine neoplasia type 2?'}
            </h1>
            <p className="page-subtitle text-sm mt-4">
              {language === 'es'
                ? 'Explicación: La neoplasia endocrina múltiple tipo 2 (MEN 2) es un síndrome genético raro que hace que ciertas glándulas del cuerpo produzcan demasiadas hormonas o desarrollen tumores (neoplasias). Es hereditario, lo que significa que se transmite de padres a hijos a través de los genes.'
                : 'Explanation: Multiple endocrine neoplasia type 2 (MEN 2) is a rare genetic syndrome that causes certain glands in the body to produce too many hormones or develop tumors (neoplasias). It is hereditary, meaning it is transmitted from parents to children through genes.'}
            </p>
          </div>
          
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
