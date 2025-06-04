
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/Layout/ProtectedRoute";
import AuthPage from "@/components/Auth/AuthPage";
import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";
import StudyLogsPage from "@/pages/StudyLogsPage";
import AddSessionPage from "@/pages/AddSessionPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/study-logs" element={
              <ProtectedRoute>
                <StudyLogsPage />
              </ProtectedRoute>
            } />
            <Route path="/add-session" element={
              <ProtectedRoute>
                <AddSessionPage />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
