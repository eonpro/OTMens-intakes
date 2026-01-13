'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';
import CopyrightText from '@/components/CopyrightText';

export default function MedicalTeamPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [showImage, setShowImage] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Staggered animations - title first, then image, then texts
    const timers = [
      setTimeout(() => setShowTitle(true), 100),
      setTimeout(() => setShowImage(true), 400),
      setTimeout(() => setShowText1(true), 700),
      setTimeout(() => setShowText2(true), 1000),
    ];

    // Auto-advance after 4 seconds
    const navigationTimer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/common-side-effects');
      }
    }, 4000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(navigationTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[90%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/safety-quality" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
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
          {/* Title - now on top */}
          <div className={`transition-all duration-700 ease-out ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <h1 className="text-[28px] lg:text-[32px] font-bold text-[#413d3d] leading-tight">
              {language === 'es' 
                ? (<>A message from our<br />Medical team</>)
                : (<>A message from our<br />Medical team</>)}
            </h1>
          </div>

          {/* Doctor images - now below title */}
          <div className={`flex justify-center transition-all duration-700 ease-out ${
            showImage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}>
            <img 
              src="https://static.wixstatic.com/media/c49a9b_5cf2a61d62d74615a17f3324ee0248f2~mv2.webp"
              alt={language === 'es' ? 'Equipo médico' : 'Medical team'}
              className="w-full max-w-[280px] md:max-w-sm h-auto"
            />
          </div>

          {/* Text 1 - now below image */}
          <div className={`transition-all duration-700 ease-out ${
            showText1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <p className="text-lg text-gray-700 leading-relaxed">
              {language === 'es'
                ? 'Es común experimentar efectos secundarios. Nuestros médicos pueden personalizar tu plan para minimizarlos.'
                : 'Side effects are common. Our physicians can customize your plan to minimize them.'}
            </p>
          </div>

          {/* Text 2 with highlight */}
          <div className={`transition-all duration-700 ease-out ${
            showText2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <p className="text-lg text-gray-700 leading-relaxed">
              {language === 'es'
                ? 'Las siguientes preguntas ayudarán a encontrar '
                : 'The next questions will help find '}
              <span className="text-[#cab172] font-semibold">
                {language === 'es'
                  ? 'el mejor enfoque para ti.'
                  : 'the best approach for you.'}
              </span>
            </p>
          </div>

          {/* Animated dots */}
          <div className={`flex justify-center gap-2 pt-4 transition-all duration-500 ${
            showText2 ? 'opacity-100' : 'opacity-0'
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
        <CopyrightText />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
