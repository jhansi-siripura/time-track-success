
import React from 'react';
import StudyLogTable from '@/components/StudyLog/StudyLogTable';
import MobileNavbar from '@/components/Navigation/MobileNavbar';
import BottomNav from '@/components/Navigation/BottomNav';

const StudyLogsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Study Logs</h1>
          <p className="text-gray-600">View and manage all your study sessions</p>
        </div>
        <StudyLogTable />
      </div>
      <BottomNav />
    </div>
  );
};

export default StudyLogsPage;
