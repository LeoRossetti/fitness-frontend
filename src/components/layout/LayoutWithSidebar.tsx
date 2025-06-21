"use client";

import Sidebar from '@/components/layout/Sidebar';
import { LoadingBar } from '@/components/ui/loading-bar';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { SidebarContext } from '@/components/layout/SidebarProvider';
import { useContext } from 'react';

export default function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const { collapsed } = useContext(SidebarContext);

  return (
    <>
      <LoadingBar />
      <div className="flex h-screen">
        <Sidebar />
        <div className={`flex flex-col flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'} ml-0`}>
          <main className="flex-1 overflow-y-auto bg-gray-50 animate-page-transition">
            {children}
          </main>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
} 