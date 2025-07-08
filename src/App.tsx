
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import DashboardPage from "./pages/DashboardPage"; 
import AddSessionPage from "./pages/AddSessionPage";
import StudyLogsPage from "./pages/StudyLogsPage";
import RecapPage from "./pages/RecapPage";
import PomodoroPage from "./pages/PomodoroPage";
import StudyPlanPage from "./pages/StudyPlanPage";
import StudyGoalsPage from "./pages/StudyGoalsPage";
import SubjectsPage from "./pages/SubjectsPage";
import CoursesPage from "./pages/CoursesPage";
import TodosPage from "./pages/TodosPage";
import SettingsPage from "./pages/SettingsPage";
import ChangelogPage from "./pages/ChangelogPage";
import LearningMatrixPage from "./pages/LearningMatrixPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import MainLayout from "./components/Layout/MainLayout";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { PomodoroProvider } from "./contexts/PomodoroContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <PomodoroProvider>
            <TooltipProvider>
              <SidebarProvider>
                <Toaster />
                <BrowserRouter>
                  <Routes>
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <HomePage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/index" element={<Index />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <DashboardPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/learning-matrix" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <LearningMatrixPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/add-session" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <AddSessionPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/study-logs" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <StudyLogsPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/recap" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <RecapPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/pomodoro" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <PomodoroPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/study-plan" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <StudyPlanPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/study-goals" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <StudyGoalsPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/subjects" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <SubjectsPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/courses" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <CoursesPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/todos" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <TodosPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <SettingsPage />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/changelog" element={
                      <ProtectedRoute>
                        <MainLayout>
                          <ChangelogPage />
                        </MainLayout>               
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </SidebarProvider>
            </TooltipProvider>
          </PomodoroProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
