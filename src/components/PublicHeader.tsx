'use client';

import { Dumbbell } from 'lucide-react';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import { Button } from './ui/button';

export default function PublicHeader() {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-main" />
          <span className="text-xl font-bold text-primary">TrainerHub</span>
        </div>
        <Button
          variant="outline"
          className="text-primary hover:bg-background-light"
          onClick={() => setShowModal(true)}
        >
          Sign In / Sign Up
        </Button>
      </header>
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
}
