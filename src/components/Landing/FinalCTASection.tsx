
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinalCTASection = () => {
  const features = [
    'Free to get started',
    'No credit card required',
    'Full analytics dashboard',
    'Unlimited study sessions',
    'Mobile-friendly design'
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Transform Your Study Habits?
        </h2>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Join thousands of students who have already revolutionized their learning experience
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Start Your Journey Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <p className="text-sm opacity-75">
          Start tracking your study sessions in under 2 minutes. No setup required.
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/5 to-transparent"></div>
    </section>
  );
};

export default FinalCTASection;
