
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import StudyLogForm from '@/components/StudyLog/StudyLogForm';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const AddSessionPage = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/dashboard');
  };
  
  const handleCancel = () => {
    navigate('/study-logs');
  };
  
  return (
    <MainLayout>
      <div className="p-4 sm:p-6 bg-white min-h-screen">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-blue-600 rounded-lg shadow-sm border border-blue-100">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Add Study Session
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">Log a new study session</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <StudyLogForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </MainLayout>
  );
};

export default AddSessionPage;
