'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useEnterNavigation } from '@/hooks/useEnterNavigation';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function ConsentPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (agreed) {
      // Track all consent acceptances
      const timestamp = new Date().toISOString();
      sessionStorage.setItem('terms_of_use_accepted', 'true');
      sessionStorage.setItem('terms_of_use_accepted_at', timestamp);
      sessionStorage.setItem('consent_privacy_policy_accepted', 'true');
      sessionStorage.setItem('consent_privacy_policy_accepted_at', timestamp);
      sessionStorage.setItem('telehealth_consent_accepted', 'true');
      sessionStorage.setItem('telehealth_consent_accepted_at', timestamp);
      sessionStorage.setItem('cancellation_policy_accepted', 'true');
      sessionStorage.setItem('cancellation_policy_accepted_at', timestamp);
      // Florida-specific consents (tracked for all, checked by state later)
      sessionStorage.setItem('florida_bill_of_rights_accepted', 'true');
      sessionStorage.setItem('florida_bill_of_rights_accepted_at', timestamp);
      sessionStorage.setItem('florida_consent_accepted', 'true');
      sessionStorage.setItem('florida_consent_accepted_at', timestamp);
      // New Jersey-specific consents
      sessionStorage.setItem('newjersey_consent_accepted', 'true');
      sessionStorage.setItem('newjersey_consent_accepted_at', timestamp);

      router.push('/intake/state');
    }
  };

  // Enable Enter key navigation
  useEnterNavigation(handleContinue);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[8%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>

      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-2xl mx-auto w-full">
        <Link href="/intake/research-done" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>

      {/* EONMeds Logo */}
      <EonmedsLogo />

      <div className="flex-1 px-6 lg:px-8 py-4 pb-48 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          <div>
            <h1 className="page-title mb-2">{t('consent.title')}</h1>
            <p className="page-subtitle text-sm">{t('consent.subtitle')}</p>
            <p className="page-subtitle text-sm">{t('consent.remember')}</p>
          </div>

          <div className="space-y-2">
            {/* Health Priority Card */}
            <div className="bg-[#f5ecd8] rounded-2xl overflow-hidden flex h-20">
              <div className="flex-shrink-0 relative w-20">
                <Image
                  src="https://static.wixstatic.com/media/c49a9b_8d1a5c0e8f6247ba9d79bf0abc49169a~mv2.webp"
                  alt="Healthcare professional"
                  fill
                  sizes="(max-width: 768px) 80px, 80px"
                  className="object-cover"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>
              <div className="flex-1 flex flex-col justify-center px-3 py-2">
                <h3 className="font-bold text-[15px] leading-tight mb-0.5">{t('consent.health.title')}</h3>
                <p className="text-[12px] leading-snug">{t('consent.health.subtitle')}</p>
              </div>
            </div>

            {/* Doctor Review Card */}
            <div className="bg-[#e4fb74] rounded-2xl overflow-hidden flex h-20">
              <div className="flex-shrink-0 relative w-24">
                <Image
                  src="https://static.wixstatic.com/media/c49a9b_5e690e4cf43e4e769ef7d4e9f5691a5b~mv2.webp"
                  alt="Licensed medical provider"
                  fill
                  sizes="(max-width: 768px) 96px, 96px"
                  className="object-cover"
                  style={{ objectPosition: 'center 30%' }}
                />
              </div>
              <div className="flex-1 flex flex-col justify-center px-3 py-2">
                <h3 className="font-bold text-[15px] leading-tight mb-0.5">{t('consent.doctor.title')}</h3>
                <p className="text-[12px] leading-snug">{t('consent.doctor.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Consent Section */}
          <div className="border border-gray-200 bg-gray-50 rounded-xl p-3">
            <div className="flex items-start space-x-3">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className="mt-0.5 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center bg-white cursor-pointer"
                style={{ border: '1.5px solid #413d3d' }}
                aria-label="Accept terms and conditions"
              >
                {agreed && (
                  <svg className="w-3 h-3 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div
                className="text-[13px] md:text-[14px] text-[#413d3d]/80 leading-tight cursor-pointer"
                onClick={() => setAgreed(!agreed)}
              >
                {t('consent.agreement.start')}
                <a href="#" className="text-[#cab172] underline font-medium" onClick={(e) => e.stopPropagation()}>{t('consent.agreement.terms')}</a>
                {t('consent.agreement.and')}
                <a href="#" className="text-[#cab172] underline font-medium" onClick={(e) => e.stopPropagation()}>{t('consent.agreement.privacy')}</a>,{' '}
                <a href="#" className="text-[#cab172] underline font-medium" onClick={(e) => e.stopPropagation()}>{t('consent.agreement.telehealth')}</a>{' '}
                {language === 'es' ? 'y' : 'and'}{' '}
                <a href="#" className="text-[#cab172] underline font-medium" onClick={(e) => e.stopPropagation()}>{t('consent.agreement.cancellation')}</a>.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom button */}
      <div className="sticky-bottom-button max-w-md lg:max-w-2xl mx-auto w-full">
        <button
          onClick={handleContinue}
          disabled={!agreed}
          className="continue-button"
        >
          <span>{t('consent.continue')}</span>
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
