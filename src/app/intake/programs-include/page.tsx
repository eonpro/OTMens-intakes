'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import OTMensLogo from '@/components/OTMensLogo';

export default function ProgramsIncludePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const hasNavigated = useRef(false);

  // Auto-advance after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/chronic-conditions');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  const programs = language === 'es' ? [
    {
      title: 'Chequeos Semanales',
      description: 'Un representate asignado estará contigo durante todo tu tratamiento*',
      bgColor: '#EFECE7',
      image: 'https://static.wixstatic.com/media/c49a9b_2c49b136f5ec49c787b37346cca7f47b~mv2.webp'
    },
    {
      title: 'Consultas Médicas',
      description: 'Tu proveedor en las palmas de tus manos. Consultas por telemedicina incluidas',
      bgColor: '#f5ecd8',
      image: 'https://static.wixstatic.com/media/c49a9b_5683be4d8e5a425a8cae0f35d26eb98b~mv2.webp'
    },
    {
      title: 'Ajuste de Dosis',
      description: 'Ajustamos tu dosis con el tiempo para un tratamiento 100% personalizado.',
      bgColor: '#EFECE7',
      image: 'https://static.wixstatic.com/media/c49a9b_9b3696821bfc4d84beb17a4266110488~mv2.webp'
    }
  ] : [
    {
      title: 'Weekly Check-ins',
      description: 'An assigned representative will be with you throughout your treatment*',
      bgColor: '#EFECE7',
      image: 'https://static.wixstatic.com/media/c49a9b_2c49b136f5ec49c787b37346cca7f47b~mv2.webp'
    },
    {
      title: 'Medical Consultations',
      description: 'Your provider in the palm of your hands. Telemedicine consultations included',
      bgColor: '#f5ecd8',
      image: 'https://static.wixstatic.com/media/c49a9b_5683be4d8e5a425a8cae0f35d26eb98b~mv2.webp'
    },
    {
      title: 'Dose Adjustment',
      description: 'We adjust your dose over time for 100% personalized treatment.',
      bgColor: '#EFECE7',
      image: 'https://static.wixstatic.com/media/c49a9b_9b3696821bfc4d84beb17a4266110488~mv2.webp'
    }
  ];

  const handleContinue = () => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      router.push('/intake/chronic-conditions');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-8 lg:pt-6">
        <Link 
          href="/intake/mental-health" 
          className="inline-block p-2 -ml-2 hover:bg-white/10 rounded-lg"
        >
          <svg className="w-6 h-6 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* EONMeds Logo */}
      <OTMensLogo compact={true} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">
            {language === 'es' ? (
              <>
                Todos nuestros <span className="text-[#cab172]">programas</span> incluyen
              </>
            ) : (
              <>
                All our <span className="text-[#cab172]">programs</span> include
              </>
            )}
          </h1>
        </div>

        {/* Program cards */}
        <div className="space-y-4 md:space-y-6 flex-1">
          {programs.map((program, index) => (
            <div
              key={index}
              className="rounded-3xl overflow-hidden relative min-h-[110px] md:min-h-[140px] flex items-center"
              style={{ backgroundColor: program.bgColor }}
            >
              <img
                src={program.image}
                alt={program.title}
                className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 object-cover"
              />
              <div className="flex-1 p-3 md:p-4 pl-28 md:pl-36">
                <h3 className="text-[18px] md:text-[20px] font-semibold text-black leading-tight">
                  {program.title}
                </h3>
                <p className="text-[14px] md:text-[16px] text-gray-800 leading-tight mt-1">
                  {program.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom section */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Copyright text */}
        <p className="copyright-text text-center">
          © 2025 EONPro, LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
}