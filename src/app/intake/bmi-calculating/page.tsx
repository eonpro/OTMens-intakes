'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BMICalculatingPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [firstName, setFirstName] = useState('there');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const hasNavigated = useRef(false);

  const steps = language === 'es' 
    ? ['Analizando peso...', 'Calculando altura...', 'Procesando datos...', '¡Casi listo!']
    : ['Analyzing weight...', 'Calculating height...', 'Processing data...', 'Almost there!'];

  // Get name on mount
  useEffect(() => {
    const nameData = sessionStorage.getItem('intake_name');
    if (nameData) {
      try {
        const parsed = JSON.parse(nameData);
        setFirstName(parsed.firstName || 'there');
      } catch {
        setFirstName('there');
      }
    }
  }, []);

  // Animate progress bar
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 70);

    return () => clearInterval(progressInterval);
  }, []);

  // Cycle through steps
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 900);

    return () => clearInterval(stepInterval);
  }, [steps.length]);

  // Handle navigation after delay
  useEffect(() => {
    const navigationTimer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/bmi-result');
      }
    }, 4000);

    return () => {
      clearTimeout(navigationTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#faf9f7] to-[#f5ecd8]/30 flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Top greeting with pulse animation */}
        <h1 className="text-[28px] lg:text-[32px] font-medium leading-tight mb-8">
          <span className="text-gray-400">
            {language === 'es' ? 'Un momento' : 'One moment'}
          </span>{' '}
          <span className="text-[#413d3d] font-bold">{firstName}</span>
          <span className="text-[#cab172] font-bold animate-pulse">...</span>
        </h1>

        {/* Animated Progress Ring */}
        <div className="flex justify-center mb-8">
          <div className="relative w-44 h-44 lg:w-52 lg:h-52">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#cab172]/20 to-[#f5ecd8]/40 animate-pulse" />
            
            {/* Progress circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f5ecd8"
                strokeWidth="6"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.83} 283`}
                className="transition-all duration-100"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cab172" />
                  <stop offset="100%" stopColor="#f7d06b" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl lg:text-5xl font-bold text-[#cab172]">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated step indicator */}
        <div className="mb-8 h-6">
          <p className="text-sm font-medium text-[#cab172] animate-pulse">
            {steps[currentStep]}
          </p>
        </div>

        {/* BMI Text with gradient highlight */}
        <div className="space-y-1">
          <p className="text-[22px] lg:text-[26px] leading-tight text-gray-400">
            {language === 'es' ? 'Overtime está calculando' : 'Overtime is calculating'}
          </p>
          <p className="text-[22px] lg:text-[26px] leading-tight">
            <span className="text-gray-400">
              {language === 'es' ? 'tu ' : 'your '}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#413d3d] to-[#cab172] font-bold">
              {language === 'es' ? 'Índice de Masa Corporal' : 'Body Mass Index'}
            </span>
          </p>
          <p className="text-[22px] lg:text-[26px] leading-tight text-gray-400">
            ({language === 'es' ? 'IMC' : 'BMI'})
          </p>
        </div>

        {/* Bottom decorative dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#cab172]"
              style={{
                animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
