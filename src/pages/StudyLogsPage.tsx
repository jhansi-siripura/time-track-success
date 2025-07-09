
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import StudyLogTable from '@/components/StudyLog/StudyLogTable';
import { FileText } from 'lucide-react';

const StudyLogsPage = () => {
  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                Study Logs
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">View and manage your study sessions</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <StudyLogTable />
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyLogsPage;
