'use client';

import React, { useEffect, useRef, useState } from 'react';

function IntroLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showImage, setShowImage] = useState(false);
  const [showLottie, setShowLottie] = useState(false);
  const [showShine, setShowShine] = useState(false);

  // Animation sequence
  useEffect(() => {
    // Show image after 100ms
    const imageTimer = setTimeout(() => {
      setShowImage(true);
    }, 100);

    // Trigger shine after image fades in (at 1200ms)
    const shineTimer = setTimeout(() => {
      setShowShine(true);
    }, 1200);

    // Show lottie after shine completes (at 2200ms)
    const lottieTimer = setTimeout(() => {
      setShowLottie(true);
    }, 2200);

    return () => {
      clearTimeout(imageTimer);
      clearTimeout(shineTimer);
      clearTimeout(lottieTimer);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !showLottie) return;

    containerRef.current.innerHTML = `
      <iframe 
        src="https://lottie.host/embed/e9c07632-2437-45f9-bf1c-56893da9efe6/5iMkBTz13A.lottie"
        style="width: 100%; height: 100%; border: none; background: transparent;"
        frameborder="0"
        allowfullscreen
        allow="autoplay"
        loading="eager"
      ></iframe>
    `;
  }, [showLottie]);

  return (
    <div className="w-full h-screen flex items-center justify-center relative bg-white overflow-hidden">
      {/* Background composition image with shine effect */}
      <div className="relative w-full" style={{ minWidth: '100vw' }}>
        <img
          src="https://static.wixstatic.com/media/c49a9b_5cf2a61d62d74615a17f3324ee0248f2~mv2.webp"
          alt="OT Mens Health"
          className="w-full h-auto object-contain transition-all duration-1000 ease-out"
          style={{ 
            opacity: showImage ? 0.6 : 0,
            transform: showImage ? 'scale(1)' : 'scale(0.8)',
          }}
        />
        
        {/* Shine overlay */}
        {showShine && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
              animation: 'intro-shine 1s ease-in-out forwards',
            }}
          />
        )}
      </div>

      {/* Lottie logo on top */}
      <div 
        ref={containerRef} 
        className="absolute w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] flex items-center justify-center z-20 transition-opacity duration-500"
        style={{ opacity: showLottie ? 1 : 0 }}
      />

      {/* Shine animation keyframes */}
      <style jsx>{`
        @keyframes intro-shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default IntroLottie;
