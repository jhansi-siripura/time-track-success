
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { PomodoroProvider } from '@/contexts/PomodoroContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import StudyLogsPage from '@/pages/StudyLogsPage';
import AddSessionPage from '@/pages/AddSessionPage';
import PomodoroPage from '@/pages/PomodoroPage';
import LearningMatrixPage from '@/pages/LearningMatrixPage';
import RecapPage from '@/pages/RecapPage';
import SettingsPage from '@/pages/SettingsPage';
import ChangelogPage from '@/pages/ChangelogPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PomodoroProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/study-logs" element={<ProtectedRoute><StudyLogsPage /></ProtectedRoute>} />
              <Route path="/add-session" element={<ProtectedRoute><AddSessionPage /></ProtectedRoute>} />
              <Route path="/pomodoro" element={<ProtectedRoute><PomodoroPage /></ProtectedRoute>} />
              <Route path="/learning-matrix" element={<ProtectedRoute><LearningMatrixPage /></ProtectedRoute>} />
              <Route path="/recap" element={<ProtectedRoute><RecapPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/changelog" element={<ProtectedRoute><ChangelogPage /></ProtectedRoute>} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
            <Toaster />
          </Router>
        </PomodoroProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
