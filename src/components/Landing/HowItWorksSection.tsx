
import React from 'react';
import { Plus, BarChart3, Target, TrendingUp } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Plus,
      title: 'Log Your Sessions',
      description: 'Quickly record study sessions with subject, duration, notes, and achievements',
      step: '01'
    },
    {
      icon: BarChart3,
      title: 'Analyze Your Data',
      description: 'View detailed analytics and insights about your study patterns and progress',
      step: '02'
    },
    {
      icon: Target,
      title: 'Set Smart Goals',
      description: 'Create achievable study goals based on your historical performance data',
      step: '03'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement over time and celebrate your achievements',
      step: '04'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in minutes and transform your study habits with our simple 4-step process
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center group">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform translate-x-4 z-0"></div>
                )}
                
                <div className="relative z-10">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
