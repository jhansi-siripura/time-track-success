
import React from 'react';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import RecapContainer from '@/components/Recap/RecapContainer';
import RecapSidebar from '@/components/Recap/RecapSidebar';
import { getTodayDate } from '@/lib/dateUtils';

const RecapPage = () => {
  const [dateFilter, setDateFilter] = React.useState(getTodayDate()); // Initialize with local timezone date

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Study Recap</h1>
          <p className="text-gray-600">Review and edit your daily study sessions</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Left side on desktop, top on mobile */}
          <div className="lg:col-span-1">
            <RecapSidebar 
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
            />
          </div>
          
          {/* Main content - Right side on desktop, bottom on mobile */}
          <div className="lg:col-span-3">
            <RecapContainer 
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
            />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default RecapPage;
