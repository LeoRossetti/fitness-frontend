// app/(app)/layout.tsx
import '../styles/globals.css';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { SidebarProvider } from '@/components/SidebarProvider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 pt-16">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}