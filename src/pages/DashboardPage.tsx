
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import Dashboard from '@/components/Dashboard/Dashboard';
import { BarChart3 } from 'lucide-react';

const DashboardPage = () => {
  return (
    <MainLayout>
      <div className="p-6 bg-white">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-800 text-xl">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1 font-normal">Track your study progress and analytics</p>
            </div>
          </div>
        </div>
        <Dashboard />
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
