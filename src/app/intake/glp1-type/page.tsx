'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function GLP1TypePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const medications = [
    {
      id: 'liraglutide',
      es: 'Liraglutida inyectable',
      en: 'Injectable liraglutide',
      subLabel: {
        es: 'Victoza, Saxenda',
        en: 'Victoza, Saxenda'
      }
    },
    {
      id: 'semaglutide',
      es: 'Semaglutida inyectable',
      en: 'Injectable semaglutide',
      subLabel: {
        es: 'Ozempic, Wegovy o compuesta',
        en: 'Ozempic, Wegovy or compounded'
      }
    },
    {
      id: 'tirzepatide',
      es: 'Tirzepatida inyectable',
      en: 'Injectable tirzepatide',
      subLabel: {
        es: 'Mounjaro, Zepbound o compuesta',
        en: 'Mounjaro, Zepbound or compounded'
      }
    },
    {
      id: 'oral_glp1',
      es: 'Medicamento GLP-1 Oral',
      en: 'Oral GLP-1 Medication',
      subLabel: null
    },
    {
      id: 'other',
      es: 'Otro medicamento',
      en: 'Other medication',
      subLabel: null
    }
  ];

  const handleSelect = (value: string) => {
    sessionStorage.setItem('glp1_type', value);
      
      // Navigate based on selection
    if (value === 'semaglutide') {
        router.push('/intake/semaglutide-dosage');
    } else if (value === 'tirzepatide') {
        router.push('/intake/tirzepatide-dosage');
      } else {
        // For other medications, skip to digestive conditions
        router.push('/intake/dosage-satisfaction');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[83%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href="/intake/glp1-history" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Qué medicamento GLP-1 tomaste o estás tomando actualmente?'
              : 'Which GLP-1 medication did you take or are you currently taking?'}
          </h1>

          <div className="space-y-3">
            {medications.map((med) => (
              <button
                key={med.id}
                onClick={() => handleSelect(med.id)}
                className="option-button w-full p-4 text-left rounded-2xl transition-all"
              >
                <div>
                  <span className="text-base lg:text-lg block">
                    {language === 'es' ? med.es : med.en}
                  </span>
                  {med.subLabel && (
                    <span className="text-sm opacity-60">
                      ({language === 'es' ? med.subLabel.es : med.subLabel.en})
                    </span>
                  )}
                </div>
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
              © 2025 Overtime Men's Health. Todos los derechos reservados.<br/>
              Proceso exclusivo y protegido. Copiar o reproducir sin autorización está prohibido.
            </>
          ) : (
            <>
              © 2025 Overtime Men's Health. All rights reserved.<br/>
              Exclusive and protected process. Copying or reproduction without authorization is prohibited.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
