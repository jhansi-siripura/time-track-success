
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, BarChart3, FileText, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/study-logs', label: 'Study Logs', icon: FileText },
    { path: '/add-session', label: 'Add Session', icon: BookOpen },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/dashboard" className="text-xl font-bold text-gray-900">
            Study Tracker
          </Link>
          
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user.email}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
