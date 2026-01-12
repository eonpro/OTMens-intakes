'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function MedicalHistoryOverviewPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const hasNavigated = useRef(false);

  // Auto-advance after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/sex-assigned');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  const handleContinue = () => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      router.push('/intake/sex-assigned');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href="/intake/testimonials" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* EONMeds Logo */}
      <EonmedsLogo compact={true} />
      
      {/* Main content */}
      <div className="flex-1 px-6 lg:px-8 py-12 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          {/* Doctor Image - Left aligned */}
          <div className="flex justify-start">
            <img 
              src="https://static.wixstatic.com/media/c49a9b_7742352092de4c8e82b9e6e10cc20719~mv2.webp"
              alt="Medical Professional"
              className="w-[6.5rem] h-[6.5rem] rounded-full object-cover"
            />
          </div>

          {/* Title */}
          <div className="text-left">
            <h1 className="page-title">
              {t('medical.overview.title.line1')}<br/>
              {t('medical.overview.title.line2')}
            </h1>
          </div>

          {/* Timeline Progress */}
          <div className="relative">
            {/* Vertical timeline line - connects all steps */}
            <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-gray-200"></div>
            
            {/* Step 1: Weight Loss Profile - COMPLETED */}
            <div className="relative flex items-center gap-4 pb-6">
              {/* Checkmark circle */}
              <div className="relative z-10 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Step text */}
              <span className="text-lg text-gray-400">{t('medical.overview.weightLossProfile')}</span>
            </div>
            
            {/* Step 2: Medical History - CURRENT */}
            <div className="relative flex items-start gap-4 pb-6">
              {/* Green pulsing dot */}
              <div className="relative z-10 mt-5">
                <div className="absolute inset-0 w-6 h-6 bg-[#cab172] rounded-full opacity-50 animate-ping"></div>
                <div className="relative w-6 h-6 bg-[#cab172] rounded-full"></div>
              </div>
              {/* Medical History Card */}
              <div className="flex-1 bg-[#f5ecd8] rounded-2xl p-5">
                <h2 className="text-lg font-semibold text-[#413d3d] mb-2">{t('medical.history.title')}</h2>
                <p className="text-sm text-[#413d3d]/70 leading-relaxed">
                  {t('medical.history.subtitle.line1')} {t('medical.history.subtitle.line2')} {t('medical.history.subtitle.line3')}
                </p>
              </div>
            </div>
            
            {/* Step 3: Treatment - PENDING */}
            <div className="relative flex items-center gap-4">
              {/* Gray circle */}
              <div className="relative z-10 w-6 h-6 bg-white border-2 border-gray-200 rounded-full"></div>
              {/* Step text */}
              <span className="text-lg text-gray-300">{t('medical.overview.treatment')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Copyright text */}
        <p className="copyright-text text-center mt-4">
          {t('medical.overview.copyright.line1')}<br/>
          {t('medical.overview.copyright.line2')}<br/>
          {t('medical.overview.copyright.line3')}
        </p>
      </div>
    </div>
  );
}
