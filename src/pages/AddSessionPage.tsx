
import React from 'react';
import StudyLogForm from '@/components/StudyLog/StudyLogForm';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen } from 'lucide-react';

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
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Add Study Session
            </h1>
            <p className="text-gray-600 text-lg">Log a new study session to track your progress</p>
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
