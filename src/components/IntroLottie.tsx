'use client';

import React, { useEffect, useRef, useState } from 'react';

// Elements that will float around (images, badges, etc.)
const floatingElements = [
  // Doctor (center - main element)
  {
    type: 'image',
    src: 'https://static.wixstatic.com/media/c49a9b_f1ab66e055e34586ac5019808f040ee0~mv2.png',
    bgColor: '#f5f0e8',
    size: 'xlarge',
  },
  // Man with airpods (top left)
  {
    type: 'image',
    src: 'https://static.wixstatic.com/media/c49a9b_5b9a0976f96044ccbf05c4d90c382f2d~mv2.webp',
    bgColor: '#cab172',
    size: 'small',
  },
  // Pills icon (top center-right)
  {
    type: 'image',
    src: 'https://static.wixstatic.com/media/c49a9b_671fa2c2d83d41029e666ec8198593db~mv2.png',
    bgColor: '#1a1a1a',
    size: 'small',
  },
  // Woman in scrubs (right)
  {
    type: 'image',
    src: 'https://static.wixstatic.com/media/c49a9b_e11bf27141fa4676b7c9d9f2438b334a~mv2.webp',
    bgColor: '#f5a623',
    size: 'medium',
  },
  // "real doctors" badge
  {
    type: 'badge',
    text: 'real doctors',
    bgColor: '#cab172',
    textColor: '#1a1a1a',
  },
  // "personalized" badge
  {
    type: 'badge',
    text: 'personalized',
    bgColor: '#6b6b6b',
    textColor: '#ffffff',
  },
  // Medication vial (bottom)
  {
    type: 'vial',
    src: 'https://static.wixstatic.com/media/c49a9b_2963dc74e3ec4fb68d7f4165c1f07b58~mv2.png',
    bgColor: '#f5ecd8',
    size: 'medium',
  },
];

// Final positions for composition (matching the reference image exactly)
const finalPositions = [
  { x: -60, y: 20, scale: 1 },      // Doctor - center-left (main)
  { x: -110, y: -130, scale: 1 },   // Man - top left
  { x: 70, y: -120, scale: 1 },     // Pills - top center-right
  { x: 120, y: -20, scale: 1 },     // Woman - right
  { x: 110, y: 80, scale: 1 },      // "real doctors" - right middle
  { x: -120, y: 130, scale: 1 },    // "personalized" - bottom left
  { x: 60, y: 150, scale: 1 },      // Vial - bottom center-right
];

// Starting positions (scattered around)
const startPositions = [
  { x: -200, y: -150 },  // Doctor
  { x: -250, y: -100 },  // Man
  { x: 200, y: -200 },   // Pills
  { x: 250, y: 0 },      // Woman
  { x: 200, y: 150 },    // real doctors badge
  { x: -200, y: 200 },   // personalized badge
  { x: 0, y: 250 },      // Vial
];

function IntroLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationPhase, setAnimationPhase] = useState<'floating' | 'settled'>('floating');
  const [floatOffset, setFloatOffset] = useState(0);

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

  // Floating animation using requestAnimationFrame
  useEffect(() => {
    if (animationPhase === 'settled') return;

    let animationId: number;
    const animate = () => {
      setFloatOffset(prev => prev + 0.05);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [animationPhase]);

  // After 1.8 seconds, settle into final positions
  useEffect(() => {
    const settleTimer = setTimeout(() => {
      setAnimationPhase('settled');
    }, 1800);

    return () => clearTimeout(settleTimer);
  }, []);

  // Get size classes based on element size
  const getSizeClasses = (size?: string) => {
    switch (size) {
      case 'small': return 'w-12 h-12 lg:w-14 lg:h-14';
      case 'medium': return 'w-16 h-16 lg:w-20 lg:h-20';
      case 'large': return 'w-20 h-20 lg:w-24 lg:h-24';
      case 'xlarge': return 'w-32 h-32 lg:w-40 lg:h-40';
      default: return 'w-14 h-14 lg:w-16 lg:h-16';
    }
  };

  // Calculate floating position with gentle bobbing
  const getFloatingPosition = (index: number) => {
    const start = startPositions[index];
    const offsetX = Math.sin(floatOffset + index * 0.8) * 15;
    const offsetY = Math.cos(floatOffset + index * 0.6) * 12;
    return {
      x: start.x + offsetX,
      y: start.y + offsetY,
    };
  };

  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden relative bg-white">
      {/* Floating/settling elements */}
      {floatingElements.map((element, index) => {
        const floatPos = getFloatingPosition(index);
        const endPos = finalPositions[index];
        const isSettled = animationPhase === 'settled';
        
        return (
          <div
            key={index}
            className="absolute"
            style={{
              transform: `translate(${isSettled ? endPos.x : floatPos.x}px, ${isSettled ? endPos.y : floatPos.y}px) scale(${isSettled ? endPos.scale : 0.7})`,
              opacity: isSettled ? 1 : 0.85,
              zIndex: index === 0 ? 15 : 20 + index,
              transition: isSettled ? `all 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s` : 'none',
            }}
          >
            {element.type === 'image' || element.type === 'vial' ? (
              <div
                className={`${getSizeClasses(element.size)} rounded-full overflow-hidden flex items-center justify-center`}
                style={{
                  backgroundColor: element.bgColor,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                }}
              >
                <img
                  src={element.src}
                  alt=""
                  className={element.type === 'vial' ? 'w-3/4 h-3/4 object-contain' : 'w-full h-full object-cover'}
                />
              </div>
            ) : (
              <div
                className="px-4 py-2 rounded-full whitespace-nowrap"
                style={{
                  backgroundColor: element.bgColor,
                  color: element.textColor,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                  fontWeight: 600,
                  fontSize: '14px',
                  fontStyle: 'italic',
                }}
              >
                {element.text}
              </div>
            )}
          </div>
        );
      })}

      {/* Lottie logo in center - hidden after elements settle */}
      <div 
        ref={containerRef} 
        className={`w-[120px] h-[120px] lg:w-[160px] lg:h-[160px] flex items-center justify-center relative z-10 transition-opacity duration-500 ${
          animationPhase === 'settled' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="text-gray-400">Loading...</div>
      </div>
    </div>
  );
}

export default IntroLottie;
