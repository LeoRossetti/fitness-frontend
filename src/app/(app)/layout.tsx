// app/(app)/layout.tsx
import '../styles/globals.css';
import { SidebarProvider } from '@/components/SidebarProvider';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutWithSidebar>{children}</LayoutWithSidebar>
    </SidebarProvider>
  );
}