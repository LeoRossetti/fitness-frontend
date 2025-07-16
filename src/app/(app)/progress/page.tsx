import { Suspense } from 'react';
import ProgressPageClient from './ProgressPageClient';

export default function ProgressPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProgressPageClient />
    </Suspense>
  );
} 