'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function FamilyConditionsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const conditions = language === 'es' ? [
    { id: 'thyroid_cancer', label: 'Cáncer medular de tiroides' },
    { id: 'men', label: 'Neoplasia endocrina múltiple' },
    { id: 'pancreatitis', label: 'Pancreatitis' },
    { id: 'gastroparesis', label: 'Gastroparesia', sublabel: 'vaciamiento gástrico retardado' },
    { id: 'diabetes_t2', label: 'Diabetes tipo 2' },
    { id: 'long_qt', label: 'Síndrome de QT largo' },
    { id: 'none', label: 'No, ninguna de estas' }
  ] : [
    { id: 'thyroid_cancer', label: 'Medullary thyroid cancer' },
    { id: 'men', label: 'Multiple endocrine neoplasia' },
    { id: 'pancreatitis', label: 'Pancreatitis' },
    { id: 'gastroparesis', label: 'Gastroparesis', sublabel: 'delayed gastric emptying' },
    { id: 'diabetes_t2', label: 'Type 2 diabetes' },
    { id: 'long_qt', label: 'Long QT syndrome' },
    { id: 'none', label: 'No, none of these' }
  ];

  const handleSelect = (conditionId: string) => {
    // Single select with auto-advance
    setSelectedConditions([conditionId]);
    sessionStorage.setItem('family_conditions', JSON.stringify([conditionId]));
    
    // Route map for follow-up pages
    const routeMap: { [key: string]: string } = {
      'thyroid_cancer': '/intake/thyroid-cancer-personal',
      'men': '/intake/men-personal',
      'pancreatitis': '/intake/pancreatitis-personal',
      'gastroparesis': '/intake/gastroparesis-personal',
      'diabetes_t2': '/intake/diabetes-personal',
    };
    
    setTimeout(() => {
      // If condition has a follow-up page, go there
      if (routeMap[conditionId]) {
        router.push(routeMap[conditionId]);
      } else {
        // "none" or "long_qt" - go to pregnancy
        router.push('/intake/pregnancy');
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[91%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/medical-conditions" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* EONMeds Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-6">
          <div>
            <h1 className="page-title">
              {language === 'es' 
                ? '¿Tú o algún miembro de tu familia ha sido diagnosticado con alguna de las siguientes condiciones?'
                : 'Have you or any family member been diagnosed with any of the following conditions?'}
            </h1>
            <p className="page-subtitle text-sm mt-3">
              {language === 'es'
                ? 'Preguntamos porque algunas condiciones pueden determinar qué tipo de tratamiento es el más adecuado para ti.'
                : 'We ask because some conditions may determine what type of treatment is most appropriate for you.'}
            </p>
          </div>
          
          {/* Condition options */}
          <div className="space-y-3">
            {conditions.map((condition) => (
              <button
                key={condition.id}
                onClick={() => handleSelect(condition.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedConditions.includes(condition.id)
                    ? 'border-[#f5ecd8] bg-[#f5ecd8]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedConditions.includes(condition.id)
                      ? 'border-[#f5ecd8] bg-[#f5ecd8]'
                      : 'border-gray-300'
                  }`}>
                    {selectedConditions.includes(condition.id) && (
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span className="text-[16px] lg:text-lg font-medium leading-tight">
                      {condition.label}
                    </span>
                    {condition.sublabel && (
                      <span className="text-sm text-gray-500 block">
                        {condition.sublabel}
                      </span>
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
