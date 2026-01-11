'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useEnterNavigation } from '@/hooks/useEnterNavigation';
import EonmedsLogo from '@/components/EonmedsLogo';
import ViewportAwareLayout from '@/components/ViewportAwareLayout';

// Dynamic import to avoid SSR issues
const IntroLottie = dynamic(() => import('@/components/IntroLottie'), {
  ssr: false
});

// Star SVG component
const StarIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#FFD700">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default function Home() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true); // Always start with intro showing
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle navigation to goals page
  const handleContinue = () => {
    // Track Privacy Policy acceptance from landing page
    sessionStorage.setItem('privacy_policy_accepted', 'true');
    sessionStorage.setItem('privacy_policy_accepted_at', new Date().toISOString());
    router.push('/intake/goals');
  };

  // Enable Enter key navigation when not showing intro
  useEnterNavigation(handleContinue, showIntro);

  useEffect(() => {
    setMounted(true);

    // Always show intro for 3 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowIntro(false);
      }, 500);
    }, 3000); // 3 seconds duration

    return () => clearTimeout(timer);
  }, []);

  // Show intro animation if needed (either not mounted yet or showIntro is true)
  if (!mounted || showIntro) {
    return (
      <div className={`min-h-screen bg-white flex flex-col items-center justify-center transition-opacity duration-700 ease-out ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="flex items-center justify-center">
          <IntroLottie />
        </div>
      </div>
    );
  }

  // Progress bar component
  const progressBar = <div className="w-full h-1 bg-[#f5ecd8]"></div>;

  // Logo component
  const logo = <EonmedsLogo />;

  // Button with disclaimers
  const buttonWithDisclaimer = (
    <>
      {/* Privacy and terms text - closer to button */}
      <div className="mb-4">
        <p className="text-[11px] lg:text-[13px] leading-tight" style={{ fontWeight: 450, color: 'rgba(65, 61, 61, 0.6)' }}>
          {t('landing.disclaimer1')}
          <a href="https://www.otmens.com/privacypolicy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'rgba(65, 61, 61, 0.6)' }}>{t('landing.disclaimer.privacy')}</a>
          {t('landing.disclaimer1.end')}
        </p>
      </div>

      <button
        onClick={handleContinue}
        className="continue-button">
        <span className="!text-white">{t('landing.button.start')}</span>
        <svg className="w-4 h-4 !text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      {/* Copyright footer - matching other pages */}
      <div className="mt-6 text-center">
        <p className="copyright-text">
          © 2025 Overtime Men&apos;s Health. All rights reserved.<br/>
          Exclusive and protected process. Copying or reproduction without authorization is prohibited.
        </p>
      </div>
    </>
  );

  return (
    <ViewportAwareLayout
      progressBar={progressBar}
      logo={logo}
      button={buttonWithDisclaimer}
      compactMode={true}
    >
      {/* Nurse Image - Circular */}
      <div className="mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden relative">
          <Image
            src="https://static.wixstatic.com/media/c49a9b_5b9a0976f96044ccbf05c4d90c382f2d~mv2.webp"
            alt="Healthcare professional"
            fill
            sizes="128px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Title and subtitle */}
      <div className="text-left">
        <h1 className="page-title" style={{ color: '#cab172' }}>
          {t('landing.title')}
        </h1>
        <p className="page-subtitle">
          {t('landing.subtitle')}
        </p>
      </div>

      {/* Trust section */}
      <div className="mt-6 space-y-3">
        {/* Trusted by text */}
        <p className="text-[15px] font-medium text-[#413d3d]">
          {language === 'es' ? 'Confiado por más de 20,000 pacientes' : 'Trusted by over 20,000 patients'}
        </p>

        {/* Patient photos - 20% bigger */}
        <div className="flex -space-x-3">
          <Image
            src="https://static.wixstatic.com/media/c49a9b_e11bf27141fa4676b7c9d9f2438b334a~mv2.webp"
            alt="Happy patients"
            width={134}
            height={38}
            className="rounded-lg"
            priority
          />
        </div>

        {/* 5 Star rating */}
        <div className="flex space-x-1">
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
        </div>
      </div>
    </ViewportAwareLayout>
  );
}