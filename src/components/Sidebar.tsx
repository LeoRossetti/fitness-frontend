"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Dumbbell, BarChart2, Calendar } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  // Не показываем сайдбар на домашней странице
  if (pathname === '/') {
    return null;
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-md flex flex-col">
      {/* Логотип/название */}
      <div className="p-4 border-g inline-flex items-center">
        <Dumbbell className='text-[#8B5CF6] h-5 w-5'/>
        <h1 className="text-2xl font-bold text-[#000000]">TrainerHub</h1>
      </div>

      {/* Навигационные ссылки */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard">
              <div
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'text-[#1F2A44] hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </div>
            </Link>
          </li>
          <li>
            <Link href="/clients">
              <div
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  pathname === '/clients'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'text-[#1F2A44] hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5" />
                Clients
              </div>
            </Link>
          </li>
          <li>
            <Link href="/workouts">
              <div
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  pathname === '/workouts'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'text-[#1F2A44] hover:bg-gray-100'
                }`}
              >
                <Dumbbell className="h-5 w-5" />
                Workouts
              </div>
            </Link>
          </li>
          <li>
            <Link href="/progress">
              <div
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  pathname === '/progress'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'text-[#1F2A44] hover:bg-gray-100'
                }`}
              >
                <BarChart2 className="h-5 w-5" />
                Progress
              </div>
            </Link>
          </li>
          <li>
            <Link href="/calendar">
              <div
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  pathname === '/calendar'
                    ? 'bg-[#8B5CF6] text-white'
                    : 'text-[#1F2A44] hover:bg-gray-100'
                }`}
              >
                <Calendar className="h-5 w-5" />
                Calendar
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}