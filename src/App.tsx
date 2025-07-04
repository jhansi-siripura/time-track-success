
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import ProtectedRoute from "@/components/Layout/ProtectedRoute";
import MainLayout from "@/components/Layout/MainLayout";
import AuthPage from "@/components/Auth/AuthPage";
import LandingPage from "@/pages/LandingPage";
import Index from "@/pages/Index";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";
import StudyLogsPage from "@/pages/StudyLogsPage";
import AddSessionPage from "@/pages/AddSessionPage";
import StudyPlanPage from "@/pages/StudyPlanPage";
import TodosPage from "@/pages/TodosPage";
import RecapPage from "@/pages/RecapPage";
import SettingsPage from "@/pages/SettingsPage";
import PomodoroPage from "@/pages/PomodoroPage";
import ChangelogPage from "@/pages/ChangelogPage";
import StudyGoalsPage from "@/pages/StudyGoalsPage";
import SubjectsPage from "@/pages/SubjectsPage";
import CoursesPage from "@/pages/CoursesPage";
import NotFound from "@/pages/NotFound";
import NewFeatureToast from "@/components/Navigation/NewFeatureToast";
import NewFeatureNotification from '@/components/Navigation/NewFeatureNotification';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PomodoroProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <DashboardPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/study-logs" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <StudyLogsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/add-session" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <AddSessionPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/study-goals" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <StudyGoalsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/subjects" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <SubjectsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/courses" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <CoursesPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/todos" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <TodosPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/study-plan" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <StudyPlanPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/recap" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <RecapPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/pomodoro" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <PomodoroPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <SettingsPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/changelog" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <ChangelogPage />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Global components */}
              <Toaster />
              <NewFeatureNotification />
            </div>
          </BrowserRouter>
        </PomodoroProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
