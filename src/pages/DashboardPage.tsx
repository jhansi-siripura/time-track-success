
import React from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';
import { BarChart3 } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-sm">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-800">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Track your study progress and analytics</p>
            </div>
          </div>
        </div>
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
