'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import PageTransition from '@/components/PageTransition';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <PageTransition>
          {children}
        </PageTransition>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
