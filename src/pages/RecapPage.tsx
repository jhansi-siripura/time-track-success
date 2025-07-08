
import React from 'react';
import RecapContainer from '@/components/Recap/RecapContainer';
import RecapSidebar from '@/components/Recap/RecapSidebar';
import { getTodayDate } from '@/lib/dateUtils';
import { BookOpen } from 'lucide-react';

const RecapPage = () => {
  const [dateFilter, setDateFilter] = React.useState(getTodayDate());
  
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-sm">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                Study Recap
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">Review your learning journey</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
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
