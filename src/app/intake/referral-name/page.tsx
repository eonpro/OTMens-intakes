'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';
import CopyrightText from '@/components/CopyrightText';

export default function ReferralNamePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [referrerName, setReferrerName] = useState('');
  const [referralType, setReferralType] = useState<'friend_family' | 'eonmeds_rep' | null>(null);

  // Check if user came from referral source with friend/family or EONMeds rep selected
  useEffect(() => {
    const sources = sessionStorage.getItem('referral_sources');
    if (sources) {
      try {
        const parsed = JSON.parse(sources);
        if (parsed.includes('friend_family')) {
          setReferralType('friend_family');
        } else if (parsed.includes('eonmeds_rep')) {
          setReferralType('eonmeds_rep');
        } else {
          router.push('/intake/health-improvements');
        }
      } catch {
        router.push('/intake/health-improvements');
      }
    } else {
      router.push('/intake/health-improvements');
    }
  }, [router]);

  const handleContinue = () => {
    if (referrerName.trim()) {
      sessionStorage.setItem('referrer_name', referrerName.trim());
      sessionStorage.setItem('referrer_type', referralType || '');
      router.push('/intake/health-improvements');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[95%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/referral-source" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <EonmedsLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          <div>
            <h1 className="page-title mb-3">
              {referralType === 'friend_family' ? (
                language === 'es' 
                  ? '¡Genial! ¿Cómo se llama tu amigo o familiar que te recomendó?'
                  : 'Great! What\'s the name of your friend or family member who referred you?'
              ) : (
                language === 'es'
                  ? '¡Excelente! ¿Cómo se llama el representante de EONMeds que te ayudó?'
                  : 'Excellent! What\'s the name of the EONMeds representative who helped you?'
              )}
            </h1>
            <p className="page-subtitle">
              {referralType === 'friend_family' ? (
                language === 'es'
                  ? 'Nos encanta recompensar a nuestros pacientes que comparten su experiencia con otros.'
                  : 'We love rewarding our patients who share their experience with others.'
              ) : (
                language === 'es'
                  ? 'Esto nos ayuda a reconocer a nuestros representantes por su excelente servicio.'
                  : 'This helps us recognize our representatives for their excellent service.'
              )}
            </p>
          </div>

          <div>
            <input
              type="text"
              placeholder={
                referralType === 'friend_family'
                  ? (language === 'es' ? 'Nombre completo' : 'Full name')
                  : (language === 'es' ? 'Nombre del representante' : 'Representative name')
              }
              value={referrerName}
              onChange={(e) => setReferrerName(e.target.value)}
              className="w-full p-4 text-base md:text-lg font-medium border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && referrerName.trim()) {
                  handleContinue();
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-2xl mx-auto w-full">
        <button 
          onClick={handleContinue}
          disabled={!referrerName.trim()}
          className={`w-full py-4 px-8 rounded-full text-lg font-medium flex items-center justify-center space-x-3 transition-all ${
            referrerName.trim()
              ? 'bg-black text-white hover:bg-gray-900' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>{language === 'es' ? 'Continuar' : 'Continue'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright text */}
        <CopyrightText className="mt-4" />
      </div>
    </div>
  );
}
