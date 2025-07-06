import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Plus, BookOpen, Home, Settings, Timer } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
const AppSidebar = () => {
  const location = useLocation();
  const {
    state
  } = useSidebar();
  const mainNavItems = [{
    path: '/home',
    label: 'Home',
    icon: Home
  }, {
    path: '/dashboard',
    label: 'Dashboard',
    icon: BarChart3
  }, {
    path: '/pomodoro',
    label: 'Pomodoro',
    icon: Timer
  }, {
    path: '/add-session',
    label: 'Add Study Log',
    icon: Plus
  }, {
    path: '/study-logs',
    label: 'View Logs',
    icon: FileText
  }, {
    path: '/recap',
    label: 'Recap',
    icon: BookOpen
  }];
  const secondaryNavItems = [{
    path: '/settings',
    label: 'Settings',
    icon: Settings
  }];
  const isActive = (path: string) => location.pathname === path;
  return <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map(item => {
              const Icon = item.icon;
              return <SidebarMenuItem key={item.path} className="bg-yellow-800">
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <Link to={item.path} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
            })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map(item => {
              const Icon = item.icon;
              return <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <Link to={item.path} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
            })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
};
export default AppSidebar;