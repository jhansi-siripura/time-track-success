
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-gradient-to-r from-slate-800/95 to-slate-900/95 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-6">
          <SidebarTrigger className="p-2 hover:bg-slate-700/60 rounded-lg transition-colors text-slate-200 hover:text-white" />
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-yellow-300 transition-all">
                Study Tracker
              </div>
              <div className="text-xs text-slate-400 font-medium -mt-1">Your Learning Companion</div>
            </div>
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="search" 
              placeholder="Search logs, subjects, notes..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="pl-12 pr-4 py-3 bg-slate-700/60 border-slate-600/50 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl shadow-sm backdrop-blur-sm placeholder:text-slate-400 hover:bg-slate-700/80 transition-colors text-white"
            />
          </form>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-3 p-3 hover:bg-slate-700/60 rounded-xl transition-all text-slate-200 hover:text-white">
                <span className="text-sm hidden sm:block font-medium">
                  {user.email}
                </span>
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-slate-600/50 hover:ring-amber-400/60 transition-all">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800/95 backdrop-blur-md border-slate-700/50 shadow-xl">
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-slate-700/80 rounded-lg mx-1 text-slate-200 hover:text-white">
                  <Settings className="h-4 w-4 text-amber-400" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/changelog" className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-slate-700/80 rounded-lg mx-1 text-slate-200 hover:text-white">
                  <FileText className="h-4 w-4 text-amber-400" />
                  <span>Changelog</span>
                  <ChangelogNotificationBadge />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <DropdownMenuItem onClick={signOut} className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg mx-1">
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
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            type="search" 
            placeholder="Search..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="pl-12 pr-4 py-3 bg-slate-700/60 border-slate-600/50 focus:border-amber-400 focus:ring-amber-400/20 rounded-xl shadow-sm text-white placeholder:text-slate-400"
          />
        </form>
      </div>
    </header>
  );
};

export default TopHeader;
