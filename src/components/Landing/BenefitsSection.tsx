
import React from 'react';
import { Clock, Trophy, Brain, Zap } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Save 3+ Hours Weekly',
      description: 'Streamlined tracking eliminates manual planning and reduces study session overhead',
      stat: '3+ hrs',
      statLabel: 'Time Saved'
    },
    {
      icon: Trophy,
      title: 'Boost Success Rate',
      description: 'Data-driven insights help you identify what works and optimize your study methods',
      stat: '40%',
      statLabel: 'Better Results'
    },
    {
      icon: Brain,
      title: 'Enhance Retention',
      description: 'Spaced repetition and progress tracking improve long-term knowledge retention',
      stat: '60%',
      statLabel: 'Better Retention'
    },
    {
      icon: Zap,
      title: 'Stay Motivated',
      description: 'Visual progress tracking and achievement systems keep you engaged and focused',
      stat: '85%',
      statLabel: 'More Motivated'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transform Your Study Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students who have revolutionized their learning with our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-blue-600">{benefit.stat}</div>
                  <div className="text-sm text-gray-500">{benefit.statLabel}</div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
