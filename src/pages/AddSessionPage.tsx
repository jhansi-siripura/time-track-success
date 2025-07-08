
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
      <div className="p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                Add Study Session
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">Log a new study session</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <StudyLogForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default AddSessionPage;
