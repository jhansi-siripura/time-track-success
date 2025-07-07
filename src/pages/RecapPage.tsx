
import React from 'react';
import RecapContainer from '@/components/Recap/RecapContainer';
import RecapSidebar from '@/components/Recap/RecapSidebar';
import { getTodayDate } from '@/lib/dateUtils';
import { BookOpen } from 'lucide-react';

const RecapPage = () => {
  const [dateFilter, setDateFilter] = React.useState(getTodayDate());
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20 p-4 md:p-6">
      {/* Compact Header Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg shadow-md">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Study Recap
            </h1>
            <p className="text-sm text-gray-600">Review your learning journey</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <RecapSidebar dateFilter={dateFilter} onDateFilterChange={setDateFilter} />
        </div>
        
        <div className="lg:col-span-3">
          <RecapContainer dateFilter={dateFilter} onDateFilterChange={setDateFilter} />
        </div>
      </div>
    </div>
  );
};

export default RecapPage;
