
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/Navigation/AppSidebar';
import TopHeader from '@/components/Navigation/TopHeader';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopHeader />
          <main className="flex-1 overflow-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
