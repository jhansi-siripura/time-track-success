import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BarChart3, FileText, Plus, Target, Calendar, Timer, Sparkles } from 'lucide-react';
const HomePage = () => {
  const navigationCards = [{
    title: 'Dashboard',
    description: 'View your study analytics and progress',
    icon: BarChart3,
    path: '/dashboard',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-white',
    borderColor: 'border-gray-200',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600'
  }, {
    title: 'Pomodoro Timer',
    description: 'Focus with timed study sessions',
    icon: Timer,
    path: '/pomodoro',
    gradient: 'from-red-500 to-red-600',
    bgColor: 'bg-white',
    borderColor: 'border-gray-200',
    iconBg: 'bg-gradient-to-br from-red-500 to-red-600'
  }, {
    title: 'Add Study Session',
    description: 'Log a new study session',
    icon: Plus,
    path: '/add-session',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-white',
    borderColor: 'border-gray-200',
    iconBg: 'bg-gradient-to-br from-green-500 to-green-600'
  }, {
    title: 'View Study Logs',
    description: 'Browse and manage all your study sessions',
    icon: FileText,
    path: '/study-logs',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-white',
    borderColor: 'border-gray-200',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600'
  }, {
    title: 'Study Plan',
    description: 'Manage your learning goals and subjects',
    icon: Target,
    path: '/study-plan',
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-white',
    borderColor: 'border-gray-200',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600'
  }, {
    title: 'Recap',
    description: 'Review and edit your daily study sessions',
    icon: Calendar,
    path: '/recap',
    gradient: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-white',
    borderColor: 'border-gray-200',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
  }];
  return <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8 bg-white">
        {/* Hero Section */}
        <div className="text-center mb-12">
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Track your study sessions, manage your learning goals, and monitor your progress on your educational journey with powerful analytics and insights.
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {navigationCards.map(card => {
          const Icon = card.icon;
          return <Link key={card.path} to={card.path} className="group">
                <Card className={`${card.bgColor} ${card.borderColor} border shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer h-full backdrop-blur-sm`}>
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto mb-4 p-4 rounded-2xl ${card.iconBg} w-fit shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600 text-sm leading-relaxed">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>;
        })}
        </div>

        {/* Call to Action Section */}
        <div className="text-center">
          <Card className="bg-white border border-gray-200 shadow-sm max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-lg">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">Ready to Start Learning?</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                Begin by setting up your study plan or log your first study session to track your progress and unlock powerful insights into your learning journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/study-plan" className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Target className="h-5 w-5" />
                  <span>Set Your Plan</span>
                </Link>
                <Link to="/add-session" className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Plus className="h-5 w-5" />
                  <span>Log Study Session</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default HomePage;