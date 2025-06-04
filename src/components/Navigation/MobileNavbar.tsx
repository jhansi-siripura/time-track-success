
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, BarChart3, FileText, LogOut, Menu, X, Home } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileNavbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/add-session', label: 'Add Study Log', icon: BookOpen },
    { path: '/study-logs', label: 'View Study Logs', icon: FileText },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <Link to="/home" className="text-xl font-bold text-gray-900">
          Study Tracker
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex space-x-4">
            <Link
              to="/home"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/home'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
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

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden lg:block">
              {user.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Mobile Hamburger Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="font-semibold">Menu</span>
              </div>
              
              <div className="flex-1 py-4">
                <div className="space-y-2">
                  <Link
                    to="/home"
                    onClick={handleNavClick}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors w-full ${
                      location.pathname === '/home'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors w-full ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    signOut();
                    handleNavClick();
                  }}
                  className="flex items-center space-x-2 w-full justify-start"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default MobileNavbar;
