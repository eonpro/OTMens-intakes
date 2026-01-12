'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function ChronicConditionsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const handleSelect = (value: string) => {
    sessionStorage.setItem('has_chronic_conditions', value);
    if (value === 'yes') {
        router.push('/intake/chronic-conditions-detail');
      } else {
        router.push('/intake/medications');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200">
        <div className="h-full w-[80%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 max-w-md lg:max-w-lg mx-auto w-full">
        <Link href="/intake/programs-include" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* OTMens Logo */}
      <OTMensLogo />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          {/* Title */}
          <h1 className="page-title">
            {language === 'es' 
              ? '¿Tienes alguna condición médica o enfermedad crónica?'
              : 'Do you have any medical conditions or chronic diseases?'}
          </h1>
          
          {/* Description */}
          <p className="page-subtitle">
            {language === 'es'
              ? 'Esto ayuda a tu proveedor a tener una visión completa de tu historial médico. Incluye cualquier condición que afecte tu presión arterial, corazón, riñones (incluyendo cálculos renales) o hígado, así como enfermedades como diabetes, colesterol alto, accidente cerebrovascular, cáncer o gota.'
              : 'This helps your provider get a complete picture of your medical history. Include any conditions that affect your blood pressure, heart, kidneys (including kidney stones) or liver, as well as diseases such as diabetes, high cholesterol, stroke, cancer, or gout.'}
          </p>
          
          {/* Options */}
          <div className="space-y-3">
            <button
              onClick={() => handleSelect('yes')}
              className="option-button w-full text-left p-4 rounded-2xl transition-all"
            >
                <span className="text-[16px] lg:text-lg font-medium leading-tight">
                  {language === 'es' ? 'Sí' : 'Yes'}
                </span>
            </button>
            
            <button
              onClick={() => handleSelect('no')}
              className="option-button w-full text-left p-4 rounded-2xl transition-all"
            >
                <span className="text-[16px] lg:text-lg font-medium leading-tight">
                  {language === 'es' ? 'No' : 'No'}
                </span>
            </button>
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
