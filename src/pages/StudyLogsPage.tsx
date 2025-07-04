
import React from 'react';
import StudyLogTable from '@/components/StudyLog/StudyLogTable';

const StudyLogsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Study Logs</h1>
        <p className="text-gray-600">View and manage all your study sessions</p>
      </div>
      <StudyLogTable />
    </div>
  );
};

export default StudyLogsPage;
