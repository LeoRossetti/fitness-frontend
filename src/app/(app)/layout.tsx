// app/(public)/layout.tsx
'use client';

import '../styles/globals.css';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

