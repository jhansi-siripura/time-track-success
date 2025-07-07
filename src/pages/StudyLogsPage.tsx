
import React from 'react';
import StudyLogTable from '@/components/StudyLog/StudyLogTable';
import { FileText } from 'lucide-react';

const StudyLogsPage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-amber-50/30 via-cream-50/20 to-yellow-50/30 min-h-full">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Study Logs
            </h1>
            <p className="text-sm text-gray-600">View and manage your study sessions</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 overflow-hidden">
        <StudyLogTable />
      </div>
    </div>
  );
};

export default StudyLogsPage;
