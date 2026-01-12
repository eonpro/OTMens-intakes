'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import OTMensLogo from '@/components/OTMensLogo';

export default function WeightLossHistoryPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const reasons = isSpanish ? [
    { id: 'results', label: 'No veía resultados lo suficientemente rápido' },
    { id: 'stick', label: 'No pude mantenerme constante' },
    { id: 'expensive', label: 'Se volvió muy costoso' },
    { id: 'side_effects', label: 'Experimenté efectos secundarios' },
    { id: 'life', label: 'La vida se interpuso (estrés, viajes, obligaciones familiares)' },
    { id: 'other', label: 'Otro' },
    { id: 'consistent', label: 'No, generalmente soy constante' }
  ] : [
    { id: 'results', label: 'I wasn\'t seeing results fast enough' },
    { id: 'stick', label: 'I couldn\'t stick with it' },
    { id: 'expensive', label: 'It became too expensive' },
    { id: 'side_effects', label: 'I experienced side effects' },
    { id: 'life', label: 'Life got in the way (stress, travel, family obligations)' },
    { id: 'other', label: 'Other' },
    { id: 'consistent', label: 'No, I\'m usually consistent' }
  ];

  const handleReasonToggle = (reasonId: string) => {
    if (reasonId === 'consistent') {
      setSelectedReasons(selectedReasons.includes('consistent') ? [] : ['consistent']);
    } else {
      if (selectedReasons.includes('consistent')) {
        setSelectedReasons([reasonId]);
      } else {
        setSelectedReasons(prev => 
          prev.includes(reasonId)
            ? prev.filter(id => id !== reasonId)
            : [...prev, reasonId]
        );
      }
    }
  };

  const handleContinue = () => {
    sessionStorage.setItem('weight_loss_history', JSON.stringify(selectedReasons));
    router.push('/intake/weight-loss-support');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[85%] bg-[#f5ecd8] transition-all duration-300"></div>
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
      <OTMensLogo />

      {/* Main Content */}
      <div className="flex-1 px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        <div className="space-y-8">
          {/* Title */}
          <div className="text-left">
            <h1 className="page-title">
              {isSpanish 
                ? '¿Alguna vez has dejado un programa de pérdida de peso antes de alcanzar tu meta?'
                : 'Have you ever stopped a weight loss program before reaching your goal?'}
            </h1>
            <p className="mt-3 text-lg text-black">
              {isSpanish ? 'Si es así, ¿por qué?' : 'If so, why?'}
            </p>
          </div>

          {/* Reasons List */}
          <div className="space-y-3">
            {reasons.map((reason) => (
              <button
                key={reason.id}
                onClick={() => handleReasonToggle(reason.id)}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-left ${
                  selectedReasons.includes(reason.id)
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-white border-gray-200'
                }`}
              >
                <span className="text-base lg:text-lg">{reason.label}</span>
                <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center transition-all ${
                  selectedReasons.includes(reason.id)
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-white border-gray-300'
                }`}>
                  {selectedReasons.includes(reason.id) && (
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
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={selectedReasons.length === 0}
          className={`w-full py-4 px-8 rounded-full text-lg font-medium flex items-center justify-center space-x-3 transition-all ${
            selectedReasons.length > 0
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
