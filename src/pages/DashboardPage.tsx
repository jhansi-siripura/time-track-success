
import React from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';
import { BarChart3 } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-amber-50/30 via-cream-50/20 to-yellow-50/30 min-h-full">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg shadow-md">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600">Track your study progress</p>
          </div>
        </div>
      </div>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
