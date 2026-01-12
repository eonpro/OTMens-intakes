'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function SupportInfoPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [showContainer, setShowContainer] = useState(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Trigger container animation after a delay
    const timer = setTimeout(() => {
      setShowContainer(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Auto-advance after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/address');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar - full */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[18%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/contact-info" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* OTMens Logo */}
      <OTMensLogo compact={true} />
      
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className={`bg-[#f5ecd8] rounded-3xl p-6 pb-0 space-y-3 overflow-hidden transition-all duration-1000 ease-out transform ${
          showContainer ? 'opacity-100' : 'opacity-0'
        }`}>
          <h2 className="text-xl font-medium text-black">{t('support.didYouKnow')}</h2>
          
          <div className="flex justify-start">
            <img 
              src="https://static.wixstatic.com/shapes/c49a9b_5139736743794db7af38c583595f06fb.svg"
              alt="Overtime Men's Health"
              className="h-10 w-auto"
            />
          </div>
          
          <h3 className="text-xl font-bold text-black leading-tight">
            {t('support.assigns')}
          </h3>
          
          <p className="text-sm text-gray-600">
            {t('support.description')}
          </p>
          
          {/* Customer Service Representative Image */}
          <div className="flex justify-start -ml-6 -mb-6 mt-4">
            <img 
              src="https://static.wixstatic.com/media/c49a9b_9879012a71074e4fb38af2dceae07f7c~mv2.webp"
              alt="Customer Service Representative"
              className="w-80 h-auto object-contain"
            />
          </div>
        </div>
      </div>
      
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Copyright text */}
        <p className="copyright-text text-center mt-4">
          © 2025 Overtime Men's Health. All rights reserved.
          Exclusive and protected process. Copying or reproduction
          without authorization is prohibited.
        </p>
      </div>
    </div>
  );
}