'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Quick fade out then fade in on route change
    setIsVisible(false);
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div
      className="page-transition-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-in-out',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
}
