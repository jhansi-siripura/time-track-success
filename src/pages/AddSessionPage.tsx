
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
    <div className="p-6 bg-gradient-to-br from-amber-50/30 via-cream-50/20 to-yellow-50/30 min-h-full">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Add Study Session
            </h1>
            <p className="text-sm text-gray-600">Log a new study session</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 p-6">
          <StudyLogForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default AddSessionPage;
