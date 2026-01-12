'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import OTMensLogo from '@/components/OTMensLogo';
import CopyrightText from '@/components/CopyrightText';

export default function KidneyConditionsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [backPath, setBackPath] = useState('/intake/medications');

  // Determine correct back path based on how user got here
  useEffect(() => {
    const takingMedications = sessionStorage.getItem('taking_medications');
    // If user said "Yes" to medications, they came via allergies
    // If user said "No", they came directly from medications
    if (takingMedications === 'yes') {
      setBackPath('/intake/allergies');
    } else {
      setBackPath('/intake/medications');
    }
  }, []);

  const conditions = language === 'es' ? [
    { id: 'kidney_disease', label: 'Enfermedad renal aguda/crónica' },
    { id: 'kidney_stones', label: 'Cálculos renales' },
    { id: 'other_kidney', label: 'Otra condición renal' },
    { id: 'none', label: 'No, ninguna de estas' }
  ] : [
    { id: 'kidney_disease', label: 'Acute/chronic kidney disease' },
    { id: 'kidney_stones', label: 'Kidney stones' },
    { id: 'other_kidney', label: 'Other kidney condition' },
    { id: 'none', label: 'No, none of these' }
  ];

  const handleToggleCondition = (conditionId: string) => {
    if (conditionId === 'none') {
      // "None" is selected - save and auto-navigate
      sessionStorage.setItem('kidney_conditions', JSON.stringify(['none']));
      setTimeout(() => {
        router.push('/intake/medical-conditions');
      }, 200);
      setSelectedConditions(['none']);
    } else {
      setSelectedConditions(prev => {
        const filtered = prev.filter(c => c !== 'none');
        return prev.includes(conditionId)
          ? filtered.filter(c => c !== conditionId)
          : [...filtered, conditionId];
      });
    }
  };

  const handleContinue = () => {
    sessionStorage.setItem('kidney_conditions', JSON.stringify(selectedConditions));
    router.push('/intake/medical-conditions');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[89%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button - dynamic based on user flow */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href={backPath} className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* EONMeds Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Tienes antecedentes de alguno de los siguientes?'
              : 'Do you have a history of any of the following?'}
          </h1>
          
          {/* Condition options */}
          <div className="space-y-3">
            {conditions.map((condition) => (
              <button
                key={condition.id}
                onClick={() => handleToggleCondition(condition.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedConditions.includes(condition.id)
                    ? 'border-[#cab172] bg-[#f5ecd8]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                    selectedConditions.includes(condition.id)
                      ? 'border-[#413d3d] bg-white'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {selectedConditions.includes(condition.id) && (
                      <svg className="w-3 h-3 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[16px] lg:text-lg font-medium leading-tight text-[#413d3d]">
                    {condition.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Continue button - only show if conditions other than 'none' are selected */}
      {selectedConditions.length > 0 && !selectedConditions.includes('none') && (
        <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
          <button 
            onClick={handleContinue}
            className="w-full py-4 px-8 rounded-full text-lg font-medium flex items-center justify-center space-x-3 transition-colors bg-[#413d3d] hover:bg-[#2a2727]"
            style={{ color: '#ffffff' }}
          >
            <span style={{ color: '#ffffff' }}>{language === 'es' ? 'Continuar' : 'Continue'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      )}
      
      {/* Copyright footer */}
      <div className="px-6 lg:px-8 pb-6 max-w-md lg:max-w-lg mx-auto w-full">
        <CopyrightText />
      </div>
    </div>
  );
}
