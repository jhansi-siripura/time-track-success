import React from 'react';
import RecapContainer from '@/components/Recap/RecapContainer';
import RecapSidebar from '@/components/Recap/RecapSidebar';
import { getTodayDate } from '@/lib/dateUtils';
const RecapPage = () => {
  const [dateFilter, setDateFilter] = React.useState(getTodayDate());
  return <div className="p-6 bg-yellow-300">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Study Recap</h1>
        <p className="text-gray-600">Review and edit your daily study sessions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <RecapSidebar dateFilter={dateFilter} onDateFilterChange={setDateFilter} />
        </div>
        
        <div className="lg:col-span-3">
          <RecapContainer dateFilter={dateFilter} onDateFilterChange={setDateFilter} />
        </div>
      </div>
    </div>;
};
export default RecapPage;