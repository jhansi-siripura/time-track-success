
import React from 'react';
import RecapContainer from '@/components/Recap/RecapContainer';
import RecapSidebar from '@/components/Recap/RecapSidebar';
import { getTodayDate } from '@/lib/dateUtils';
import { BookOpen } from 'lucide-react';

const RecapPage = () => {
  const [dateFilter, setDateFilter] = React.useState(getTodayDate());
  
  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg shadow-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Study Recap
              </h1>
              <p className="text-gray-600 mt-1">Review your learning journey</p>
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
    </div>
  );
};

export default RecapPage;
