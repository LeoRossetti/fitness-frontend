'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, LayoutDashboard, Users, BarChart2, Calendar, ChevronLeft, ChevronRight, Menu, FileText, LogOut } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { SidebarContext } from '@/components/layout/SidebarProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useContext(SidebarContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  if (pathname === '/') return null;

  return (
    <>
      {/* Мобильное меню */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        <Menu size={24} />
      </button>

      {/* Мобильное меню с информацией о пользователе */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-64 h-screen bg-white shadow-lg z-50 flex flex-col">
          {/* Заголовок мобильного меню */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-main" />
                <span className='text-primary font-bold text-lg'>TrainerHub</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>

          {/* Навигация */}
          <nav className="flex-1 px-2 space-y-2 py-4">
            <SidebarItem
              href="/dashboard"
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active={pathname === '/dashboard'}
              collapsed={false}
              onMobileItemClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/clients"
              icon={<Users size={20} />}
              label="Clients"
              active={pathname === '/clients'}
              collapsed={false}
              onMobileItemClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/workouts"
              icon={<Dumbbell size={20} />}
              label="Workouts"
              active={pathname === '/workouts'}
              collapsed={false}
              onMobileItemClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/workout_templates"
              icon={<FileText size={20} />}
              label="Templates"
              active={pathname === '/workout_templates'}
              collapsed={false}
              onMobileItemClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/progress"
              icon={<BarChart2 size={20} />}
              label="Progress"
              active={pathname === '/progress'}
              collapsed={false}
              onMobileItemClick={() => setIsMobileMenuOpen(false)}
            />
            <SidebarItem
              href="/calendar"
              icon={<Calendar size={20} />}
              label="Calendar"
              active={pathname === '/calendar'}
              collapsed={false}
              onMobileItemClick={() => setIsMobileMenuOpen(false)}
            />
          </nav>

          {/* Секция пользователя в мобильном меню */}
          {user && (
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-base">
                    👤
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Боковая панель */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-md flex flex-col transition-all duration-300 z-40
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Логотип */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-main" />
              {!collapsed && <span className='text-primary font-bold text-lg'>TrainerHub</span>}
            </div>
            <button
              onClick={toggle}
              className="text-gray-500 hover:text-gray-700 transition cursor-pointer hidden lg:block"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex-1 px-2 space-y-2 py-4">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={pathname === '/dashboard'}
            collapsed={collapsed}
            onMobileItemClick={() => setIsMobileMenuOpen(false)}
          />
          <SidebarItem
            href="/clients"
            icon={<Users size={20} />}
            label="Clients"
            active={pathname === '/clients'}
            collapsed={collapsed}
            onMobileItemClick={() => setIsMobileMenuOpen(false)}
          />
          <SidebarItem
            href="/workouts"
            icon={<Dumbbell size={20} />}
            label="Workouts"
            active={pathname === '/workouts'}
            collapsed={collapsed}
            onMobileItemClick={() => setIsMobileMenuOpen(false)}
          />
          <SidebarItem
            href="/workout_templates"
            icon={<FileText size={20} />}
            label="Templates"
            active={pathname === '/workout_templates'}
            collapsed={collapsed}
            onMobileItemClick={() => setIsMobileMenuOpen(false)}
          />
          <SidebarItem
            href="/progress"
            icon={<BarChart2 size={20} />}
            label="Progress"
            active={pathname === '/progress'}
            collapsed={collapsed}
            onMobileItemClick={() => setIsMobileMenuOpen(false)}
          />
          <SidebarItem
            href="/calendar"
            icon={<Calendar size={20} />}
            label="Calendar"
            active={pathname === '/calendar'}
            collapsed={collapsed}
            onMobileItemClick={() => setIsMobileMenuOpen(false)}
          />
        </nav>

        {/* Секция пользователя */}
        {user && (
          <div className="p-4 border-t border-gray-200">
            {collapsed ? (
              // Свернутый вид - только аватар с тултипом
              <div className="flex justify-center">
                <div 
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-base cursor-pointer hover:bg-gray-300 transition-colors"
                  title={`${user.name} (${user.role})`}
                >
                  👤
                </div>
              </div>
            ) : (
              // Развернутый вид - полная информация
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-base">
                    👤
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Затемнение фона при открытом мобильном меню */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

type SidebarItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  onMobileItemClick?: () => void;
};

function SidebarItem({ href, icon, label, active, collapsed, onMobileItemClick }: SidebarItemProps) {
  const handleClick = () => {
    // Закрываем мобильное меню при клике на пункт навигации
    if (onMobileItemClick) {
      onMobileItemClick();
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      <div
        className={`
          flex items-center rounded-lg transition-all p-2
          ${collapsed ? 'justify-center' : 'gap-3'}
          ${active ? 'bg-[#8B5CF6] text-white' : 'text-[#1F2A44] hover:bg-gray-100'}
        `}
      >
        {icon}
        {!collapsed && <span className="whitespace-nowrap">{label}</span>}
      </div>
    </Link>
  );
}
