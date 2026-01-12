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
  const [showTitle, setShowTitle] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const hasNavigated = useRef(false);

  // Staggered animations
  useEffect(() => {
    const timers = [
      setTimeout(() => setShowTitle(true), 100),
      setTimeout(() => setVisibleCards([0]), 300),
      setTimeout(() => setVisibleCards([0, 1]), 550),
      setTimeout(() => setVisibleCards([0, 1, 2]), 800),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-advance after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/glp1-history');
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

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
      image: 'https://static.wixstatic.com/media/c49a9b_b620bbcfc38b4eb68d480147dd1f4a65~mv2.webp',
      icon: '🍎'
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
      image: 'https://static.wixstatic.com/media/c49a9b_a943a1c0cdc7476496fd819de1171e88~mv2.jpg',
      icon: '✨'
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
      image: 'https://static.wixstatic.com/media/c49a9b_d75d94d455584a6cb15d4faacf8011c7~mv2.webp',
      icon: '💪'
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
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-6">
          {/* Animated title */}
          <div className={`transition-all duration-700 ease-out ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <h1 className="text-2xl lg:text-3xl font-semibold leading-tight text-black">
              {language === 'es' 
                ? 'Nuestros tratamientos te ayudan de la siguiente manera'
                : 'Our treatments help you in the following ways'}
            </h1>
          </div>

          {/* Benefit cards with staggered animations */}
          <div className="space-y-4 md:space-y-5">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.id} 
                className={`${benefit.bgColor} rounded-3xl overflow-hidden transition-all duration-700 ease-out ${
                  visibleCards.includes(index) 
                    ? 'opacity-100 translate-x-0 scale-100' 
                    : 'opacity-0 translate-x-8 scale-95'
                }`}
              >
                {/* Shine effect overlay */}
                <div className={`absolute inset-0 overflow-hidden pointer-events-none ${
                  visibleCards.includes(index) ? 'shine-sweep' : ''
                }`} style={{ animationDelay: `${index * 200 + 400}ms` }} />
                
                {/* Flex container with proper responsive layout */}
                <div className="flex items-stretch min-h-[100px] lg:min-h-[110px] relative">
                  {/* Text content - left side on both mobile and desktop */}
                  <div className="flex-1 p-4 lg:p-5 flex flex-col justify-center">
                    <h2 className="text-[18px] lg:text-[20px] font-semibold mb-1 text-black">
                      {language === 'es' ? benefit.title.es : benefit.title.en}
                    </h2>
                    <p className="text-[14px] lg:text-[16px] text-gray-700 leading-tight">
                      {language === 'es' ? benefit.description.es : benefit.description.en}
                    </p>
                  </div>
                  
                  {/* Image container - right side */}
                  <div className={`w-28 lg:w-36 flex-shrink-0 overflow-hidden transition-all duration-500 ${
                    visibleCards.includes(index) ? 'scale-100' : 'scale-110'
                  }`}>
                    <img 
                      src={benefit.image}
                      alt={language === 'es' ? benefit.title.es : benefit.title.en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Animated check badge - positioned to the right of text, before image */}
                  <div className={`absolute top-3 right-[7.5rem] lg:right-[9.5rem] w-6 h-6 rounded-full bg-white/80 flex items-center justify-center transition-all duration-500 ${
                    visibleCards.includes(index) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`} style={{ transitionDelay: `${index * 200 + 300}ms` }}>
                    <svg className="w-4 h-4 text-[#cab172]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Animated dots indicator */}
          <div className={`flex justify-center gap-2 pt-2 transition-all duration-500 ${
            visibleCards.length === 3 ? 'opacity-100' : 'opacity-0'
          }`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#cab172]"
                style={{
                  animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Copyright text */}
        <CopyrightText className="mt-4" />
      </div>

      <style jsx>{`
        .shine-sweep::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          animation: shineSweep 1.5s ease-in-out forwards;
        }
        @keyframes shineSweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
