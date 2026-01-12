'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function MedicalHistoryOverviewPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const hasNavigated = useRef(false);
  const [showImage, setShowImage] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showStep1, setShowStep1] = useState(false);
  const [showStep2, setShowStep2] = useState(false);
  const [showStep3, setShowStep3] = useState(false);
  const [lineProgress, setLineProgress] = useState(0);

  // Staggered animations
  useEffect(() => {
    const timers = [
      setTimeout(() => setShowImage(true), 100),
      setTimeout(() => setShowTitle(true), 300),
      setTimeout(() => setShowStep1(true), 500),
      setTimeout(() => setShowStep2(true), 800),
      setTimeout(() => setShowStep3(true), 1100),
    ];

    // Animate the timeline line
    const lineTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setLineProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 30);
    }, 400);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(lineTimer);
    };
  }, []);

  // Auto-advance after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/sex-assigned');
      }
    }, 3000);

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
      
      {/* OTMens Logo */}
      <OTMensLogo compact={true} />
      
      {/* Main content */}
      <div className="flex-1 px-6 lg:px-8 py-12 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          {/* Doctor Image - Left aligned with animation */}
          <div className={`flex justify-start transition-all duration-700 ease-out ${
            showImage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}>
            <div className="relative">
              {/* Subtle glow ring */}
              <div className={`absolute inset-0 rounded-full bg-[#cab172]/20 transition-all duration-1000 ${
                showImage ? 'scale-110 opacity-100' : 'scale-100 opacity-0'
              }`} />
              <img 
                src="https://static.wixstatic.com/media/c49a9b_5b7eb6087f204fb488efae8b63ec6f5f~mv2.webp"
                alt="Medical Professional"
                className="relative w-[6.5rem] h-[6.5rem] rounded-full object-cover ring-4 ring-[#f5ecd8]"
              />
            </div>
          </div>

          {/* Title with animation */}
          <div className={`text-left transition-all duration-700 ease-out ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className="page-title">
              {t('medical.overview.title.line1')}<br/>
              {t('medical.overview.title.line2')}
            </h1>
          </div>

          {/* Timeline Progress */}
          <div className="relative">
            {/* Animated vertical timeline line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-gray-100 overflow-hidden">
              <div 
                className="w-full bg-gradient-to-b from-[#cab172] to-[#f5ecd8] transition-all duration-100"
                style={{ height: `${lineProgress}%` }}
              />
            </div>
            
            {/* Step 1: Weight Loss Profile - COMPLETED */}
            <div className={`relative flex items-center gap-4 pb-6 transition-all duration-500 ease-out ${
              showStep1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              {/* Checkmark circle with animation */}
              <div className="relative z-10 w-6 h-6 bg-white border-2 border-[#cab172] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-[#cab172]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Step text */}
              <span className="text-lg text-gray-500">{t('medical.overview.weightLossProfile')}</span>
            </div>
            
            {/* Step 2: Medical History - CURRENT */}
            <div className={`relative flex items-start gap-4 pb-6 transition-all duration-500 ease-out ${
              showStep2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              {/* Gold pulsing dot */}
              <div className="relative z-10 mt-5">
                <div className="absolute inset-0 w-6 h-6 bg-[#cab172] rounded-full opacity-40 animate-ping"></div>
                <div className="absolute inset-0 w-6 h-6 bg-[#cab172] rounded-full opacity-20 animate-pulse"></div>
                <div className="relative w-6 h-6 bg-[#cab172] rounded-full shadow-lg shadow-[#cab172]/30"></div>
              </div>
              {/* Medical History Card with shine effect */}
              <div className="flex-1 bg-[#f5ecd8] rounded-2xl p-5 relative overflow-hidden">
                {/* Shine sweep */}
                <div className="absolute inset-0 shine-sweep" />
                <h2 className="text-lg font-semibold text-[#413d3d] mb-2">{t('medical.history.title')}</h2>
                <p className="text-sm text-[#413d3d]/70 leading-relaxed">
                  {t('medical.history.subtitle.line1')} {t('medical.history.subtitle.line2')} {t('medical.history.subtitle.line3')}
                </p>
              </div>
            </div>
            
            {/* Step 3: Treatment - PENDING */}
            <div className={`relative flex items-center gap-4 transition-all duration-500 ease-out ${
              showStep3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
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
          animation: shineSweep 2s ease-in-out 1s;
        }
        @keyframes shineSweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
