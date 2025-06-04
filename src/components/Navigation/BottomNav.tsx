
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, BarChart3, FileText, Home } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/add-session', label: 'Add Log', icon: BookOpen },
    { path: '/study-logs', label: 'View Logs', icon: FileText },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-md text-xs font-medium transition-colors min-w-0 flex-1 ${
                isActive
                  ? 'text-blue-700'
                  : 'text-gray-600'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
