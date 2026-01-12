'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useEnterNavigation } from '@/hooks/useEnterNavigation';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function StatePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const [selectedState, setSelectedState] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const handleContinue = () => {
    if (selectedState && termsAccepted) {
      const stateCode: { [key: string]: string } = {
        'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
        'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
        'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
        'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
        'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
        'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
        'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
        'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
        'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
        'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
      };
      sessionStorage.setItem('intake_state', JSON.stringify({ state: stateCode[selectedState] || selectedState }));
      router.push('/intake/name');
    }
  };
  
  useEnterNavigation(handleContinue);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[10%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href="/intake/consent" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <EonmedsLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-48 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="page-title">{t('state.title')}</h1>
            <p className="page-subtitle">{t('state.subtitle')}</p>
          </div>
          
          {/* State Dropdown */}
          <div className="relative">
            <label className="block text-sm text-[#413d3d]/70 mb-2">{t('state.label')}</label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="select-field w-full"
              >
                <option value="" disabled>
                  {isSpanish ? 'Selecciona tu estado' : 'Select your state'}
                </option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Terms and Conditions Checkbox */}
          <div className="mt-6">
            <label className="flex items-start cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
              <div 
                className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                  termsAccepted ? 'bg-white' : 'bg-transparent'
                }`}
                style={{ border: '1.5px solid #413d3d' }}
              >
                {termsAccepted && (
                  <svg className="w-3 h-3 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="ml-3 text-[12.5px] md:text-[13.5px] text-[#413d3d]/80 leading-tight">
                {selectedState === 'Florida' ? (
                  <>
                    {t('state.terms.agree')}<a href={isSpanish ? "https://www.eonmeds.com/terminosycondiciones" : "https://www.eonmeds.com/termsandconditions"} target="_blank" rel="noopener noreferrer" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.link')}</a>, <a href={isSpanish ? "https://www.eonmeds.com/floridaweightlossconsumerbillofrights" : "https://www.eonmeds.com/floridaweightlossconsumerbillofrightseng"} target="_blank" rel="noopener noreferrer" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.flBill')}</a>, <a href={isSpanish ? "https://www.eonmeds.com/floridatelehealthconsent" : "https://www.eonmeds.com/florida-telehealth-consent"} target="_blank" rel="noopener noreferrer" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.flConsent')}</a>, <a href={isSpanish ? "https://www.eonmeds.com/consentimientodetelemedicina" : "https://www.eonmeds.com/telehealth-consent"} target="_blank" rel="noopener noreferrer" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.telehealth')}</a>{t('state.terms.acknowledge')}<a href={isSpanish ? "https://www.eonmeds.com/politicadeprivacidad" : "https://www.eonmeds.com/privacypolicy"} target="_blank" rel="noopener noreferrer" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.privacy')}</a>.
                  </>
                ) : selectedState === 'New Jersey' ? (
                  <>
                    {t('state.terms.agree')}<a href={isSpanish ? "https://www.eonmeds.com/terminosycondiciones" : "https://www.eonmeds.com/termsandconditions"} target="_blank" rel="noopener noreferrer" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.link')}</a>, <a href="#" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.njConsent')}</a>, <a href={isSpanish ? "https://www.eonmeds.com/consentimientodetelemedicina" : "https://www.eonmeds.com/telehealth-consent"} target="_blank" rel="noopener noreferrer" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.telehealth')}</a>{t('state.terms.acknowledge')}<a href={isSpanish ? "https://www.eonmeds.com/politicadeprivacidad" : "https://www.eonmeds.com/privacypolicy"} target="_blank" rel="noopener noreferrer" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.privacy')}</a>.
                  </>
                ) : (
                  <>
                    {t('state.terms.generic')}<a href={isSpanish ? "https://www.eonmeds.com/terminosycondiciones" : "https://www.eonmeds.com/termsandconditions"} target="_blank" rel="noopener noreferrer" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.link')}</a> {t('state.terms.and')} <a href={isSpanish ? "https://www.eonmeds.com/consentimientodetelemedicina" : "https://www.eonmeds.com/telehealth-consent"} target="_blank" rel="noopener noreferrer" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.telehealth')}</a> {t('state.terms.acknowledge')}<a href={isSpanish ? "https://www.eonmeds.com/politicadeprivacidad" : "https://www.eonmeds.com/privacypolicy"} target="_blank" rel="noopener noreferrer" className="text-[#cab172] underline" onClick={(e) => e.stopPropagation()}>{t('state.terms.privacy')}</a>.
                  </>
                )}
              </span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Sticky bottom button */}
      <div className="sticky-bottom-button max-w-md lg:max-w-lg mx-auto w-full">
        <button 
          onClick={handleContinue}
          disabled={!selectedState || !termsAccepted}
          className="continue-button"
        >
          <span>{t('state.continue')}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright footer */}
        <div className="mt-6 text-center">
          <p className="copyright-text">
            {isSpanish ? (
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
