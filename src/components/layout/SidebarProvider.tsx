'use client';

import { createContext, useContext, useState } from 'react';

// Context type: collapsed = is sidebar collapsed, toggle = toggle function
export const SidebarContext = createContext<{
  collapsed: boolean;
  toggle: () => void;
}>({
  collapsed: false,
  toggle: () => {},
});

// Provider that wraps the layout
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Custom hook for convenient context usage
export const useSidebar = () => useContext(SidebarContext);
