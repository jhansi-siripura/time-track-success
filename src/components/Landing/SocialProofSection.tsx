
import React from 'react';
import { Star, Users, BookOpen, TrendingUp } from 'lucide-react';

const SocialProofSection = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Student',
      avatar: '👩‍💻',
      content: 'This app completely transformed how I approach studying. The analytics helped me identify my most productive hours and optimize my schedule.',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Medical Student',
      avatar: '👨‍⚕️',
      content: 'The goal tracking feature keeps me accountable. I\'ve increased my study efficiency by 40% since I started using Study Tracker.',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'MBA Candidate',
      avatar: '👩‍🎓',
      content: 'Love how I can track multiple subjects and see detailed breakdowns. The recap feature helps me review what I\'ve learned effectively.',
      rating: 5
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Students' },
    { icon: BookOpen, value: '500K+', label: 'Study Sessions' },
    { icon: TrendingUp, value: '89%', label: 'Improved Grades' },
    { icon: Star, value: '4.9/5', label: 'User Rating' }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Trusted by Students Worldwide
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <div className="text-2xl mr-3">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
