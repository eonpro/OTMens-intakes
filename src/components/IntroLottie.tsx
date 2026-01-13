'use client';

import React, { useEffect, useRef, useState } from 'react';

// Floating elements configuration with pixel positions
const floatingElements = [
  {
    id: 'man',
    src: 'https://static.wixstatic.com/media/c49a9b_5b9a0976f96044ccbf05c4d90c382f2d~mv2.webp',
    bgColor: '#cab172',
    size: 'w-14 h-14 lg:w-16 lg:h-16',
    startPos: { x: -200, y: -300 },
    endPos: { x: -80, y: -120 },
    delay: 0,
  },
  {
    id: 'pills',
    src: 'https://static.wixstatic.com/media/c49a9b_671fa2c2d83d41029e666ec8198593db~mv2.png',
    bgColor: '#1a1a1a',
    size: 'w-16 h-16 lg:w-20 lg:h-20',
    startPos: { x: 200, y: -350 },
    endPos: { x: 40, y: -130 },
    delay: 100,
  },
  {
    id: 'doctor',
    src: 'https://static.wixstatic.com/media/c49a9b_f1ab66e055e34586ac5019808f040ee0~mv2.png',
    bgColor: '#f5f0e8',
    size: 'w-36 h-36 lg:w-44 lg:h-44',
    startPos: { x: -300, y: 0 },
    endPos: { x: -70, y: 0 },
    delay: 150,
  },
  {
    id: 'woman',
    src: 'https://static.wixstatic.com/media/c49a9b_e11bf27141fa4676b7c9d9f2438b334a~mv2.webp',
    bgColor: '#f5a623',
    size: 'w-20 h-20 lg:w-24 lg:h-24',
    startPos: { x: 300, y: -100 },
    endPos: { x: 90, y: -40 },
    delay: 100,
  },
  {
    id: 'realDoctors',
    type: 'badge',
    text: 'real doctors',
    bgColor: '#cab172',
    textColor: '#1a1a1a',
    startPos: { x: 300, y: 50 },
    endPos: { x: 80, y: 50 },
    delay: 250,
  },
  {
    id: 'personalized',
    type: 'badge',
    text: 'personalized',
    bgColor: '#6b6b6b',
    textColor: '#ffffff',
    startPos: { x: -300, y: 150 },
    endPos: { x: -80, y: 100 },
    delay: 300,
  },
  {
    id: 'vial',
    src: 'https://static.wixstatic.com/media/c49a9b_2963dc74e3ec4fb68d7f4165c1f07b58~mv2.png',
    bgColor: '#f5ecd8',
    size: 'w-24 h-24 lg:w-28 lg:h-28',
    isVial: true,
    startPos: { x: 100, y: 350 },
    endPos: { x: 30, y: 120 },
    delay: 200,
  },
];

function IntroLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(false);
  const [showLottie, setShowLottie] = useState(false);

  // Animation sequence
  useEffect(() => {
    // Elements start visible, then settle after 100ms
    const settleTimer = setTimeout(() => {
      setSettled(true);
    }, 100);

    // Show lottie after elements have settled
    const lottieTimer = setTimeout(() => {
      setShowLottie(true);
    }, 1500);

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
        className="relative flex items-center justify-center transition-opacity duration-700"
        style={{ opacity: settled ? 0.75 : 1 }}
      >
        {floatingElements.map((element) => {
          const pos = settled ? element.endPos : element.startPos;
          
          return (
            <div
              key={element.id}
              className="absolute"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                transition: `transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${element.delay}ms`,
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
