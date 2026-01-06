'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useEnterNavigation } from '@/hooks/useEnterNavigation';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function DOBPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [dob, setDob] = useState('');
  const [certified, setCertified] = useState(false);
  const [isOver18, setIsOver18] = useState(true);
  const [showDateError, setShowDateError] = useState(false);
  const [showAgeError, setShowAgeError] = useState(false);

  // Format date with slashes and validate age
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Validate month (01-12)
    if (value.length >= 2) {
      let month = parseInt(value.slice(0, 2));
      if (month > 12) {
        value = '12' + value.slice(2);
      } else if (month < 1 && value.length === 2) {
        value = '01' + value.slice(2);
      }
    }
    
    // Validate day (01-31, with special cases for month)
    if (value.length >= 4) {
      const month = parseInt(value.slice(0, 2));
      let day = parseInt(value.slice(2, 4));
      
      // February max 29 days (we'll handle leap year validation below)
      if (month === 2 && day > 29) {
        day = 29;
        value = value.slice(0, 2) + '29' + value.slice(4);
      }
      // Months with 30 days: April, June, September, November
      else if ([4, 6, 9, 11].includes(month) && day > 30) {
        day = 30;
        value = value.slice(0, 2) + '30' + value.slice(4);
      }
      // All other months max 31 days
      else if (day > 31) {
        day = 31;
        value = value.slice(0, 2) + '31' + value.slice(4);
      }
      // Minimum day is 01
      else if (day < 1 && value.length === 4) {
        day = 1;
        value = value.slice(0, 2) + '01' + value.slice(4);
      }
    }
    
    // Format as MM/DD/YYYY
    let formattedValue = value;
    if (value.length >= 2) {
      formattedValue = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (formattedValue.length >= 5) {
      formattedValue = formattedValue.slice(0, 5) + '/' + formattedValue.slice(5, 9);
    }
    
    setDob(formattedValue);
    
    // Reset errors when typing
    setShowDateError(false);
    setShowAgeError(false);
    
    // Check if over 18 when date is complete
    if (formattedValue.length === 10) {
      const [month, day, year] = formattedValue.split('/').map(Number);
      
      // Additional validation for February 28 vs 29 (leap year)
      if (month === 2 && day === 29) {
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        if (!isLeapYear) {
          setDob(formattedValue.slice(0, 3) + '28' + formattedValue.slice(5));
          return;
        }
      }
      
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setIsOver18(age - 1 >= 18);
      } else {
        setIsOver18(age >= 18);
      }
    } else {
      setIsOver18(true); // Reset to true when date is incomplete
    }
  };

  const handleContinue = () => {
    // Check if date is complete (10 characters)
    if (dob.length !== 10) {
      setShowDateError(true);
      return;
    }
    
    // Check if over 18
    if (!isOver18) {
      setShowAgeError(true);
      return;
    }
    
    // Check if certified
    if (!certified) {
      return;
    }
    
    // All validations passed
    sessionStorage.setItem('intake_dob', dob);
    router.push('/intake/contact-info');
  };
  
  // Enable Enter key navigation
  useEnterNavigation(handleContinue);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[14%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-2xl mx-auto w-full">
        <Link href="/intake/name" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* EONMeds Logo */}
      <EonmedsLogo />
      
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-48 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="page-title">{t('dob.title')}</h1>
            <p className="page-subtitle">{t('dob.subtitle')}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <input
                type="text"
                inputMode="numeric"
                placeholder={t('dob.placeholder')}
                value={dob}
                onChange={handleDateChange}
                maxLength={10}
                className={`input-field w-full ${
                  (showDateError && dob.length !== 10) || (showAgeError && !isOver18)
                    ? 'border-red-500'
                    : ''
                }`}
              />
              {showDateError && dob.length !== 10 && (
                <p className="text-red-300 text-sm mt-2">
                  {language === 'es' 
                    ? 'Por favor, ingresa una fecha de nacimiento completa (MM/DD/AAAA)'
                    : 'Please enter a complete date of birth (MM/DD/YYYY)'}
                </p>
              )}
              {(dob.length === 10 && !isOver18 && showAgeError) && (
                <p className="text-red-300 text-sm mt-2">
                  {language === 'es'
                    ? 'Debes tener al menos 18 años para continuar'
                    : 'You must be at least 18 years old to continue'}
                </p>
              )}
            </div>
            
            <label className="flex items-center space-x-3 cursor-pointer" onClick={() => setCertified(!certified)}>
              <div 
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 cursor-pointer ${
                  certified ? 'bg-[#f5ecd8]' : 'bg-white'
                }`}
                style={{ border: '1.5px solid #413d3d' }}
              >
                {certified && (
                  <svg className="w-3 h-3 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#413d3d]" style={{ fontWeight: 500 }}>{t('dob.certifyAge')}</span>
            </label>
            
            <p className="text-xs text-[#413d3d]/60">
              {t('dob.ageRequirement')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Sticky bottom button */}
      <div className="sticky-bottom-button max-w-md lg:max-w-2xl mx-auto w-full">
        <button 
          onClick={handleContinue}
          disabled={!(dob.length === 10 && certified && isOver18)}
          className="continue-button"
        >
          <span>{t('dob.continue')}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright footer */}
        <div className="mt-6 text-center">
          <p className="copyright-text">
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
    </div>
  );
}
