'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';
import CopyrightText from '@/components/CopyrightText';

export default function TestimonialsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasNavigated = useRef(false);

  // Language-specific testimonial images
  const testimonialImages = language === 'es' ? [
    'https://static.wixstatic.com/media/c49a9b_b4dbc66741324c1f9124e3bff2094d84~mv2.webp',
    'https://static.wixstatic.com/media/c49a9b_b020b2170766409e850210d418615da1~mv2.webp',
    'https://static.wixstatic.com/media/c49a9b_e54335aad0164b22aa8a2b123bb34b7c~mv2.webp',
    'https://static.wixstatic.com/media/c49a9b_b020b2170766409e850210d418615da1~mv2.webp',
    'https://static.wixstatic.com/media/c49a9b_98e7e84f7213491a97bd9f27542c96af~mv2.webp',
    'https://static.wixstatic.com/media/c49a9b_84d69338ec814bcca3c4bacc9f1d0044~mv2.webp'
  ] : [
    'https://static.wixstatic.com/media/c49a9b_9aef40faf6684d73829744872b83dcce~mv2.webp',
    'https://static.wixstatic.com/media/c49a9b_366d79f5e59040a899c267d3675494c6~mv2.webp',
    'https://static.wixstatic.com/media/c49a9b_6bb33332ffa7459ba48bea94f24b5c5c~mv2.webp',
    'https://static.wixstatic.com/media/c49a9b_1c31b2006e6544a29aebb0e95342aecd~mv2.webp',
    'https://static.wixstatic.com/media/c49a9b_86cfd5b97dfe4d8787463f312fd03712~mv2.webp',
    'https://static.wixstatic.com/media/c49a9b_9799e7cab45f4491a2169c23be5ec63c~mv2.webp'
  ];

  // Reset slide when language changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [language]);

  // Auto-scroll functionality - 2 seconds per slide
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonialImages.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [currentSlide, isPaused, testimonialImages.length]);

  // Auto-advance after 4 seconds
  useEffect(() => {
    const navigationTimer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/intake/medical-history-overview');
      }
    }, 4000);

    return () => clearTimeout(navigationTimer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col page-fade-in">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <div className="h-full w-[70%] bg-[#f5ecd8] transition-all duration-300"></div>
      </div>
      
      {/* Back button */}
      <div className="px-6 lg:px-8 pt-6 lg:pt-4">
        <Link href="/intake/bmi-result" className="inline-block p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Link>
      </div>
      
      {/* Main content - no logo */}
      <div className="flex-1 flex flex-col px-6 lg:px-8 pb-8 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Header with Blue Verified Badge Icon */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-start">
            <img 
              src="https://static.wixstatic.com/shapes/c49a9b_d96c5f8c37844a39bfa47b0503e6167a.svg"
              alt="Verified"
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-[26px] lg:text-[30px] font-semibold leading-tight text-[#413d3d]">
            {language === 'es' 
              ? 'Únete a los miles de transformaciones que hemos ayudado a lograr.'
              : 'Join the thousands of transformations we\'ve helped achieve.'}
          </h1>
          <p className="text-[15px] text-[#413d3d]/60 leading-relaxed">
            {language === 'es'
              ? 'Cada uno de estos casos presenta pacientes reales que transformaron sus vidas.'
              : 'Each of these cases features real patients who transformed their lives.'}
          </p>
        </div>

        {/* Single Card Carousel - Centered */}
        <div 
          className="relative flex-1 flex flex-col items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="w-full max-w-[280px] mx-auto">
            <Image
              src={testimonialImages[currentSlide]}
              alt={`Testimonial ${currentSlide + 1}`}
              width={280}
              height={420}
              className="w-full h-auto rounded-2xl"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center space-x-1.5 mt-4">
            {testimonialImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsPaused(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-gray-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom section - Disclaimer only */}
      <div className="px-6 lg:px-8 pb-6 max-w-md lg:max-w-lg mx-auto w-full">
        {/* Disclaimer */}
        <p className="text-[11px] text-[#413d3d]/50 text-center leading-relaxed">
          {language === 'es'
            ? 'Los medicamentos son solo una parte del programa de pérdida de peso de EONMeds, que también incluye una dieta baja en calorías y mayor actividad física. Los clientes no fueron compensados por compartir sus opiniones. Los resultados provienen de personas que compraron varios productos, incluidos tratamientos con receta. Estos resultados no han sido verificados de forma independiente y los resultados individuales pueden variar.'
            : 'Medications are just one part of the EONMeds weight loss program, which also includes a low-calorie diet and increased physical activity. Clients were not compensated for sharing their opinions. The results come from individuals who purchased various products, including prescription treatments. These results have not been independently verified, and individual results may vary.'}
        </p>

        <CopyrightText className="mt-4" />
      </div>
    </div>
  );
}