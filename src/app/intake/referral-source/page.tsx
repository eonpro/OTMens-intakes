'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';
import CopyrightText from '@/components/CopyrightText';

export default function ReferralSourcePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState('');

  const sources = [
    {
      id: 'instagram',
      es: 'Instagram',
      en: 'Instagram'
    },
    {
      id: 'facebook',
      es: 'Facebook',
      en: 'Facebook'
    },
    {
      id: 'friend_family',
      es: 'Amigo/Familia',
      en: 'Friend/Family'
    },
    {
      id: 'google',
      es: 'Google',
      en: 'Google'
    },
    {
      id: 'univision',
      es: 'Univision/Telemundo',
      en: 'Univision/Telemundo'
    },
    {
      id: 'youtube',
      es: 'Youtube',
      en: 'Youtube'
    },
    {
      id: 'tiktok',
      es: 'Tiktok',
      en: 'Tiktok'
    },
    {
      id: 'eonmeds_rep',
      es: 'Representante de EONMeds',
      en: 'EONMeds Representative'
    }
  ];

  // Auto-advance on selection
  const handleSelect = (sourceId: string) => {
    setSelected(sourceId);
    sessionStorage.setItem('referral_sources', JSON.stringify([sourceId]));
    
    setTimeout(() => {
      // If friend/family or EONMeds rep is selected, go to name page
      if (sourceId === 'friend_family' || sourceId === 'eonmeds_rep') {
        router.push('/intake/referral-name');
      } else {
        router.push('/intake/health-improvements');
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[94%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/personalized-treatment" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
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
            <h1 className="page-title mb-3">
              {language === 'es' 
                ? 'Como escuchaste sobre EONMeds?'
                : 'How did you hear about EONMeds?'}
            </h1>
            <p className="page-subtitle">
              {language === 'es'
                ? 'Nuestra misión es ayudar al mayor número de personas posible a mejorar su calidad de vida. Saber cómo nuestros pacientes nos encuentran es clave para entender cómo llegar a más personas como tú.'
                : 'Our mission is to help as many people as possible improve their quality of life. Knowing how our patients find us is key to understanding how to reach more people like you.'}
            </p>
          </div>

          <div className="space-y-3">
            {sources.map((source) => (
              <button
                key={source.id}
                onClick={() => handleSelect(source.id)}
                className={`w-full p-4 text-left rounded-2xl transition-all flex items-center ${
                  selected === source.id
                    ? 'bg-[#f5ecd8] border border-[#cab172]'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center mr-3 transition-all ${
                  selected === source.id ? 'bg-white border-[#413d3d]' : 'bg-white border-gray-300'
                }`}>
                  {selected === source.id && (
                    <svg className="w-3 h-3 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-base lg:text-lg font-medium text-[#413d3d]">
                  {language === 'es' ? source.es : source.en}
                </span>
              </button>
            ))}
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
