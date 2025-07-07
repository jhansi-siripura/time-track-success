
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BarChart3, FileText, Plus, Target, Calendar, Timer, Sparkles } from 'lucide-react';

const HomePage = () => {
  const navigationCards = [
    {
      title: 'Dashboard',
      description: 'View your study analytics and progress',
      icon: BarChart3,
      path: '/dashboard',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-500'
    },
    {
      title: 'Pomodoro Timer',
      description: 'Focus with timed study sessions',
      icon: Timer,
      path: '/pomodoro',
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-500'
    },
    {
      title: 'Add Study Session',
      description: 'Log a new study session',
      icon: Plus,
      path: '/add-session',
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-500'
    },
    {
      title: 'View Study Logs',
      description: 'Browse and manage all your study sessions',
      icon: FileText,
      path: '/study-logs',
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-500'
    },
    {
      title: 'Study Plan',
      description: 'Manage your learning goals and subjects',
      icon: Target,
      path: '/study-plan',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-500'
    },
    {
      title: 'Recap',
      description: 'Review and edit your daily study sessions',
      icon: Calendar,
      path: '/recap',
      gradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      iconBg: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 to-yellow-200/20 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-amber-500 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Welcome to Study Tracker
              </h1>
              <Sparkles className="h-8 w-8 text-amber-500 ml-3" />
            </div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Track your study sessions, manage your learning goals, and monitor your progress on your educational journey with powerful analytics and insights.
            </p>
          </div>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.path} to={card.path} className="group">
                <Card className={`${card.bgColor} ${card.borderColor} border-2 hover:shadow-xl hover:shadow-amber-200/50 transition-all duration-300 transform hover:scale-105 cursor-pointer h-full relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="text-center pb-4 relative z-10">
                    <div className={`mx-auto mb-4 p-4 rounded-2xl ${card.iconBg} w-fit shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-center text-gray-600 text-sm leading-relaxed">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Call to Action Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-200 shadow-xl shadow-amber-200/30 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-lg">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Ready to Start Learning?</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                Begin by setting up your study plan or log your first study session to track your progress and unlock powerful insights into your learning journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/study-plan"
                  className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Target className="h-5 w-5" />
                  <span>Set Your Plan</span>
                </Link>
                <Link 
                  to="/add-session"
                  className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  <span>Log Study Session</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
