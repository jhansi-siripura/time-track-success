
import React from 'react';
import Dashboard from '@/components/Dashboard/Dashboard';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Track your study progress and analytics</p>
        </div>
        <Dashboard />
      </div>
      <BottomNav />
    </div>
  );
};

export default DashboardPage;
