'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface OTMensLogoProps {
  compact?: boolean;
  showLottie?: boolean;
  inline?: boolean; // When true, renders without outer wrapper (for use inside content wrappers)
}

export default function EonmedsLogo({ compact = false, showLottie = true, inline = false }: OTMensLogoProps) {
  // Use same max-width constraint as content to ensure alignment
  const maxWidthClass = compact ? 'max-w-md lg:max-w-lg' : 'max-w-md lg:max-w-2xl';

  const logoContent = (
    <div className="flex items-center justify-between">
      <img
        src="https://static.wixstatic.com/shapes/c49a9b_5139736743794db7af38c583595f06fb.svg"
        alt="Overtime Men's Health"
        className="h-7 w-auto"
      />
      {showLottie && (
        <div className="w-[70px] h-[70px] overflow-hidden">
          <DotLottieReact
            src="https://lottie.host/6827dbdb-1080-417f-87b4-13111a99ba80/11Q27L9eyb.lottie"
            loop
            autoplay
            style={{
              width: '70px',
              height: '70px',
            }}
          />
        </div>
      )}
    </div>
  );

  if (inline) {
    return <div className="mb-4">{logoContent}</div>;
  }

  return (
    <div className={`px-6 lg:px-8 mb-4 ${maxWidthClass} mx-auto w-full`}>
      {logoContent}
    </div>
  );
}
