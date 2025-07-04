
import React from 'react';
import StudyLogForm from '@/components/StudyLog/StudyLogForm';
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add Study Session</h1>
        <p className="text-gray-600">Log a new study session</p>
      </div>
      <StudyLogForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
};

export default AddSessionPage;
