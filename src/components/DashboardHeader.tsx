'use client';

import { useEffect, useState, useContext } from 'react';
import { Dumbbell } from 'lucide-react';
import { SidebarContext } from './SidebarProvider'; // импортируем контекст

export default function DashboardHeader() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const { collapsed } = useContext(SidebarContext); // получаем состояние из контекста

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header
      className={`fixed top-0 h-16 bg-white border-b border-gray-200 shadow-sm z-10 flex items-center justify-between px-6 transition-all duration-300
        ${collapsed ? 'left-20' : 'left-64'} right-0`}
    >
      <div className="text-xl font-bold flex items-center gap-2">
        <Dumbbell className="w-5 h-5 text-main" />
        <span className='text-primary'>TrainerHub</span>
      </div>

      {user && (
        <div className="flex items-center gap-4 text-sm text-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-base">
              👤
            </div>
            <div className="leading-tight">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
