
import React from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';
import { BarChart3 } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 min-h-full">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Track your study progress and analytics</p>
          </div>
        </div>
      </div>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
