'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function AlcoholConsumptionPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const options = [
    {
      id: 'never',
      es: 'Nunca',
      en: 'Never'
    },
    {
      id: 'few_times_year',
      es: 'Algunas veces al año',
      en: 'A few times a year'
    },
    {
      id: 'few_times_month',
      es: 'Algunas veces al mes',
      en: 'A few times a month'
    },
    {
      id: 'few_times_week',
      es: 'Algunas veces a la semana',
      en: 'A few times a week'
    },
    {
      id: 'daily',
      es: 'Todos los días o casi todos los días',
      en: 'Every day or almost every day'
    }
  ];

  const handleSelect = (value: string) => {
    sessionStorage.setItem('alcohol_consumption', value);
    router.push('/intake/safety-quality');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[88%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/dosage-satisfaction" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <div>
            <h1 className="page-title mb-3">
              {language === 'es' 
                ? '¿Con qué frecuencia tomas 5 o más bebidas alcohólicas en una sola ocasión?'
                : 'How often do you have 5 or more alcoholic drinks on a single occasion?'}
            </h1>
            <p className="page-subtitle">
              {language === 'es'
                ? 'El alcohol a veces puede interferir con el efecto de ciertos medicamentos. Es importante que tu proveedor lo sepa para poder darte la mejor orientación posible.'
                : 'Alcohol can sometimes interfere with the effect of certain medications. It\'s important for your provider to know so they can give you the best guidance possible.'}
            </p>
          </div>

          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className="option-button w-full p-4 text-left rounded-2xl transition-all"
              >
                <span className="text-base lg:text-lg">
                  {language === 'es' ? option.es : option.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright footer */}
      <div className="px-6 lg:px-8 pb-6 max-w-md lg:max-w-lg mx-auto w-full">
        <p className="copyright-text text-center">
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
  );
}
