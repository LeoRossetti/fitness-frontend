"use client";

import { usePathname } from 'next/navigation';

interface ContentWrapperProps {
  children: React.ReactNode;
}

export default function ContentWrapper({ children }: ContentWrapperProps) {
  const pathname = usePathname();
  
  // Отступ слева применяется только на страницах, где есть сайдбар (не на домашней странице)
  const contentClass = pathname === '/' ? 'flex-1' : 'flex-1 ml-0 lg:ml-64';

  return <div className={contentClass}>{children}</div>;
}