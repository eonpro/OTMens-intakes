'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function CurrentWeightPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentWeight, setCurrentWeight] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');

  const handleContinue = () => {
    if (currentWeight && feet && inches !== '') {
      sessionStorage.setItem('intake_current_weight', currentWeight);
      sessionStorage.setItem('intake_height', JSON.stringify({ feet, inches }));
      
      // Navigate to BMI calculation page
      router.push('/intake/bmi-calculating');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-3/6 bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href="/intake/ideal-weight" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* OTMens Logo */}
      <OTMensLogo />
      
      <div className="flex-1 px-6 lg:px-8 py-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          {/* Current Weight */}
          <div className="space-y-4">
            <h2 className="page-title">{t('currentWeight.title')}</h2>
            <p className="page-subtitle">{t('currentWeight.subtitle')}</p>
            
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder=""
                value={currentWeight}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setCurrentWeight(value);
                }}
                className="input-field w-full pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#413d3d]/60">{t('common.lbs')}</span>
            </div>
          </div>

          {/* Height */}
          <div className="space-y-4">
            <h2 className="page-title">{t('currentWeight.heightTitle')}</h2>
            
            <div className="flex gap-3">
              {/* Feet dropdown */}
              <div className="relative flex-1">
                <select
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="select-field w-full"
                >
                  <option value="" disabled>{t('common.feet')}</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-[#413d3d]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Inches dropdown */}
              <div className="relative flex-1">
                <select
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="select-field w-full"
                >
                  <option value="" disabled>{t('common.inches')}</option>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(inch => (
                    <option key={inch} value={inch}>{inch}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-[#413d3d]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom button */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={handleContinue}
          disabled={!currentWeight}
          className="continue-button"
        >
          <span>{t('currentWeight.continue')}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright footer */}
        <div className="mt-6 text-center">
          <p className="copyright-text">
            © 2025 Overtime Men's Health. All rights reserved.<br/>
            Exclusive and protected process. Copying or reproduction without authorization is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
