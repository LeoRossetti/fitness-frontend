'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export default function AuthRedirect({ children }: AuthRedirectProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Проверяем авторизацию при загрузке компонента
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          // Пользователь авторизован - редиректим на /clients
          router.push('/clients');
        } else {
          // Пользователь не авторизован - показываем содержимое
          setIsChecking(false);
        }
      })
      .catch((error) => {
        // Ошибка сети или backend недоступен - показываем содержимое
        console.log('Backend недоступен, показываем главную страницу:', error.message);
        setIsChecking(false);
      });
  }, [router]);

  // Показываем загрузку пока проверяем авторизацию
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
          <p className="text-gray-600">Authorization check...</p>
        </div>
      </div>
    );
  }

  // Показываем содержимое если пользователь не авторизован
  return <>{children}</>;
} 