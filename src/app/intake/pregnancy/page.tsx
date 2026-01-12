'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function PregnancyPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  // Auto-skip for male patients - men can't be pregnant or breastfeeding
  useEffect(() => {
    const sex = sessionStorage.getItem('intake_sex');
    if (sex === 'man' || sex === 'male' || sex === 'hombre') {
      sessionStorage.setItem('pregnancy_breastfeeding', 'n/a');
      router.push('/intake/surgery');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Don't render anything while checking sex - prevents flash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#cab172] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSelect = (value: string) => {
    sessionStorage.setItem('pregnancy_breastfeeding', value);
    router.push('/intake/surgery');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[97%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/diabetes-personal" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
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
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Estás embarazada o dando de lactar?'
              : 'Are you pregnant or breastfeeding?'}
          </h1>
          
          {/* Yes/No options */}
          <div className="space-y-3">
            <button
              onClick={() => handleSelect('yes')}
              className="option-button w-full text-left p-4 rounded-2xl transition-all"
            >
              <span className="text-[16px] lg:text-lg font-medium leading-tight">
                {language === 'es' ? 'Sí' : 'Yes'}
              </span>
            </button>
            
            <button
              onClick={() => handleSelect('no')}
              className="option-button w-full text-left p-4 rounded-2xl transition-all"
            >
              <span className="text-[16px] lg:text-lg font-medium leading-tight">
                No
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Copyright footer */}
      <div className="px-6 lg:px-8 pb-6 max-w-md lg:max-w-lg mx-auto w-full">
        <p className="copyright-text text-center">
          {language === 'es' ? (
            <>
              © 2025 EONPro, LLC. Todos los derechos reservados.<br/>
              Proceso exclusivo y protegido. Copiar o reproducir sin autorización está prohibido.
            </>
          ) : (
            <>
              © 2025 EONPro, LLC. All rights reserved.<br/>
              Exclusive and protected process. Copying or reproduction without authorization is prohibited.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
