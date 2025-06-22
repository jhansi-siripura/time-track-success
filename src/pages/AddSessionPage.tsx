
import React from 'react';
import StudyLogForm from '@/components/StudyLog/StudyLogForm';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import { useNavigate } from 'react-router-dom';

const AddSessionPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/study-logs');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add Study Session</h1>
          <p className="text-gray-600">Log a new study session</p>
        </div>
        <StudyLogForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>

      <BottomNav />
    </div>
  );
};

export default AddSessionPage;
