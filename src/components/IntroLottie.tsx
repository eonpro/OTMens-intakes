'use client';

import React, { useEffect, useRef, useState } from 'react';

// Floating elements configuration
const floatingElements = [
  {
    id: 'man',
    src: 'https://static.wixstatic.com/media/c49a9b_5b9a0976f96044ccbf05c4d90c382f2d~mv2.webp',
    bgColor: '#cab172',
    size: 'w-16 h-16 lg:w-20 lg:h-20',
    startPos: { x: -150, y: -200 },
    endPos: { x: -30, y: -35 },
    delay: 0,
  },
  {
    id: 'pills',
    src: 'https://static.wixstatic.com/media/c49a9b_671fa2c2d83d41029e666ec8198593db~mv2.png',
    bgColor: '#1a1a1a',
    size: 'w-20 h-20 lg:w-24 lg:h-24',
    startPos: { x: 150, y: -250 },
    endPos: { x: 15, y: -38 },
    delay: 100,
  },
  {
    id: 'doctor',
    src: 'https://static.wixstatic.com/media/c49a9b_f1ab66e055e34586ac5019808f040ee0~mv2.png',
    bgColor: '#f5f0e8',
    size: 'w-40 h-40 lg:w-52 lg:h-52',
    startPos: { x: -200, y: 100 },
    endPos: { x: -25, y: 0 },
    delay: 200,
  },
  {
    id: 'woman',
    src: 'https://static.wixstatic.com/media/c49a9b_e11bf27141fa4676b7c9d9f2438b334a~mv2.webp',
    bgColor: '#f5a623',
    size: 'w-24 h-24 lg:w-32 lg:h-32',
    startPos: { x: 200, y: -100 },
    endPos: { x: 30, y: -12 },
    delay: 150,
  },
  {
    id: 'realDoctors',
    type: 'badge',
    text: 'real doctors',
    bgColor: '#cab172',
    textColor: '#1a1a1a',
    startPos: { x: 200, y: 50 },
    endPos: { x: 28, y: 8 },
    delay: 300,
  },
  {
    id: 'personalized',
    type: 'badge',
    text: 'personalized',
    bgColor: '#6b6b6b',
    textColor: '#ffffff',
    startPos: { x: -200, y: 200 },
    endPos: { x: -28, y: 25 },
    delay: 350,
  },
  {
    id: 'vial',
    src: 'https://static.wixstatic.com/media/c49a9b_2963dc74e3ec4fb68d7f4165c1f07b58~mv2.png',
    bgColor: '#f5ecd8',
    size: 'w-28 h-28 lg:w-36 lg:h-36',
    isVial: true,
    startPos: { x: 100, y: 250 },
    endPos: { x: 8, y: 28 },
    delay: 250,
  },
];

function IntroLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(false);
  const [showLottie, setShowLottie] = useState(false);

  // Animation sequence
  useEffect(() => {
    // Start settling elements after 300ms
    const settleTimer = setTimeout(() => {
      setSettled(true);
    }, 300);

    // Show lottie after elements have settled
    const lottieTimer = setTimeout(() => {
      setShowLottie(true);
    }, 1200);

    return () => {
      clearTimeout(settleTimer);
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
      {/* Floating elements container */}
      <div 
        className="relative w-full h-full flex items-center justify-center transition-opacity duration-500"
        style={{ opacity: settled ? 0.75 : 1 }}
      >
        {floatingElements.map((element) => {
          const pos = settled ? element.endPos : element.startPos;
          
          return (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${pos.x}%), calc(-50% + ${pos.y}%))`,
                opacity: settled ? 1 : 0,
                transition: `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${element.delay}ms`,
              }}
            >
              {element.type === 'badge' ? (
                <div
                  className="px-4 py-2 rounded-full whitespace-nowrap shadow-lg"
                  style={{
                    backgroundColor: element.bgColor,
                    color: element.textColor,
                    fontWeight: 600,
                    fontSize: '14px',
                    fontStyle: 'italic',
                  }}
                >
                  {element.text}
                </div>
              ) : (
                <div
                  className={`${element.size} rounded-full overflow-hidden flex items-center justify-center shadow-xl`}
                  style={{ backgroundColor: element.bgColor }}
                >
                  <img
                    src={element.src}
                    alt=""
                    className={element.isVial ? 'w-3/4 h-3/4 object-contain' : 'w-full h-full object-cover'}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lottie logo on top */}
      <div 
        ref={containerRef} 
        className="absolute w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] flex items-center justify-center z-20 transition-opacity duration-500"
        style={{ opacity: showLottie ? 1 : 0 }}
      />
    </div>
  );
}

export default IntroLottie;
