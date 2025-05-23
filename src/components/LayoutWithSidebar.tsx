"use client";

import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { SidebarContext } from '@/components/SidebarProvider';
import { useContext } from 'react';

export default function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { collapsed } = useContext(SidebarContext);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'} ml-0`}>
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
} 