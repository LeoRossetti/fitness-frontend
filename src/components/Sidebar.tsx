'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, LayoutDashboard, Users, BarChart2, Calendar, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useContext, useState } from 'react';
import { SidebarContext } from './SidebarProvider';

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useContext(SidebarContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

      {/* Боковая панель */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-md flex flex-col transition-all duration-300 z-40
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Кнопка сворачивания */}
        <div className="p-4 flex justify-end">
          <button
            onClick={toggle}
            className="text-gray-500 hover:text-gray-700 transition cursor-pointer hidden lg:block"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 px-2 space-y-2">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={pathname === '/dashboard'}
            collapsed={collapsed}
          />
          <SidebarItem
            href="/clients"
            icon={<Users size={20} />}
            label="Clients"
            active={pathname === '/clients'}
            collapsed={collapsed}
          />
          <SidebarItem
            href="/workouts"
            icon={<Dumbbell size={20} />}
            label="Workouts"
            active={pathname === '/workouts'}
            collapsed={collapsed}
          />
          <SidebarItem
            href="/progress"
            icon={<BarChart2 size={20} />}
            label="Progress"
            active={pathname === '/progress'}
            collapsed={collapsed}
          />
          <SidebarItem
            href="/calendar"
            icon={<Calendar size={20} />}
            label="Calendar"
            active={pathname === '/calendar'}
            collapsed={collapsed}
          />
        </nav>
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
};

function SidebarItem({ href, icon, label, active, collapsed }: SidebarItemProps) {
  return (
    <Link href={href}>
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
