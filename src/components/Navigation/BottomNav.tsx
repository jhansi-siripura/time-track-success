
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Target, CheckSquare, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Plan', href: '/study-plan', icon: Target },
    { name: 'To-Do', href: '/todos', icon: CheckSquare },
    { name: 'Logs', href: '/study-logs', icon: FileText },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 text-xs font-medium transition-colors",
                isActive 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", isActive && "text-blue-600")} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
