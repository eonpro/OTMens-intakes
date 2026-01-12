'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';
import CopyrightText from '@/components/CopyrightText';

export default function SemaglutideSideEffectsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const sideEffects = [
    {
      id: 'nausea_vomit',
      es: 'Náuseas/Vómitos',
      en: 'Nausea/Vomiting'
    },
    {
      id: 'diarrhea',
      es: 'Diarrea',
      en: 'Diarrhea'
    },
    {
      id: 'constipation',
      es: 'Estreñimiento',
      en: 'Constipation'
    },
    {
      id: 'bloating',
      es: 'Hinchazón',
      en: 'Bloating'
    },
    {
      id: 'abdominal_pain',
      es: 'Dolor abdominal',
      en: 'Abdominal pain'
    },
    {
      id: 'fatigue',
      es: 'Fatiga',
      en: 'Fatigue'
    },
    {
      id: 'headache',
      es: 'Dolor de cabeza',
      en: 'Headache'
    },
    {
      id: 'dizziness',
      es: 'Mareos',
      en: 'Dizziness'
    },
    {
      id: 'other',
      es: 'Otro',
      en: 'Other'
    },
    {
      id: 'none',
      es: 'No tuve efectos secundarios',
      en: 'I had no side effects'
    }
  ];

  const handleToggle = (effectId: string) => {
    if (effectId === 'none') {
      setSelectedItems(['none']);
    } else {
      if (selectedItems.includes('none')) {
        setSelectedItems([effectId]);
      } else {
        if (selectedItems.includes(effectId)) {
          setSelectedItems(selectedItems.filter(item => item !== effectId));
        } else {
          setSelectedItems([...selectedItems, effectId]);
        }
      }
    }
  };

  const handleContinue = () => {
    if (selectedItems.length > 0) {
      sessionStorage.setItem('semaglutide_side_effects', JSON.stringify(selectedItems));
      router.push('/intake/semaglutide-success');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[85%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/semaglutide-dosage" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
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
          <div>
            <h1 className="page-title mb-2">
              {language === 'es' 
                ? '¿Ha experimentado alguno de los siguientes efectos secundarios con semaglutida (Ozempic®, Wegovy®)?'
                : 'Have you experienced any of the following side effects with semaglutide (Ozempic®, Wegovy®)?'}
            </h1>
            <p className="page-subtitle text-sm">
              {language === 'es'
                ? 'Seleccione todos los que apliquen.'
                : 'Select all that apply.'}
            </p>
          </div>

          <div className="space-y-3">
            {sideEffects.map((effect) => (
              <button
                key={effect.id}
                onClick={() => handleToggle(effect.id)}
                className={`w-full p-4 text-left rounded-2xl transition-all flex items-center ${
                  selectedItems.includes(effect.id)
                    ? 'bg-[#f5ecd8] border border-[#cab172]'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center mr-3 transition-all ${
                  selectedItems.includes(effect.id) ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'
                }`}>
                  {selectedItems.includes(effect.id) && (
                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-base lg:text-lg">
                  {language === 'es' ? effect.es : effect.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={handleContinue}
          disabled={selectedItems.length === 0}
          className={`w-full py-4 px-8 rounded-full text-lg font-medium flex items-center justify-center space-x-3 transition-all ${
            selectedItems.length > 0
              ? 'bg-black text-white hover:bg-gray-900' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>{language === 'es' ? 'Continuar' : 'Continue'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright text */}
        <CopyrightText className="mt-4" />
      </div>
    </div>
  );
}
