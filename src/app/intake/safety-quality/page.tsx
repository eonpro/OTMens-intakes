'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';
import CopyrightText from '@/components/CopyrightText';

export default function SafetyQualityPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [showCard, setShowCard] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const hasNavigated = useRef(false);

  // Staggered animations
  useEffect(() => {
    const timers = [
      setTimeout(() => setShowCard(true), 100),
      setTimeout(() => setShowTitle(true), 300),
      setTimeout(() => setShowText(true), 600),
      setTimeout(() => setShowBadges(true), 900),
      setTimeout(() => setShowImage(true), 1100),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-advance after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/medical-team');
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  const highlights = language === 'es' 
    ? ['503A Licenciadas', 'Seguro', 'Personalizado']
    : ['503A Licensed', 'Safe', 'Personalized'];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[89%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/alcohol-consumption" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <OTMensLogo compact={true} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className={`bg-[#EFECE7] rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-700 ease-out ${
          showCard ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}>
          {/* Shine sweep on card */}
          <div className={`absolute inset-0 pointer-events-none ${showCard ? 'shine-sweep' : ''}`} />
          
          {/* Vertical layout - image below text */}
          <div className="flex flex-col space-y-5 relative z-10">
            {/* Shield icon */}
            <div className={`flex justify-center transition-all duration-500 ${
              showTitle ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}>
              <div className="w-16 h-16 bg-[#cab172] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Title with animation */}
            <div className={`transition-all duration-700 ease-out ${
              showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              <h1 className="text-2xl lg:text-3xl font-bold leading-tight text-black text-center">
                {language === 'es' 
                  ? 'Comprometidos con la seguridad y la máxima calidad.'
                  : 'Committed to safety and the highest quality.'}
              </h1>
            </div>
            
            {/* Description with animation */}
            <div className={`transition-all duration-700 ease-out ${
              showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              <p className="text-base text-gray-700 leading-relaxed text-center">
                {language === 'es'
                  ? 'Colaboramos con las mejores farmacias 503A licenciadas para tratamientos seguros y personalizados.'
                  : 'We partner with the best 503A licensed pharmacies for safe, personalized treatments.'}
              </p>
            </div>

            {/* Highlight badges */}
            <div className={`flex flex-wrap justify-center gap-2 transition-all duration-700 ${
              showBadges ? 'opacity-100' : 'opacity-0'
            }`}>
              {highlights.map((highlight, index) => (
                <div 
                  key={highlight}
                  className={`px-4 py-2 bg-white rounded-full shadow-sm flex items-center gap-2 transition-all duration-500 ${
                    showBadges ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <svg className="w-4 h-4 text-[#cab172]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-[#413d3d]">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Image with animation */}
            <div className={`rounded-2xl overflow-hidden transition-all duration-700 ease-out ${
              showImage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}>
              <div className="relative">
                <img 
                  src="https://static.wixstatic.com/media/c49a9b_08d4b9a9d0394b3a83c2284def597b09~mv2.webp"
                  alt={language === 'es' ? 'Farmacia de calidad' : 'Quality pharmacy'}
                  className="w-full h-auto max-h-56 object-cover"
                />
                {/* Made in USA badge */}
                <div className={`absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg transition-all duration-500 ${
                  showImage ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`} style={{ transitionDelay: '300ms' }}>
                  <span className="text-xs font-semibold text-[#413d3d]">🇺🇸 Made in USA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated dots */}
        <div className={`flex justify-center gap-2 mt-6 transition-all duration-500 ${
          showImage ? 'opacity-100' : 'opacity-0'
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
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: shineSweep 2s ease-in-out 0.5s forwards;
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
