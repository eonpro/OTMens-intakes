'use client';

import React, { useEffect, useRef, useState } from 'react';

// Elements that will float around (images, badges, etc.)
const floatingElements = [
  // Man with airpods (top left)
  {
    type: 'image',
    src: 'https://static.wixstatic.com/media/c49a9b_5b9a0976f96044ccbf05c4d90c382f2d~mv2.webp',
    bgColor: '#cab172',
    size: 'small',
  },
  // Pills icon (top center)
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
    textColor: '#ffffff',
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
    type: 'image',
    src: 'https://static.wixstatic.com/media/c49a9b_2963dc74e3ec4fb68d7f4165c1f07b58~mv2.png',
    bgColor: '#f5ecd8',
    size: 'medium',
  },
];

// Final positions for composition (matching the reference image)
const finalPositions = [
  { x: -120, y: -120, rotation: 0, scale: 0.8 },   // Man - top left
  { x: 40, y: -140, rotation: 0, scale: 0.7 },     // Pills - top center
  { x: 130, y: -30, rotation: 0, scale: 0.85 },    // Woman - right
  { x: 120, y: 60, rotation: 0, scale: 0.9 },      // "real doctors" - right middle
  { x: -130, y: 100, rotation: 0, scale: 0.9 },    // "personalized" - bottom left
  { x: 30, y: 130, rotation: 0, scale: 0.75 },     // Vial - bottom center
];

// Starting positions (orbiting around center)
const getInitialOrbitPosition = (index: number, time: number = 0) => {
  const baseAngle = (index / floatingElements.length) * Math.PI * 2;
  const angle = baseAngle + time;
  const radius = 200 + Math.sin(time * 2 + index) * 40;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    rotation: 0,
    scale: 0.5 + Math.sin(time + index) * 0.1,
  };
};

function IntroLottie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationPhase, setAnimationPhase] = useState<'orbiting' | 'settling' | 'settled'>('orbiting');
  const [orbitTime, setOrbitTime] = useState(0);
  const [positions, setPositions] = useState(() => 
    floatingElements.map((_, i) => getInitialOrbitPosition(i, 0))
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
        const newTime = prev + 0.025;
        setPositions(floatingElements.map((_, i) => getInitialOrbitPosition(i, newTime)));
        return newTime;
      });
    }, 30);

    // After 1.8 seconds of orbiting, start settling
    const settleTimer = setTimeout(() => {
      setAnimationPhase('settling');
      clearInterval(orbitInterval);
      
      // Animate to final positions with staggered timing
      floatingElements.forEach((_, index) => {
        setTimeout(() => {
          setPositions(prev => {
            const newPositions = [...prev];
            newPositions[index] = finalPositions[index];
            return newPositions;
          });
        }, index * 80); // Stagger each element by 80ms
      });
      
      // Mark as settled after all transitions complete
      setTimeout(() => {
        setAnimationPhase('settled');
      }, 1000);
    }, 1800);

    return () => {
      clearInterval(orbitInterval);
      clearTimeout(settleTimer);
    };
  }, [animationPhase]);

  // Get size classes based on element size
  const getSizeClasses = (size?: string) => {
    switch (size) {
      case 'small': return 'w-14 h-14 lg:w-16 lg:h-16';
      case 'medium': return 'w-16 h-16 lg:w-20 lg:h-20';
      case 'large': return 'w-20 h-20 lg:w-24 lg:h-24';
      default: return 'w-14 h-14 lg:w-16 lg:h-16';
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden relative bg-white">
      {/* Orbiting/settling elements */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            transform: `translate(${positions[index].x}px, ${positions[index].y}px) rotate(${positions[index].rotation}deg) scale(${positions[index].scale})`,
            opacity: animationPhase === 'orbiting' ? 0.9 : 1,
            zIndex: 20 + index,
            transition: animationPhase === 'settling' || animationPhase === 'settled'
              ? `all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s`
              : 'none',
          }}
        >
          {element.type === 'image' ? (
            <div
              className={`${getSizeClasses(element.size)} rounded-full overflow-hidden flex items-center justify-center`}
              style={{
                backgroundColor: element.bgColor,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              }}
            >
              <img
                src={element.src}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="px-4 py-2 rounded-full whitespace-nowrap"
              style={{
                backgroundColor: element.bgColor,
                color: element.textColor,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                fontWeight: 600,
                fontSize: '14px',
                fontStyle: 'italic',
              }}
            >
              {element.text}
            </div>
          )}
        </div>
      ))}

      {/* Lottie logo in center */}
      <div 
        ref={containerRef} 
        className="w-[160px] h-[160px] lg:w-[240px] lg:h-[240px] flex items-center justify-center relative z-10"
      >
        <div className="text-gray-400">Loading...</div>
      </div>

      {/* Subtle golden glow effect */}
      <div 
        className={`absolute w-[280px] h-[280px] lg:w-[360px] lg:h-[360px] rounded-full transition-all duration-1000 ${
          animationPhase === 'settled' ? 'opacity-30 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(202, 177, 114, 0.2) 0%, rgba(202, 177, 114, 0.05) 50%, transparent 70%)',
          zIndex: 5,
        }}
      />

      {/* Particle sparkles during settling */}
      {animationPhase === 'settling' && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-[#cab172] rounded-full animate-ping"
              style={{
                left: `${35 + Math.random() * 30}%`,
                top: `${35 + Math.random() * 30}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default IntroLottie;
