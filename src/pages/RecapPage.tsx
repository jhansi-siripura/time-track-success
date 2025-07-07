
import React from 'react';
import RecapContainer from '@/components/Recap/RecapContainer';
import RecapSidebar from '@/components/Recap/RecapSidebar';
import { getTodayDate } from '@/lib/dateUtils';
import { BookOpen, Calendar, Clock, Target } from 'lucide-react';

const RecapPage = () => {
  const [dateFilter, setDateFilter] = React.useState(getTodayDate());
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/20 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl shadow-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Study Recap
            </h1>
            <p className="text-gray-600 text-lg">Review your learning journey, one session at a time</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50 shadow-sm">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm text-gray-600">Selected Date</p>
                <p className="font-semibold text-gray-800">{new Date(dateFilter).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50 shadow-sm">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Study Time</p>
                <p className="font-semibold text-gray-800">Track Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50 shadow-sm">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="font-semibold text-gray-800">Multi-Topic</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-amber-200/50 shadow-sm">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="font-semibold text-gray-800">Learning</p>
              </div>
            </div>
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
