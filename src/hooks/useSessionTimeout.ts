'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ============================================================================
// SESSION TIMEOUT HOOK
// For HIPAA compliance: automatically clears PHI after inactivity
// ============================================================================

interface SessionTimeoutOptions {
  /** Timeout duration in milliseconds (default: 30 minutes) */
  timeout?: number;
  /** Warning duration before timeout in milliseconds (default: 5 minutes) */
  warningTime?: number;
  /** Callback when session times out */
  onTimeout?: () => void;
  /** Callback when warning should be shown */
  onWarning?: (remainingTime: number) => void;
  /** Whether timeout is enabled (default: true) */
  enabled?: boolean;
}

const DEFAULT_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const DEFAULT_WARNING = 5 * 60 * 1000; // 5 minutes before timeout

export function useSessionTimeout(options: SessionTimeoutOptions = {}) {
  const {
    timeout = DEFAULT_TIMEOUT,
    warningTime = DEFAULT_WARNING,
    onTimeout,
    onWarning,
    enabled = true,
  } = options;

  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Clear all PHI from session storage
  const clearSessionData = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Get all keys that contain intake data
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('intake_') || key.includes('consent') || key.includes('personal'))) {
        keysToRemove.push(key);
      }
    }

    // Remove all PHI-related keys
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));

    // Log the timeout event (for audit trail)
    console.warn('[SessionTimeout] Session expired due to inactivity. PHI data cleared.');
  }, []);

  // Handle session timeout
  const handleTimeout = useCallback(() => {
    clearSessionData();

    if (onTimeout) {
      onTimeout();
    } else {
      // Default behavior: redirect to home with timeout message
      router.push('/?session=expired');
    }
  }, [clearSessionData, onTimeout, router]);

  // Reset the timeout timer
  const resetTimeout = useCallback(() => {
    if (!enabled) return;

    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Set warning timer
    if (onWarning && warningTime < timeout) {
      warningRef.current = setTimeout(() => {
        const remaining = timeout - (Date.now() - lastActivityRef.current);
        onWarning(remaining);
      }, timeout - warningTime);
    }

    // Set timeout timer
    timeoutRef.current = setTimeout(handleTimeout, timeout);
  }, [enabled, handleTimeout, onWarning, timeout, warningTime]);

  // Get remaining time until timeout
  const getRemainingTime = useCallback(() => {
    const elapsed = Date.now() - lastActivityRef.current;
    return Math.max(0, timeout - elapsed);
  }, [timeout]);

  // Set up activity listeners
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    // Throttle the reset to avoid excessive calls
    let throttleTimeout: NodeJS.Timeout | null = null;
    const throttledReset = () => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        resetTimeout();
      }, 1000); // Throttle to once per second
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, throttledReset, { passive: true });
    });

    // Initial timeout setup
    resetTimeout();

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, throttledReset);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [enabled, resetTimeout]);

  return {
    resetTimeout,
    getRemainingTime,
    clearSessionData,
  };
}

export default useSessionTimeout;
