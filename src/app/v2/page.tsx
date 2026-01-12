'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIntakeStore, useIntakeActions } from '@/store/intakeStore';
import { useLanguage } from '@/contexts/LanguageContext';
import OTMensLogo from '@/components/OTMensLogo';

/**
 * V2 LANDING PAGE
 * 
 * Enterprise-grade landing page that:
 * - Uses Zustand store for state management
 * - Automatically restores progress
 * - Clean, configuration-driven approach
 */
export default function V2LandingPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  
  const currentStep = useIntakeStore((state) => state.currentStep);
  const completedSteps = useIntakeStore((state) => state.completedSteps);
  const { resetIntake, setCurrentStep } = useIntakeActions();

  const handleStart = () => {
    // Reset for new intake
    resetIntake();
    setCurrentStep('goals');
    router.push('/v2/intake/goals');
  };

  const handleResume = () => {
    if (currentStep) {
      router.push(`/v2/intake/${currentStep}`);
    }
  };

  const hasProgress = completedSteps.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo */}
      <div className="pt-8">
        <OTMensLogo />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-8 max-w-md lg:max-w-2xl mx-auto w-full">
        <div className="space-y-8">
          {/* Title */}
          <h1 className="page-title">
            {isSpanish 
              ? 'Evaluemos tus opciones de tratamiento.' 
              : "Let's evaluate your treatment options."}
          </h1>
          
          {/* Subtitle */}
          <p className="page-subtitle">
            {isSpanish
              ? 'Descubre soluciones personalizadas basadas en tus objetivos, hábitos e historial médico.'
              : 'Discover personalized solutions based on your goals, habits, and health history.'}
          </p>

          {/* Version badge */}
          <div className="inline-block">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              V2 Enterprise Platform
            </span>
          </div>
          
          {/* Resume progress message */}
          {hasProgress && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800">
                {isSpanish
                  ? `Tienes progreso guardado (${completedSteps.length} pasos completados). ¿Deseas continuar?`
                  : `You have saved progress (${completedSteps.length} steps completed). Would you like to continue?`}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Buttons */}
      <div className="px-6 lg:px-8 pb-8 max-w-md lg:max-w-2xl mx-auto w-full space-y-3">
        {hasProgress && (
          <button
            onClick={handleResume}
            className="w-full py-4 px-8 rounded-full text-lg font-medium bg-[#413d3d] text-white hover:bg-[#2a2727] transition-all flex items-center justify-center gap-3"
          >
            <span>{isSpanish ? 'Continuar donde dejé' : 'Continue where I left off'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        <button
          onClick={handleStart}
          className={`w-full py-4 px-8 rounded-full text-lg font-medium transition-all flex items-center justify-center gap-3 ${
            hasProgress
              ? 'bg-white border-2 border-[#413d3d] text-[#413d3d] hover:bg-gray-50'
              : 'bg-[#413d3d] text-white hover:bg-[#2a2727]'
          }`}
        >
          <span>{hasProgress 
            ? (isSpanish ? 'Comenzar de nuevo' : 'Start fresh') 
            : (isSpanish ? 'Comenzar' : 'Start')
          }</span>
          {!hasProgress && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
        
        {/* Copyright */}
        <div className="mt-6 text-center">
          <p className="copyright-text">
            {isSpanish ? (
              <>
                © 2025 Overtime Men's Health. Todos los derechos reservados.<br/>
                Proceso exclusivo y protegido.
              </>
            ) : (
              <>
                © 2025 Overtime Men's Health. All rights reserved.<br/>
                Exclusive and protected process.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

