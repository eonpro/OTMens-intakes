'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import OTMensLogo from '@/components/OTMensLogo';

export default function GLP1DataPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);

  useEffect(() => {
    // Trigger animations with delays
    const timer1 = setTimeout(() => setShowLine1(true), 300);
    const timer2 = setTimeout(() => setShowLine2(true), 900);
    const timer3 = setTimeout(() => setShowLine3(true), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleNext = () => {
    router.push('/intake/review');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[93%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/recreational-drugs" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <OTMensLogo compact={true} />

      {/* Main Content */}
      <div className="flex-1 px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-6">
          {/* First paragraph with animation */}
          <div className={`transition-all duration-800 ease-out ${
            showLine1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}>
            <p className="text-xl lg:text-2xl font-medium leading-relaxed text-black">
              {isSpanish
                ? 'Datos clínicos* indican que las dosis personalizadas de GLP-1 pueden ayudar a reducir los efectos secundarios sin comprometer los resultados. Los proveedores usan dosis personalizadas de semaglutida para ayudar a manejar los efectos secundarios e individualizar los resultados.'
                : 'Clinical data* indicates that personalized GLP-1 dosing can help reduce side effects without compromising results. Providers use personalized semaglutide doses to help manage side effects and individualize outcomes.'}
            </p>
          </div>

          {/* Second paragraph with animation */}
          <div className={`transition-all duration-800 ease-out ${
            showLine2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}>
            <p className="text-xl lg:text-2xl font-medium leading-relaxed text-black">
              {isSpanish
                ? 'Los pacientes que toman dosis personalizadas de semaglutida a través de nuestra plataforma reportaron perder un promedio de 20.9 libras, con solo el 4.5% reportando efectos secundarios intolerables.*'
                : 'Patients taking personalized doses of semaglutide through our platform reported losing an average of 20.9 lbs, with only 4.5% reporting intolerable side effects.*'}
            </p>
          </div>

          {/* Third paragraph with animation */}
          <div className={`transition-all duration-800 ease-out ${
            showLine3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}>
            <p className="text-xl lg:text-2xl font-medium leading-relaxed text-black">
              {isSpanish
                ? 'Si es apropiado, tu proveedor puede adaptar tu dosis para apoyar tus resultados.'
                : 'If appropriate, your provider may tailor your dose to support your results.'}
            </p>
          </div>

          {/* Data source note */}
          <div className={`transition-all duration-800 ease-out ${
            showLine3 ? 'opacity-100' : 'opacity-0'
          }`}>
            <p className="text-sm text-gray-500 mt-8">
              {isSpanish
                ? '*Datos de 7,350 pacientes que completaron un chequeo de 6 meses a través de nuestra plataforma a partir de junio de 2025.'
                : '*Data from 7,350 of patients who completed a 6 month check in through our platform as of June 2025.'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Next button */}
        <button
          onClick={handleNext}
          className="w-full py-4 px-8 rounded-full text-lg font-medium bg-black text-white hover:bg-gray-900 flex items-center justify-center space-x-3 transition-all"
        >
          <span>{isSpanish ? 'Siguiente' : 'Next'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright text */}
        <p className="copyright-text text-center mt-4">
          {isSpanish ? (
            <>© 2025 Overtime Men's Health. Todos los derechos reservados.<br/>
            Proceso exclusivo y protegido. Copiar o reproducir<br/>
            sin autorización está prohibido.</>
          ) : (
            <>© 2025 Overtime Men's Health. All rights reserved.<br/>
            Exclusive and protected process. Copying or reproduction<br/>
            without authorization is prohibited.</>
          )}
        </p>
      </div>
    </div>
  );
}
