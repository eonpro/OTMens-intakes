'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function WeightLossSupportPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const [selectedSupport, setSelectedSupport] = useState<string[]>([]);

  const supportOptions = isSpanish ? [
    { id: 'nutrition', label: 'Recomendaciones personalizadas para nutrición y movimiento' },
    { id: 'meals', label: 'Opciones de comida convenientes (reemplazos de comidas, planes de comidas)' },
    { id: 'digital', label: 'Herramientas digitales (aplicaciones de seguimiento, coaching)' },
    { id: 'dosage', label: 'Programa de dosis personalizado que ayudaría a abordar los efectos secundarios' },
    { id: 'community', label: 'Mayor apoyo comunitario' },
    { id: 'other', label: 'Otro' }
  ] : [
    { id: 'nutrition', label: 'Personalized recommendations for nutrition and movement' },
    { id: 'meals', label: 'Convenient meal options (meal replacements, meal plans)' },
    { id: 'digital', label: 'Digital tools (tracking apps, coaching)' },
    { id: 'dosage', label: 'Personalized dosage schedule that would help address side effects' },
    { id: 'community', label: 'Stronger community support' },
    { id: 'other', label: 'Other' }
  ];

  const handleSupportToggle = (supportId: string) => {
    setSelectedSupport(prev => 
      prev.includes(supportId)
        ? prev.filter(id => id !== supportId)
        : [...prev, supportId]
    );
  };

  const handleContinue = () => {
    sessionStorage.setItem('weight_loss_support', JSON.stringify(selectedSupport));
    router.push('/intake/side-effects-info');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[87%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/weight-loss-history" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Logo */}
      <EonmedsLogo />

      {/* Main Content */}
      <div className="flex-1 px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          {/* Title */}
          <div className="text-left">
            <h1 className="page-title">
              {isSpanish 
                ? '¿Qué haría más fácil para ti mantenerte en un programa de pérdida de peso?'
                : 'What would make it easier for you to stick with a weight loss program?'}
            </h1>
            <p className="mt-3 text-gray-600 text-base">
              {isSpanish ? 'Selecciona todo lo que aplique.' : 'Select all that apply.'}
            </p>
          </div>

          {/* Support Options List */}
          <div className="space-y-3">
            {supportOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSupportToggle(option.id)}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-left ${
                  selectedSupport.includes(option.id)
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-white border-gray-200'
                }`}
              >
                <span className="text-base lg:text-lg pr-4">{option.label}</span>
                <div className={`w-5 h-5 flex-shrink-0 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  selectedSupport.includes(option.id)
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-white border-gray-300'
                }`}>
                  {selectedSupport.includes(option.id) && (
                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-2xl mx-auto w-full">
        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={selectedSupport.length === 0}
          className={`w-full py-4 px-8 rounded-full text-lg font-medium flex items-center justify-center space-x-3 transition-all ${
            selectedSupport.length > 0
              ? 'bg-black text-white hover:bg-gray-900'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>{isSpanish ? 'Continuar' : 'Continue'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        {/* Copyright text */}
        <p className="copyright-text text-center mt-4">
          {isSpanish ? (
            <>© 2025 EONPro, LLC. Todos los derechos reservados.<br/>
            Proceso exclusivo y protegido. Copiar o reproducir<br/>
            sin autorización está prohibido.</>
          ) : (
            <>© 2025 EONPro, LLC. All rights reserved.<br/>
            Exclusive and protected process. Copying or reproduction<br/>
            without authorization is prohibited.</>
          )}
        </p>
      </div>
    </div>
  );
}
