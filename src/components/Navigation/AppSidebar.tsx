
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Plus, BookOpen, Home, Settings, Timer, Brain } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';

const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();

  const mainNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/learning-matrix', label: 'Learning Matrix', icon: Brain },
    { path: '/pomodoro', label: 'Pomodoro', icon: Timer },
    { path: '/add-session', label: 'Add Study Log', icon: Plus },
    { path: '/study-logs', label: 'View Logs', icon: FileText },
    { path: '/recap', label: 'Recap', icon: BookOpen },
  ];

  const secondaryNavItems = [
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarContent className="bg-gradient-to-b from-yellow-400 to-yellow-500 px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-900/90 font-bold text-sm uppercase tracking-wider mb-6 px-0">
            MAIN
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link 
                        to={item.path} 
                        className={`
                          flex items-center space-x-4 px-0 py-3 rounded-lg transition-colors duration-200
                          ${active 
                            ? 'bg-yellow-600/30 text-yellow-900 font-medium' 
                            : 'text-yellow-900/80 hover:text-yellow-900'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-base">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-8"></div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-900/90 font-bold text-sm uppercase tracking-wider mb-6 px-0">
            SETTINGS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link 
                        to={item.path} 
                        className={`
                          flex items-center space-x-4 px-0 py-3 rounded-lg transition-colors duration-200
                          ${active 
                            ? 'bg-yellow-600/30 text-yellow-900 font-medium' 
                            : 'text-yellow-900/80 hover:text-yellow-900'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-base">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
