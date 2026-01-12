'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function BloodPressurePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const bloodPressureOptions = [
    { 
      id: 'normal', 
      es: 'Menos de 120 / Menos de 80', 
      en: 'Less than 120 / Less than 80',
      subLabel: { es: 'Normal', en: 'Normal' }
    },
    { 
      id: 'elevated', 
      es: '120-129 / Menos de 80', 
      en: '120-129 / Less than 80',
      subLabel: { es: 'Elevada', en: 'Elevated' }
    },
    { 
      id: 'high_stage1', 
      es: '130-139 / 80-89', 
      en: '130-139 / 80-89',
      subLabel: { es: 'Presión Alta – Etapa 1', en: 'High Blood Pressure – Stage 1' }
    },
    { 
      id: 'high_stage2', 
      es: '140 o más / 90 o más', 
      en: '140 or higher / 90 or higher',
      subLabel: { es: 'Presión Alta – Etapa 2', en: 'High Blood Pressure – Stage 2' }
    },
    { 
      id: 'crisis', 
      es: 'Más de 180 / Más de 120', 
      en: 'Higher than 180 / Higher than 120',
      subLabel: { es: 'Crisis hipertensiva', en: 'Hypertensive crisis' }
    },
    { 
      id: 'unknown', 
      es: 'No lo sé', 
      en: "I don't know",
      subLabel: null
    },
    { 
      id: 'not_measured', 
      es: 'No me la he medido recientemente', 
      en: "I haven't measured it recently",
      subLabel: null
    }
  ];

  const handleSelect = (value: string) => {
    sessionStorage.setItem('blood_pressure', value);
    router.push('/intake/treatment-benefits');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[80%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/surgery" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
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
            <h1 className="page-title mb-2">
              {language === 'es' 
                ? '¿Cuál fue su lectura de presión arterial más reciente?'
                : 'What was your most recent blood pressure reading?'}
            </h1>
            <p className="page-subtitle">
              {language === 'es'
                ? '(Si la conoce, seleccione la opción más cercana.)'
                : '(If you know it, select the closest option.)'}
            </p>
          </div>

          <div className="space-y-3">
            {bloodPressureOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className="option-button w-full p-4 text-left rounded-2xl transition-all"
              >
                <div>
                  <span className="text-base lg:text-lg block">
                    {language === 'es' ? option.es : option.en}
                  </span>
                  {option.subLabel && (
                    <span className="text-sm opacity-60">
                      ({language === 'es' ? option.subLabel.es : option.subLabel.en})
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
