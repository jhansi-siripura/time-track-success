
import React from 'react';
import { BarChart3, FileText, Target, CheckSquare, BookOpen, TrendingUp } from 'lucide-react';

const FeaturesShowcase = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Visualize your study patterns with detailed charts and insights',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: FileText,
      title: 'Session Tracking',
      description: 'Log detailed study sessions with notes, images, and achievements',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Set and track study goals with intelligent recommendations',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Organize your study tasks and track completion progress',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: BookOpen,
      title: 'Study Recap',
      description: 'Review and reflect on your learning journey with rich notes',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: TrendingUp,
      title: 'Progress Trends',
      description: 'Monitor your improvement over time with trend analysis',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50'
    }
   
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools designed to help you track, analyze, and optimize your study habits
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group p-6 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
