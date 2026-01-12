'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useEnterNavigation } from '@/hooks/useEnterNavigation';
import OTMensLogo from '@/components/OTMensLogo';

export default function NamePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleContinue = () => {
    if (firstName && lastName) {
      sessionStorage.setItem('intake_name', JSON.stringify({ firstName, lastName }));
      router.push('/intake/dob');
    }
  };
  
  // Enable Enter key navigation
  useEnterNavigation(handleContinue);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[12%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href="/intake/state" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* OTMens Logo */}
      <OTMensLogo />
      
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="page-title">{t('name.title')}</h1>
            <p className="page-subtitle">{t('name.subtitle')}</p>
          </div>
          
          <div className="space-y-6">
            <p className="text-[#413d3d]/60 text-sm">{t('name.basicInfo')}</p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t('name.firstName')}
                value={firstName}
                onChange={(e) => {
                  const value = e.target.value;
                  // Capitalize first letter, lowercase the rest
                  if (value.length > 0) {
                    const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                    setFirstName(formatted);
                  } else {
                    setFirstName('');
                  }
                }}
                className="input-field w-full"
              />
              <input
                type="text"
                placeholder={t('name.lastName')}
                value={lastName}
                onChange={(e) => {
                  const value = e.target.value;
                  // Capitalize first letter, lowercase the rest
                  if (value.length > 0) {
                    const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                    setLastName(formatted);
                  } else {
                    setLastName('');
                  }
                }}
                className="input-field w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom button */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={handleContinue}
          disabled={!firstName || !lastName}
          className="continue-button"
        >
          <span>{t('name.continue')}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright footer */}
        <div className="mt-6 text-center">
          <p className="copyright-text">
            {language === 'es' ? (
              <>
                © 2025 Overtime Men's Health. Todos los derechos reservados.<br/>
                Proceso exclusivo y protegido. Copiar o reproducir sin autorización está prohibido.
              </>
            ) : (
              <>
                © 2025 Overtime Men's Health. All rights reserved.<br/>
                Exclusive and protected process. Copying or reproduction without authorization is prohibited.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}