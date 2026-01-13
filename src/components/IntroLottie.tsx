'use client';

import React, { useEffect, useRef, useState } from 'react';

// Product vial images
const productImages = [
  'https://static.wixstatic.com/media/c49a9b_2963dc74e3ec4fb68d7f4165c1f07b58~mv2.png',
  'https://static.wixstatic.com/media/c49a9b_22ff4bbf501a4cc3949520e967a6edd6~mv2.png',
  'https://static.wixstatic.com/media/c49a9b_ea76b37306424a30838fd39c13f07814~mv2.png',
  'https://static.wixstatic.com/media/c49a9b_1ccd608277be4cf9b5f3e1a91b587c09~mv2.png',
  'https://static.wixstatic.com/media/c49a9b_671fa2c2d83d41029e666ec8198593db~mv2.png',
  'https://static.wixstatic.com/media/c49a9b_bde55ed2fce74c6897e8655865ff9af5~mv2.png',
];

// Final positions for each vial (forming a semi-circle arrangement around logo)
const finalPositions = [
  { x: -130, y: -60, rotation: -12, scale: 0.85 },  // Left upper
  { x: -40, y: -110, rotation: -5, scale: 0.95 },   // Top left
  { x: 40, y: -110, rotation: 5, scale: 0.95 },     // Top right
  { x: 130, y: -60, rotation: 12, scale: 0.85 },    // Right upper
  { x: -90, y: 90, rotation: -8, scale: 0.8 },      // Bottom left
  { x: 90, y: 90, rotation: 8, scale: 0.8 },        // Bottom right
];

// Starting positions (orbiting around center)
const getInitialOrbitPosition = (index: number, time: number = 0) => {
  const baseAngle = (index / productImages.length) * Math.PI * 2;
  const angle = baseAngle + time;
  const radius = 180 + Math.sin(time * 2 + index) * 30;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    rotation: (angle * 180 / Math.PI) + 90,
    scale: 0.6 + Math.sin(time + index) * 0.1,
  };
};

function IntroLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationPhase, setAnimationPhase] = useState<'orbiting' | 'settling' | 'settled'>('orbiting');
  const [orbitTime, setOrbitTime] = useState(0);
  const [positions, setPositions] = useState(() => 
    productImages.map((_, i) => getInitialOrbitPosition(i, 0))
  );

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

  // Orbiting animation
  useEffect(() => {
    if (animationPhase !== 'orbiting') return;

    const orbitInterval = setInterval(() => {
      setOrbitTime(prev => {
        const newTime = prev + 0.03;
        setPositions(productImages.map((_, i) => getInitialOrbitPosition(i, newTime)));
        return newTime;
      });
    }, 30);

    // After 1.5 seconds of orbiting, start settling
    const settleTimer = setTimeout(() => {
      setAnimationPhase('settling');
      clearInterval(orbitInterval);
      
      // Animate to final positions with staggered timing
      productImages.forEach((_, index) => {
        setTimeout(() => {
          setPositions(prev => {
            const newPositions = [...prev];
            newPositions[index] = finalPositions[index];
            return newPositions;
          });
        }, index * 100); // Stagger each vial by 100ms
      });
      
      // Mark as settled after all transitions complete
      setTimeout(() => {
        setAnimationPhase('settled');
      }, 1200);
    }, 1500);

    return () => {
      clearInterval(orbitInterval);
      clearTimeout(settleTimer);
    };
  }, [animationPhase]);

  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden relative bg-white">
      {/* Orbiting/settling product vials */}
      {productImages.map((src, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            transform: `translate(${positions[index].x}px, ${positions[index].y}px) rotate(${positions[index].rotation}deg) scale(${positions[index].scale})`,
            opacity: animationPhase === 'orbiting' ? 0.85 : 1,
            zIndex: 20 + index,
            transition: animationPhase === 'settling' || animationPhase === 'settled'
              ? `all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s`
              : 'none',
          }}
        >
          <img
            src={src}
            alt={`Product ${index + 1}`}
            className="w-14 h-20 lg:w-18 lg:h-26 object-contain"
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))',
            }}
          />
        </div>
      ))}

      {/* Lottie logo in center */}
      <div 
        ref={containerRef} 
        className="w-[180px] h-[180px] lg:w-[280px] lg:h-[280px] flex items-center justify-center relative z-10"
      >
        <div className="text-gray-400">Loading...</div>
      </div>

      {/* Subtle golden glow effect */}
      <div 
        className={`absolute w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] rounded-full transition-all duration-1000 ${
          animationPhase === 'settled' ? 'opacity-40 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(202, 177, 114, 0.25) 0%, rgba(202, 177, 114, 0.1) 40%, transparent 70%)',
          zIndex: 5,
        }}
      />

      {/* Particle sparkles during settling */}
      {animationPhase === 'settling' && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#cab172] rounded-full animate-ping"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default IntroLottie;
