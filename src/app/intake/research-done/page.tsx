'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';
import CopyrightText from '@/components/CopyrightText';

// Typewriter component
function TypewriterText({ text, delay = 0, speed = 30, className = '' }: { 
  text: string; 
  delay?: number; 
  speed?: number;
  className?: string;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    const startTyping = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, speed);
      
      return () => clearInterval(typeInterval);
    }, delay);
    
    return () => clearTimeout(startTyping);
  }, [text, delay, speed]);
  
  return (
    <span className={className}>
      {displayedText}
      {isTyping && displayedText.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-[#cab172] ml-1 animate-pulse" />
      )}
    </span>
  );
}

export default function ResearchDonePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [medicationPreference, setMedicationPreference] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const preference = sessionStorage.getItem('medication_preference');
    setMedicationPreference(preference);

    // Show content after short delay
    setTimeout(() => {
      setShowContent(true);
    }, 200);
  }, []);

  // Auto-advance shortly after typewriter completes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/consent');
      }
    }, 5000); // Reduced for quicker transition after typing

    return () => clearTimeout(timer);
  }, [router]);

  const handleNext = () => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      router.push('/intake/consent');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[7%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href="/intake/medication-preference" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* OTMens Logo */}
      <OTMensLogo compact={true} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-4 lg:py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-4 lg:space-y-8">
          {showContent && (
            medicationPreference === 'recommendation' ? (
              <div className="space-y-4">
                {/* Title with typewriter effect */}
                <h1 
                  className="text-[30px] lg:text-[34px] font-[550] leading-tight"
                  style={{ color: '#cab172' }}
                >
                  <TypewriterText 
                    text={language === 'es' 
                      ? 'Lo tienes. Comenzaremos con algunas preguntas sobre ti.' 
                      : "You've got it. We'll begin with some questions about you."}
                    delay={0}
                    speed={25}
                  />
                </h1>
                
                {/* Subtitle with typewriter effect (delayed start) */}
                <p 
                  className="text-[30px] lg:text-[34px] font-[550] leading-tight"
                  style={{ color: '#cab172' }}
                >
                  <TypewriterText 
                    text={language === 'es' 
                      ? 'Después de eso, profundizaremos en tu historial de salud para encontrar qué opción de tratamiento coincide con tus objetivos e historial de salud.' 
                      : "After that, we'll dive into your health history to find which treatment option matches your goals and health history."}
                    delay={1800}
                    speed={20}
                  />
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h1 
                  className="text-[30px] lg:text-[34px] font-[550] leading-tight"
                  style={{ color: '#cab172' }}
                >
                  <TypewriterText 
                    text={language === 'es' 
                      ? 'Bien, parece que ya has hecho tu investigación.' 
                      : "Nice, it sounds like you've already done your research."}
                    delay={0}
                    speed={25}
                  />
                </h1>
                
                <p 
                  className="text-[30px] lg:text-[34px] font-[550] leading-tight"
                  style={{ color: '#cab172' }}
                >
                  <TypewriterText 
                    text={language === 'es' 
                      ? 'Sigamos adelante para encontrar qué opción de tratamiento coincide con tus objetivos e historial de salud.' 
                      : "Let's keep going to find which treatment option matches your goals and health history."}
                    delay={1500}
                    speed={20}
                  />
                </p>
              </div>
            )
          )}
        </div>
      </div>
      
      {/* Bottom section */}
      <div className="px-6 lg:px-8 pb-6 lg:pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Copyright text */}
        <CopyrightText className="mt-4" />
      </div>
    </div>
  );
}