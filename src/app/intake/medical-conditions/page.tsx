'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function MedicalConditionsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const conditions = language === 'es' ? [
    { id: 'none', label: 'No, ninguna de estas aplica a mí' },
    { id: 'diabetes_t1', label: 'Diabetes (Tipo 1)', sublabel: 'Insulina Dependiente' },
    { id: 'cancer', label: 'Cáncer' },
    { id: 'glaucoma', label: 'Glaucoma' },
    { id: 'hypertension', label: 'Hipertensión', sublabel: 'Presión arterial alta' },
    { id: 'hypotension', label: 'Hipotensión', sublabel: 'Presión arterial baja' },
    { id: 'prediabetes', label: 'Prediabetes' },
    { id: 'seizure_disorder', label: 'Trastorno convulsivo', sublabel: 'Incluye epilepsia' },
    { id: 'heart_attack', label: 'Ataque al corazón', sublabel: 'Infarto' },
    { id: 'hyperlipidemia', label: 'Hiperlipidemia', sublabel: 'colesterol alto' },
    { id: 'heart_failure', label: 'Insuficiencia cardiaca congestiva' },
    { id: 'liver_problems', label: 'Problemas hepáticos' },
    { id: 'cystic_fibrosis', label: 'Fibrosis quística' },
    { id: 'hyponatremia', label: 'Hiponatremia' },
    { id: 'phenylketonuria', label: 'Fenilcetonuria' },
    { id: 'sleep_apnea', label: 'Apnea obstructiva del sueño' }
  ] : [
    { id: 'none', label: 'No, none of these apply to me' },
    { id: 'diabetes_t1', label: 'Diabetes (Type 1)', sublabel: 'Insulin Dependent' },
    { id: 'cancer', label: 'Cancer' },
    { id: 'glaucoma', label: 'Glaucoma' },
    { id: 'hypertension', label: 'Hypertension', sublabel: 'High blood pressure' },
    { id: 'hypotension', label: 'Hypotension', sublabel: 'Low blood pressure' },
    { id: 'prediabetes', label: 'Prediabetes' },
    { id: 'seizure_disorder', label: 'Seizure disorder', sublabel: 'Including epilepsy' },
    { id: 'heart_attack', label: 'Heart attack', sublabel: 'Myocardial infarction' },
    { id: 'hyperlipidemia', label: 'Hyperlipidemia', sublabel: 'High cholesterol' },
    { id: 'heart_failure', label: 'Congestive heart failure' },
    { id: 'liver_problems', label: 'Liver problems' },
    { id: 'cystic_fibrosis', label: 'Cystic fibrosis' },
    { id: 'hyponatremia', label: 'Hyponatremia' },
    { id: 'phenylketonuria', label: 'Phenylketonuria' },
    { id: 'sleep_apnea', label: 'Obstructive sleep apnea' }
  ];

  const handleToggleCondition = (conditionId: string) => {
    // Single-select with auto-advance
    setSelectedConditions([conditionId]);
    sessionStorage.setItem('medical_conditions', JSON.stringify([conditionId]));
    
    // Auto-advance after short delay
    setTimeout(() => {
      router.push('/intake/family-conditions');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[90%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/kidney-conditions" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* EONMeds Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-6">
          <div>
            <h1 className="page-title">
              {language === 'es' 
                ? '¿Has sido diagnosticado con alguna de las siguientes condiciones?'
                : 'Have you been diagnosed with any of the following conditions?'}
            </h1>
            <p className="page-subtitle text-sm mt-3">
              {language === 'es'
                ? 'Preguntamos porque algunas condiciones pueden determinar qué tipo de tratamiento es adecuado para ti.'
                : 'We ask because some conditions may determine what type of treatment is right for you.'}
            </p>
          </div>
          
          {/* Condition options */}
          <div className="space-y-2">
            {conditions.map((condition) => (
              <button
                key={condition.id}
                onClick={() => handleToggleCondition(condition.id)}
                className={`w-full text-left p-3 rounded-2xl border transition-all ${
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
      
      {/* Copyright footer */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <p className="copyright-text text-center">
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
  );
}
