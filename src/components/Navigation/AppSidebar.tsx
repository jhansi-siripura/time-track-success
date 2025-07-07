
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Plus, BookOpen, Home, Settings, Timer } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';

const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();

  const mainNavItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
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
      <SidebarContent className="bg-gradient-to-b from-yellow-400 to-yellow-500 border-r border-yellow-600/20">
        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-900/80 font-semibold text-sm uppercase tracking-wider px-4 py-3">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link 
                        to={item.path} 
                        className={`
                          flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                          ${active 
                            ? 'bg-white/90 text-yellow-900 shadow-lg shadow-yellow-600/20 font-medium' 
                            : 'text-yellow-900/70 hover:bg-white/20 hover:text-yellow-900 hover:shadow-md'
                          }
                        `}
                      >
                        <Icon className={`h-5 w-5 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-4 mx-4 border-t border-yellow-600/20"></div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-900/80 font-semibold text-sm uppercase tracking-wider px-4 py-3">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
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
                          flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                          ${active 
                            ? 'bg-white/90 text-yellow-900 shadow-lg shadow-yellow-600/20 font-medium' 
                            : 'text-yellow-900/70 hover:bg-white/20 hover:text-yellow-900 hover:shadow-md'
                          }
                        `}
                      >
                        <Icon className={`h-5 w-5 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`} />
                        <span className="font-medium">{item.label}</span>
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
