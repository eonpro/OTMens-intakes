'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import EonmedsLogo from '@/components/EonmedsLogo';

export default function RecreationalDrugsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);

  const drugs = isSpanish ? [
    { id: 'cocaine', label: 'Cocaína' },
    { id: 'kratom', label: 'Kratom' },
    { id: 'opiates', label: 'Opiáceos/opioides' },
    { id: 'meth', label: 'Metanfetamina' },
    { id: 'cannabis', label: 'Cannabis' },
    { id: 'none', label: 'No, ninguno de estos' }
  ] : [
    { id: 'cocaine', label: 'Cocaine' },
    { id: 'kratom', label: 'Kratom' },
    { id: 'opiates', label: 'Opiates/opioids' },
    { id: 'meth', label: 'Methamphetamine' },
    { id: 'cannabis', label: 'Cannabis' },
    { id: 'none', label: 'No, none of these' }
  ];

  const handleDrugToggle = (drugId: string) => {
    if (drugId === 'none') {
      setSelectedDrugs(selectedDrugs.includes('none') ? [] : ['none']);
    } else {
      if (selectedDrugs.includes('none')) {
        setSelectedDrugs([drugId]);
      } else {
        setSelectedDrugs(prev => 
          prev.includes(drugId)
            ? prev.filter(id => id !== drugId)
            : [...prev, drugId]
        );
      }
    }
  };

  const handleContinue = () => {
    sessionStorage.setItem('recreational_drugs', JSON.stringify(selectedDrugs));
      router.push('/intake/weight-loss-history');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/20">
        <div className="h-full w-[80%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link href="/intake/digestive-conditions" className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg">
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
                ? '¿Has tomado alguna de las siguientes drogas recreativas en los últimos 6 meses?'
                : 'Have you taken any of the following recreational drugs in the past 6 months?'}
            </h1>
            <p className="mt-3 text-gray-600 text-base">
              {isSpanish
                ? 'Hacemos esta pregunta para que tu proveedor pueda tener una imagen completa de tu salud actual y determinar qué tratamiento podría ser adecuado para ti.'
                : 'We ask this question so your provider can have a complete picture of your current health and determine which treatment might be right for you.'}
            </p>
          </div>

          {/* Drugs List */}
          <div className="space-y-3">
            {drugs.map((drug) => (
              <button
                key={drug.id}
                onClick={() => handleDrugToggle(drug.id)}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-left ${
                  selectedDrugs.includes(drug.id)
                    ? 'bg-gray-200 border-gray-400'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center transition-all ${
                    selectedDrugs.includes(drug.id)
                      ? 'bg-gray-200 border-gray-400'
                      : 'bg-white border-gray-300'
                  }`}>
                    {selectedDrugs.includes(drug.id) && (
                      <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base lg:text-lg">{drug.label}</span>
                </div>
                <div></div>
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
          disabled={selectedDrugs.length === 0}
          className={`w-full py-4 px-8 rounded-full text-lg font-medium flex items-center justify-center space-x-3 transition-all ${
            selectedDrugs.length > 0
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
