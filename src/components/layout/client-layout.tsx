'use client';

import { LoadingBar } from '@/components/ui/loading-bar';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingBar />
      <main className="animate-page-transition">
        {children}
      </main>
      <ScrollToTop />
    </>
  );
} 