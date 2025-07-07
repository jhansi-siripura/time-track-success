
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, Search, FileText, User, BookOpen } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ChangelogNotificationBadge from './ChangelogNotificationBadge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const TopHeader = () => {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-200/30 bg-gradient-to-r from-amber-50/95 to-yellow-50/95 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-6">
          <SidebarTrigger className="p-2 hover:bg-amber-100/80 rounded-lg transition-colors" />
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent group-hover:from-amber-700 group-hover:to-yellow-700 transition-all">
                Study Tracker
              </div>
              <div className="text-xs text-amber-700/70 font-medium -mt-1">Your Learning Companion</div>
            </div>
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
            <Input 
              type="search" 
              placeholder="Search logs, subjects, notes..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="pl-12 pr-4 py-3 bg-white/90 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl shadow-sm backdrop-blur-sm placeholder:text-amber-600/60 hover:bg-white transition-colors"
            />
          </form>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-3 p-3 hover:bg-amber-100/80 rounded-xl transition-all">
                <span className="text-sm text-amber-700 hidden sm:block font-medium">
                  {user.email}
                </span>
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-amber-200/50 hover:ring-amber-300/60 transition-all">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border-amber-200/50 shadow-xl">
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-amber-50/80 rounded-lg mx-1">
                  <Settings className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-700">Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/changelog" className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-amber-50/80 rounded-lg mx-1">
                  <FileText className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-700">Changelog</span>
                  <ChangelogNotificationBadge />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-amber-200/50" />
              <DropdownMenuItem onClick={signOut} className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-red-50/80 text-red-600 rounded-lg mx-1">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search */}
      <div className="px-6 pb-4 md:hidden">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
          <Input 
            type="search" 
            placeholder="Search..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="pl-12 pr-4 py-3 bg-white/90 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl shadow-sm"
          />
        </form>
      </div>
    </header>
  );
};

export default TopHeader;
