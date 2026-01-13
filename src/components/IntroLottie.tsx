'use client';

import React, { useEffect, useRef, useState } from 'react';

function IntroLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showImage, setShowImage] = useState(false);
  const [showLottie, setShowLottie] = useState(false);

  // Sequence: Wait -> Fade in image -> Show Lottie on top
  useEffect(() => {
    // Step 1: After 200ms, start fading in the image
    const imageTimer = setTimeout(() => {
      setShowImage(true);
    }, 200);

    // Step 2: After image has faded in (1s), show lottie
    const lottieTimer = setTimeout(() => {
      setShowLottie(true);
    }, 800);

    return () => {
      clearTimeout(imageTimer);
      clearTimeout(lottieTimer);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !showLottie) return;

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
  }, [showLottie]);

  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden relative bg-white">
      {/* Background composition image - fades in with scale */}
      <div 
        className="absolute inset-0 flex items-center justify-center px-[20px] transition-all duration-1000 ease-out"
        style={{
          opacity: showImage ? 1 : 0,
          transform: showImage ? 'scale(1)' : 'scale(0.9)',
        }}
      >
        <img
          src="https://static.wixstatic.com/media/c49a9b_5cf2a61d62d74615a17f3324ee0248f2~mv2.webp"
          alt="OT Mens Health"
          className="w-[300%] max-w-none object-contain"
          style={{ maxHeight: 'none' }}
        />
      </div>

      {/* Lottie logo on top - fades in after image */}
      <div 
        ref={containerRef} 
        className="w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] flex items-center justify-center relative z-10 transition-opacity duration-500"
        style={{
          opacity: showLottie ? 1 : 0,
        }}
      >
        {!showLottie && <div className="text-gray-400"></div>}
      </div>
    </div>
  );
}

export default IntroLottie;
