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
  return <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Your Study Journey Starts Here
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Track your study sessions, manage your learning goals, and monitor your progress on your educational journey with powerful analytics and insights.
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {navigationCards.map(card => {
          const Icon = card.icon;
          return <Link key={card.path} to={card.path} className="group">
                <Card className="bg-card border-border hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer h-full">
                  <CardHeader className="text-center pb-4 p-4 sm:p-6">
                    <div className={`mx-auto mb-3 sm:mb-4 p-3 sm:p-4 rounded-xl ${card.iconBg} w-fit shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105`}>
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <CardDescription className="text-center text-muted-foreground text-sm leading-relaxed">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>;
        })}
        </div>

        {/* Call to Action Section */}
        <div className="text-center">
          <Card className="bg-card border-border shadow-sm max-w-4xl mx-auto">
            <CardContent className="p-6 sm:p-8">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-sm">
                  <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-primary-foreground" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-3 sm:mb-4">Ready to Start Learning?</h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
                Begin by setting up your study plan or log your first study session to track your progress and unlock powerful insights into your learning journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link to="/study-plan" className="inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] text-sm sm:text-base">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Set Your Plan</span>
                </Link>
                <Link to="/add-session" className="inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:opacity-90 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] text-sm sm:text-base">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
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