'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import OTMensLogo from '@/components/OTMensLogo';

export default function SurgeryPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();

  const handleSelect = (value: string) => {
    sessionStorage.setItem('surgery_history', value);
    if (value === 'yes') {
      router.push('/intake/surgery-details');
    } else {
      router.push('/intake/blood-pressure');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[78%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/pregnancy" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
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
                ? '¿Ha tenido alguna cirugía o procedimiento médico?'
                : 'Have you had any surgery or medical procedure?'}
            </h1>
            <p className="page-subtitle">
              {language === 'es'
                ? 'Esta información ayuda a su proveedor a comprender completamente su historial médico y a ofrecerle el tratamiento más adecuado'
                : 'This information helps your provider fully understand your medical history and offer you the most appropriate treatment'}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleSelect('yes')}
              className="option-button w-full p-4 text-left rounded-2xl transition-all"
            >
              <span className="text-base lg:text-lg">
                {language === 'es' ? 'Sí' : 'Yes'}
              </span>
            </button>

            <button
              onClick={() => handleSelect('no')}
              className="option-button w-full p-4 text-left rounded-2xl transition-all"
            >
              <span className="text-base lg:text-lg">
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
