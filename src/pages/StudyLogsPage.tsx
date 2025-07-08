
import React from 'react';
import StudyLogTable from '@/components/StudyLog/StudyLogTable';
import { FileText } from 'lucide-react';

const StudyLogsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Study Logs
              </h1>
              <p className="text-gray-600 mt-1">View and manage your study sessions</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <StudyLogTable />
        </div>
      </div>
    </div>
  );
};

export default StudyLogsPage;
