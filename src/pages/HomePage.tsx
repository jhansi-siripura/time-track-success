
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3, BookOpen, Clock, Target, TrendingUp, Calendar } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'View Dashboard',
      description: 'Check your study progress and analytics',
      icon: BarChart3,
      href: '/dashboard',
      color: 'bg-blue-500',
    },
    {
      title: 'Add Study Session',
      description: 'Log a new study session',
      icon: BookOpen,
      href: '/add-session',
      color: 'bg-green-500',
    },
    {
      title: 'Start Pomodoro',
      description: 'Begin a focused study session',
      icon: Clock,
      href: '/pomodoro',
      color: 'bg-red-500',
    },
    {
      title: 'Learning Matrix',
      description: 'Explore subjects and plan your learning',
      icon: Target,
      href: '/learning-matrix',
      color: 'bg-purple-500',
    },
    {
      title: 'Study Logs',
      description: 'Review your study history',
      icon: TrendingUp,
      href: '/study-logs',
      color: 'bg-yellow-500',
    },
    {
      title: 'Study Recap',
      description: 'Weekly and monthly summaries',
      icon: Calendar,
      href: '/recap',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to continue your learning journey?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.href}>
                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Use the Pomodoro timer for focused study sessions</p>
              <p>• Log your study sessions to track progress over time</p>
              <p>• Check your dashboard regularly to monitor your learning trends</p>
              <p>• Use the Learning Matrix to plan and organize your subjects</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default HomePage;
