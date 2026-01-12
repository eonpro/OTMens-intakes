'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function SexAssignedPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const handleSelect = (value: string) => {
    sessionStorage.setItem('intake_sex', value);
      router.push('/intake/activity-level');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-1/3 bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href="/intake/medical-history-overview" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* EONMeds Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-6">
          {/* Title */}
          <h1 className="page-title">{t('sex.title')}</h1>
          
          {/* Description */}
          <p className="page-subtitle">
            {t('sex.subtitle')}
          </p>
          
          {/* Selection prompt */}
          <p className="text-lg text-[#413d3d] mt-8">{t('sex.selectPrompt')}</p>
          
          {/* Options */}
          <div className="space-y-3">
            <button
              onClick={() => handleSelect('man')}
              className="option-button w-full text-left p-4 rounded-2xl transition-all"
            >
                <span className="text-[16px] lg:text-lg font-medium leading-tight">{t('sex.man')}</span>
            </button>
            
            <button
              onClick={() => handleSelect('woman')}
              className="option-button w-full text-left p-4 rounded-2xl transition-all"
            >
                <span className="text-[16px] lg:text-lg font-medium leading-tight">{t('sex.woman')}</span>
            </button>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-8">
            <p className="text-xs text-[#413d3d]/60 leading-tight">
              {t('sex.disclaimer')}
            </p>
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
