
import React from 'react';
import StudyLogTable from '@/components/StudyLog/StudyLogTable';
import { FileText, BookOpen } from 'lucide-react';

const StudyLogsPage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-amber-50/30 via-cream-50/20 to-yellow-50/30 min-h-full">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
              Study Logs
            </h1>
            <p className="text-gray-600 text-lg">View and manage all your study sessions</p>
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
