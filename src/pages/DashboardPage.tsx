import React from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';
import { BarChart3 } from 'lucide-react';
const DashboardPage = () => {
  return <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            
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
    </div>;
};
export default DashboardPage;