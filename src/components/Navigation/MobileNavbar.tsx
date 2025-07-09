
import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AppSidebar from './AppSidebar';
import ChangelogNotificationBadge from './ChangelogNotificationBadge';

const MobileNavbar = () => {
  return (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <AppSidebar />
        </SheetContent>
      </Sheet>
      
      <h1 className="font-semibold text-gray-900">StudyTracker</h1>
      
      <div className="flex items-center space-x-2">
        <ChangelogNotificationBadge />
      </div>
    </div>
  );
};

export default MobileNavbar;
