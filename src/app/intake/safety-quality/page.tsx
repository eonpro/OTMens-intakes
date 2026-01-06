'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';
import CopyrightText from '@/components/CopyrightText';

export default function SafetyQualityPage() {
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
        router.push('/intake/medical-team');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  const handleContinue = () => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      router.push('/intake/medical-team');
    }
  };

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
      <EonmedsLogo compact={true} />
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-2xl mx-auto w-full transition-all duration-1000 ease-out transform ${
        showContainer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="bg-[#e5fbab] rounded-3xl p-6 md:p-8">
          {/* Vertical layout - image below text */}
          <div className="flex flex-col space-y-6">
            {/* Text content */}
            <div className="space-y-4">
              <h1 className="text-2xl lg:text-3xl font-semibold leading-tight text-black">
                {language === 'es' 
                  ? 'Comprometidos con la seguridad y la máxima calidad en cada paso.'
                  : 'Committed to safety and the highest quality at every step.'}
              </h1>
              
              <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                {language === 'es'
                  ? 'EONMeds colabora con algunas de las mejores farmacias 503A licenciadas del país para elaborar tratamientos personalizados y seguros para ti.'
                  : 'EONMeds collaborates with some of the best 503A licensed pharmacies in the country to develop personalized and safe treatments for you.'}
              </p>
            </div>

            {/* Image - below text */}
            <div className="rounded-2xl overflow-hidden">
              <img 
                src="https://static.wixstatic.com/media/c49a9b_08d4b9a9d0394b3a83c2284def597b09~mv2.webp"
                alt={language === 'es' ? 'Farmacia de calidad' : 'Quality pharmacy'}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-2xl mx-auto w-full">
        {/* Copyright text */}
        <CopyrightText className="mt-4" />
      </div>
    </div>
  );
}
