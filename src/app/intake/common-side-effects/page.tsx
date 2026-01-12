'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function CommonSideEffectsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const sideEffects = [
    {
      id: 'gastrointestinal',
      es: 'Problemas gastrointestinales',
      en: 'Gastrointestinal problems',
      subLabel: {
        es: '(como náuseas, vómitos, diarrea, estreñimiento o hinchazón)',
        en: '(such as nausea, vomiting, diarrhea, constipation or bloating)'
      }
    },
    {
      id: 'abdominal_pain',
      es: 'Dolor abdominal',
      en: 'Abdominal pain',
      subLabel: {
        es: '(como cólicos o molestias)',
        en: '(such as cramps or discomfort)'
      }
    },
    {
      id: 'appetite_decrease',
      es: 'Disminución del apetito',
      en: 'Decreased appetite',
      subLabel: null
    },
    {
      id: 'fatigue',
      es: 'Fatiga',
      en: 'Fatigue',
      subLabel: null
    },
    {
      id: 'dizziness',
      es: 'Mareos',
      en: 'Dizziness',
      subLabel: null
    },
    {
      id: 'headache',
      es: 'Dolores de cabeza',
      en: 'Headaches',
      subLabel: null
    },
    {
      id: 'none',
      es: 'No experimento efecto alguno',
      en: 'I don\'t experience any effects',
      subLabel: null
    }
  ];

  const handleSelect = (effectId: string) => {
    // Single select with auto-advance
    setSelectedItems([effectId]);
    sessionStorage.setItem('common_side_effects', JSON.stringify([effectId]));
    setTimeout(() => {
      router.push('/intake/personalized-treatment');
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[91%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/medical-team" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <div>
            <h1 className="page-title mb-3">
              {language === 'es' 
                ? '¿Sueles presentar alguno de estos efectos secundarios al comenzar un nuevo medicamento o suplemento?'
                : 'Do you usually experience any of these side effects when starting a new medication or supplement?'}
            </h1>
            <p className="page-subtitle">
              {language === 'es'
                ? 'Nuestros doctores puede ayudarte a controlar los efectos secundarios con un plan de tratamiento personalizado. Marca todas las opciones que apliquen a tu caso.'
                : 'Our doctors can help you manage side effects with a personalized treatment plan. Select all that apply to your case.'}
            </p>
          </div>

          <div className="space-y-3">
            {sideEffects.map((effect) => (
              <button
                key={effect.id}
                onClick={() => handleSelect(effect.id)}
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
                <div>
                  <span className="text-base lg:text-lg block">
                    {language === 'es' ? effect.es : effect.en}
                  </span>
                  {effect.subLabel && (
                    <span className="text-sm text-gray-500">
                      {language === 'es' ? effect.subLabel.es : effect.subLabel.en}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
