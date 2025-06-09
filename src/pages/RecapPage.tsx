
import React from 'react';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import RecapContainer from '@/components/Recap/RecapContainer';

const RecapPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Study Recap</h1>
          <p className="text-gray-600">Review and edit your daily study sessions</p>
        </div>
        <RecapContainer />
      </div>
      <BottomNav />
    </div>
  );
};

export default RecapPage;
