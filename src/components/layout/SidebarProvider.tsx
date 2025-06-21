'use client';

import { createContext, useContext, useState } from 'react';

// Тип контекста: collapsed = свернут или нет, toggle = переключение
export const SidebarContext = createContext<{
  collapsed: boolean;
  toggle: () => void;
}>({
  collapsed: false,
  toggle: () => {},
});

// Провайдер, который оборачивает layout
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Кастомный хук для удобного использования контекста
export const useSidebar = () => useContext(SidebarContext);
