
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BarChart3, FileText, Plus, Target } from 'lucide-react';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';

const HomePage = () => {
  const navigationCards = [
    {
      title: 'Dashboard',
      description: 'View your study analytics and progress',
      icon: BarChart3,
      path: '/dashboard',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Study Plan',
      description: 'Manage your learning goals, subjects, and courses',
      icon: Target,
      path: '/study-plan',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Add Study Session',
      description: 'Log a new study session',
      icon: Plus,
      path: '/add-session',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      title: 'View Study Logs',
      description: 'Browse and manage all your study sessions',
      icon: FileText,
      path: '/study-logs',
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Study Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your study sessions, manage your learning goals, and monitor your progress on your educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.path} to={card.path}>
                <Card className={`${card.color} hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer h-full`}>
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-white w-fit">
                      <Icon className={`h-8 w-8 ${card.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600 text-sm">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to Start Learning?</h2>
            <p className="text-gray-600 mb-4">
              Begin by setting up your study plan or log your first study session to track your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/study-plan"
                className="inline-flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors font-medium"
              >
                <Target className="h-4 w-4" />
                <span>Set Your Plan</span>
              </Link>
              <Link 
                to="/add-session"
                className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Log Study Session</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default HomePage;
