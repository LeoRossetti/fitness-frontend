// app/(app)/layout.tsx
import '../styles/globals.css';
import { SidebarProvider } from '@/components/layout/SidebarProvider';
import LayoutWithSidebar from '@/components/layout/LayoutWithSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutWithSidebar>
        <div className="min-h-screen bg-background-light">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </div>
      </LayoutWithSidebar>
    </SidebarProvider>
  );
}