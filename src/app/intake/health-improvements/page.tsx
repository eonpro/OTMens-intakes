'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';
import CopyrightText from '@/components/CopyrightText';

export default function HealthImprovementsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);

  const improvements = [
    {
      id: 'hair_regrowth',
      es: 'Crecimiento del cabello',
      en: 'Hair regrowth'
    },
    {
      id: 'sexual_health',
      es: 'Salud sexual',
      en: 'Sexual Health'
    },
    {
      id: 'testosterone_support',
      es: 'Soporte de testosterona',
      en: 'Testosterone support'
    },
    {
      id: 'muscle_fat',
      es: 'Más músculo, menos grasa',
      en: 'More muscle, less fat'
    },
    {
      id: 'longevity',
      es: 'Longevidad',
      en: 'Longevity'
    },
    {
      id: 'none',
      es: 'Ninguno de estos',
      en: 'None of these'
    }
  ];

  // Auto-advance on selection
  const handleSelect = (improvementId: string) => {
    setSelected(improvementId);
    sessionStorage.setItem('health_improvements', JSON.stringify([improvementId]));
    setTimeout(() => {
      router.push('/intake/finding-provider');
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col page-fade-in">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[96%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/referral-source" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <div>
            <h1 className="page-title mb-3">
              {language === 'es' 
                ? 'Aparte de perder peso, ¿hay otra área de tu salud que te gustaría mejorar?'
                : 'Aside from losing weight, is there another area of your health you\'d like to improve?'}
            </h1>
            <p className="page-subtitle">
              {language === 'es'
                ? 'Esto nos ayuda a obtener una imagen completa de tus objetivos de salud y encontrar las opciones de tratamiento adecuadas para ti.'
                : 'This helps us get a full picture of your health goals and find the right treatment options for you.'}
            </p>
          </div>

          <div className="space-y-3">
            {improvements.map((improvement) => (
              <button
                key={improvement.id}
                onClick={() => handleSelect(improvement.id)}
                className={`w-full p-4 text-left rounded-2xl transition-all flex items-center ${
                  selected === improvement.id
                    ? 'bg-[#f5ecd8] border border-[#cab172]'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center mr-3 transition-all ${
                  selected === improvement.id ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300'
                }`}>
                  {selected === improvement.id && (
                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-base lg:text-lg ${improvement.id === 'none' ? 'text-gray-400' : ''}`}>
                  {language === 'es' ? improvement.es : improvement.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <CopyrightText />
      </div>
    </div>
  );
}
