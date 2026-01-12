'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';
import CopyrightText from '@/components/CopyrightText';

export default function TreatmentBenefitsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [showContainer, setShowContainer] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContainer(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/glp1-history');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  const handleContinue = () => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      router.push('/intake/glp1-history');
    }
  };

  const benefits = [
    {
      id: 'appetite',
      title: {
        es: 'Controla tu apetito',
        en: 'Control your appetite'
      },
      description: {
        es: 'Despídete del hambre y antojos',
        en: 'Say goodbye to hunger and cravings'
      },
      bgColor: 'bg-[#f7d06b]',
      image: 'https://static.wixstatic.com/media/c49a9b_b620bbcfc38b4eb68d480147dd1f4a65~mv2.webp'
    },
    {
      id: 'digestion',
      title: {
        es: 'Mejor Digestión',
        en: 'Better Digestion'
      },
      description: {
        es: 'Te llenas más rápido y por más tiempo',
        en: 'Feel fuller faster and for longer'
      },
      bgColor: 'bg-[#EFECE7]',
      image: 'https://static.wixstatic.com/media/c49a9b_a943a1c0cdc7476496fd819de1171e88~mv2.jpg'
    },
    {
      id: 'levels',
      title: {
        es: 'Niveles estables',
        en: 'Stable levels'
      },
      description: {
        es: 'Mantén tu nivel de azúcar bajo control',
        en: 'Keep your blood sugar under control'
      },
      bgColor: 'bg-[#f5ecd8]',
      image: 'https://static.wixstatic.com/media/c49a9b_d75d94d455584a6cb15d4faacf8011c7~mv2.webp'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[81%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/blood-pressure" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <OTMensLogo compact={true} />
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full transition-all duration-1000 ease-out transform ${
        showContainer ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="space-y-6">
          <h1 className="text-2xl lg:text-3xl font-semibold leading-tight text-black">
            {language === 'es' 
              ? 'Nuestros tratamientos te ayudan de la siguiente manera'
              : 'Our treatments help you in the following ways'}
          </h1>

          {/* Benefit cards */}
          <div className="space-y-4 md:space-y-5">
            {benefits.map((benefit) => (
              <div 
                key={benefit.id} 
                className={`${benefit.bgColor} rounded-3xl overflow-hidden`}
              >
                {/* Flex container with proper responsive layout */}
                <div className="flex items-stretch min-h-[120px] lg:min-h-[140px]">
                  {/* Text content - left side on both mobile and desktop */}
                  <div className="flex-1 p-4 lg:p-6 flex flex-col justify-center">
                    <h2 className="text-[20px] lg:text-[22px] font-semibold mb-1 text-black">
                      {language === 'es' ? benefit.title.es : benefit.title.en}
                    </h2>
                    <p className="text-[16px] lg:text-[18px] text-gray-700 leading-tight">
                      {language === 'es' ? benefit.description.es : benefit.description.en}
                    </p>
                  </div>
                  
                  {/* Image container - right side */}
                  <div className="w-32 lg:w-48 flex-shrink-0">
                    <img 
                      src={benefit.image}
                      alt={language === 'es' ? benefit.title.es : benefit.title.en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Copyright text */}
        <CopyrightText className="mt-4" />
      </div>
    </div>
  );
}
