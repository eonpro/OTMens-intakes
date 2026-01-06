'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function GLP1HistoryPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const options = [
    {
      id: 'currently_taking',
      es: 'Actualmente estoy tomando un medicamento GLP-1',
      en: 'I am currently taking a GLP-1 medication'
    },
    {
      id: 'previously_taken',
      es: 'He tomado un medicamento GLP-1 en el pasado, pero no actualmente',
      en: 'I have taken a GLP-1 medication in the past, but not currently'
    },
    {
      id: 'never_taken',
      es: 'Nunca he tomado un medicamento GLP-1',
      en: 'I have never taken a GLP-1 medication'
    }
  ];

  const handleSelect = (value: string) => {
    sessionStorage.setItem('glp1_history', value);
    if (value === 'currently_taking' || value === 'previously_taken') {
        router.push('/intake/glp1-type');
      } else {
        router.push('/intake/dosage-satisfaction');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[82%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-2xl mx-auto w-full">
        <Link href="/intake/treatment-benefits" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <EonmedsLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          <div>
            <h1 className="page-title mb-3">
              {language === 'es' 
                ? '¿Actualmente toma o ha tomado alguna vez un medicamento GLP-1 para perder peso?'
                : 'Do you currently take or have you ever taken a GLP-1 medication for weight loss?'}
            </h1>
            <p className="page-subtitle">
              {language === 'es'
                ? 'GLP-1s incluyen semaglutida compuesta, tirzepatida compuesta, Ozempic, Wegovy, Mounjaro o Zepbound'
                : 'GLP-1s include compounded semaglutide, compounded tirzepatide, Ozempic, Wegovy, Mounjaro or Zepbound'}
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
      <div className="px-6 lg:px-8 pb-6 max-w-md lg:max-w-2xl mx-auto w-full">
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
