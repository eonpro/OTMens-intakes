'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import OTMensLogo from '@/components/OTMensLogo';

export default function ProgramsIncludePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const hasNavigated = useRef(false);
  const [showTitle, setShowTitle] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  // Staggered animations
  useEffect(() => {
    const timers = [
      setTimeout(() => setShowTitle(true), 100),
      setTimeout(() => setVisibleCards([0]), 300),
      setTimeout(() => setVisibleCards([0, 1]), 500),
      setTimeout(() => setVisibleCards([0, 1, 2]), 700),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-advance after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/chronic-conditions');
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  const programs = language === 'es' ? [
    {
      title: 'Chequeos Semanales',
      description: 'Un representate asignado estará contigo durante todo tu tratamiento*',
      bgColor: '#EFECE7',
      image: 'https://static.wixstatic.com/media/c49a9b_9879012a71074e4fb38af2dceae07f7c~mv2.webp'
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
      image: 'https://static.wixstatic.com/media/c49a9b_9879012a71074e4fb38af2dceae07f7c~mv2.webp'
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
      
      {/* OTMens Logo */}
      <OTMensLogo compact={true} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 py-8 pb-40 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Header with animation */}
        <div className={`mb-8 transition-all duration-700 ease-out ${
          showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
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

        {/* Program cards with staggered animations */}
        <div className="space-y-4 md:space-y-6 flex-1">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`rounded-3xl overflow-hidden relative min-h-[110px] md:min-h-[140px] flex items-center transition-all duration-700 ease-out ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-x-0 scale-100' 
                  : 'opacity-0 -translate-x-8 scale-95'
              }`}
              style={{ backgroundColor: program.bgColor }}
            >
              {/* Shine effect */}
              <div className={`absolute inset-0 overflow-hidden ${visibleCards.includes(index) ? 'shine-sweep' : ''}`} 
                   style={{ animationDelay: `${index * 200 + 500}ms` }} />
              
              <img
                src={program.image}
                alt={program.title}
                className={`absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 object-cover transition-all duration-500 ${
                  visibleCards.includes(index) ? 'scale-100' : 'scale-75'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              />
              <div className="flex-1 p-3 md:p-4 pl-28 md:pl-36 relative z-10">
                <h3 className="text-[18px] md:text-[20px] font-semibold text-black leading-tight">
                  {program.title}
                </h3>
                <p className="text-[14px] md:text-[16px] text-gray-800 leading-tight mt-1">
                  {program.description}
                </p>
              </div>
              
              {/* Checkmark badge */}
              <div className={`absolute top-3 right-3 w-6 h-6 rounded-full bg-[#cab172] flex items-center justify-center transition-all duration-500 ${
                visibleCards.includes(index) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`} style={{ transitionDelay: `${index * 200 + 300}ms` }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom section */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Copyright text */}
        <p className="copyright-text text-center">
          © 2025 Overtime Men's Health. All rights reserved.
        </p>
      </div>

      <style jsx>{`
        .shine-sweep::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: shineSweep 1.5s ease-in-out forwards;
        }
        @keyframes shineSweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}