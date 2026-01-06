'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';
import CopyrightText from '@/components/CopyrightText';

export default function MedicalTeamPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [showContainer, setShowContainer] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContainer(true), 100);

    // Auto-advance after 3 seconds
    const navigationTimer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/common-side-effects');
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(navigationTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col page-fade-in">
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
      <EonmedsLogo compact={true} />
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full transition-all duration-1000 ease-out transform ${
        showContainer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="space-y-6">
          {/* Doctor images */}
          <div className="flex justify-center">
            <img 
              src="https://static.wixstatic.com/media/c49a9b_e3b5b1388aab4fb4b005bf6f54a54df4~mv2.webp"
              alt={language === 'es' ? 'Equipo médico' : 'Medical team'}
              className="w-full max-w-md h-auto rounded-2xl"
            />
          </div>

          {/* Title and content */}
          <div className="space-y-4">
            <h1 className="page-title text-[#4ea77d]">
              {language === 'es' 
                ? 'Mensaje de nuestro equipo médico'
                : 'Message from our medical team'}
            </h1>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                {language === 'es'
                  ? 'Si bien los medicamentos para perder peso son altamente efectivos, es común experimentar efectos secundarios como náuseas.'
                  : 'While weight loss medications are highly effective, it\'s common to experience side effects like nausea.'}
              </p>

              <p>
                {language === 'es'
                  ? 'En EONMeds, un médico licenciado puede personalizar tu plan de tratamiento para ayudarte a alcanzar tus objetivos sin tener que lidiar con esos efectos.'
                  : 'At EONMeds, a licensed physician can customize your treatment plan to help you achieve your goals without having to deal with those effects.'}
              </p>

              <p>
                {language === 'es'
                  ? 'Las siguientes preguntas permitirán a tu proveedor determinar el mejor enfoque clínico para ti.'
                  : 'The following questions will allow your provider to determine the best clinical approach for you.'}
              </p>
            </div>
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
