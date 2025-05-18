'use client';

import { Dumbbell } from 'lucide-react';
import { useEffect, useState } from 'react';
import {useRouter } from 'next/navigation';
import AuthModal from './AuthModal';

type User = {
  id: number;
  name: string;
  role: 'Trainer' | 'Client';
};

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md w-full">
        {/* Лого TrainerHub слева */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <Dumbbell className="h-6 w-6 text-[#7c3aed]" />
          <span className="text-[#1F2A44] text-xl font-bold">TrainerHub</span>
        </div>

        {/* Авторизованная сессия / логин */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#1F2A44]">
              👤 {user.name} ({user.role})
            </span>
            <button
              className="bg-gray-200 text-[#1F2A44] px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        ) : (
          <button
            className="bg-[#3B82F6] text-white px-6 py-3 rounded-lg hover:bg-[#2563EB] transition-colors"
            onClick={() => setShowAuth(true)}
          >
            Sign In / Sign Up
          </button>
        )}
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
