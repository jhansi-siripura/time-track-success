
import React from 'react';
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
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Add Study Session
              </h1>
              <p className="text-gray-600 mt-1">Log a new study session</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <StudyLogForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSessionPage;
