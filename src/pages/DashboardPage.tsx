import React from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';
import { BarChart3 } from 'lucide-react';
const DashboardPage = () => {
    return <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-sm">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">Track your study progress and analytics</p>
            </div>
          </div>
        </div>
        <Dashboard />
      </div>
    </div>;
};
export default DashboardPage;