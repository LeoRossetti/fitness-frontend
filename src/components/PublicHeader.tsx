'use client';

import { Dumbbell } from 'lucide-react';
import { useState } from 'react';
import AuthModal from './AuthModal';

export default function PublicHeader() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-purple-600" />
          <span className="text-xl font-bold text-gray-800">TrainerHub</span>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setShowModal(true)}
        >
          Sign In / Sign Up
        </button>
      </header>
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  );
}
