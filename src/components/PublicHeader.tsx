'use client';

import { Dumbbell } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import AuthModal from './AuthModal';

export default function PublicHeader() {
  const [showModal, setShowModal] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-7xl bg-white/60 backdrop-blur-sm rounded-b-2xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Dumbbell className="h-7 w-7 text-main" />
          <span className="text-2xl font-semibold text-primary">TrainerHub</span>
        </div>
        <Button variant="default" onClick={() => setShowModal(true)}>
          Sign In / Sign Up
        </Button>
      </div>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </header>
  );
}
