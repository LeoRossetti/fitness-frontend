'use client';

import { useEffect, useState } from 'react';

export default function DashboardHeader() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

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
    <header className="w-full flex justify-end px-6 py-4 border-b bg-white shadow-sm">
      {user ? (
        <div className="flex items-center gap-4 text-sm text-gray-800">
          👤 {user.name} ({user.role})
          <button
            className="ml-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      ) : null}
    </header>
  );
}
