'use client';

import React from 'react';

interface OptionButtonProps {
  label: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
  showCheckbox?: boolean;
  disabled?: boolean;
}

export default function OptionButton({
  label,
  description,
  selected = false,
  onClick,
  showCheckbox = false,
  disabled = false,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        option-button w-full text-left p-4 rounded-full transition-all
        ${selected ? 'selected' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex items-start">
        {showCheckbox && (
          <div 
            className={`
              w-5 h-5 rounded mr-3 mt-0.5 flex items-center justify-center flex-shrink-0
              transition-all
              ${selected ? 'bg-white' : 'bg-transparent'}
            `}
            style={{ border: '1.5px solid #413d3d' }}
          >
            {selected && (
              <svg className="w-3 h-3 text-[#413d3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        )}
        <div className="flex-1">
          <span className="text-[16px] lg:text-lg font-medium leading-tight block">
            {label}
          </span>
          {description && (
            <span className="text-sm opacity-60 mt-1 block">
              {description}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

