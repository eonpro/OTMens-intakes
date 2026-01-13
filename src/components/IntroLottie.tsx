'use client';

import React, { useEffect, useRef, useState } from 'react';

function IntroLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // OT Men's Health intro Lottie animation
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
  }, []);

  // Trigger image fade in after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden relative bg-white">
      {/* Background composition image - fades in */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src="https://static.wixstatic.com/media/c49a9b_5cf2a61d62d74615a17f3324ee0248f2~mv2.webp"
          alt="OT Mens Health"
          className="max-w-[90%] max-h-[80%] object-contain"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Lottie logo on top */}
      <div 
        ref={containerRef} 
        className="w-[180px] h-[180px] lg:w-[240px] lg:h-[240px] flex items-center justify-center relative z-10"
      >
        <div className="text-gray-400">Loading...</div>
      </div>
    </div>
  );
}

export default IntroLottie;
