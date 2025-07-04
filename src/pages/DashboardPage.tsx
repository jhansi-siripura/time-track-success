
import React from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';

const DashboardPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Track your study progress and analytics</p>
      </div>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
