
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, TrendingUp, Target, BarChart3, CheckCircle, Star, Clock, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'testimonials', label: 'Reviews' }
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Visualize your study patterns with beautiful charts and insights that help you optimize your learning.'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set meaningful study goals and track your progress with intelligent recommendations.'
    },
    {
      icon: BookOpen,
      title: 'Session Logging',
      description: 'Record detailed study sessions with notes, achievements, and duration tracking.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Trends',
      description: 'Monitor your improvement over time with comprehensive trend analysis.'
    }
  ];

  const benefits = [
    { icon: Clock, stat: '3+ Hours', label: 'Saved Weekly' },
    { icon: Trophy, stat: '40%', label: 'Better Results' },
    { icon: Users, stat: '10K+', label: 'Happy Students' },
    { icon: Star, stat: '4.9/5', label: 'User Rating' }
  ];

  const steps = [
    {
      number: '01',
      title: 'Log Sessions',
      description: 'Record your study sessions with subject, duration, and notes'
    },
    {
      number: '02',
      title: 'Track Progress',
      description: 'View analytics and insights about your study patterns'
    },
    {
      number: '03',
      title: 'Achieve Goals',
      description: 'Set targets and celebrate your learning milestones'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Student',
      content: 'This app transformed how I study. The analytics helped me find my most productive hours.',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Medical Student',
      content: 'Goal tracking keeps me accountable. I increased my study efficiency by 40%.',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'MBA Candidate',
      content: 'Love the detailed breakdowns and recap feature. It helps me review effectively.',
      rating: 5
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'features':
        return (
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Everything You Need to Excel
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Comprehensive tools designed to help you track, analyze, and optimize your study habits
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-[#E7BA40] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 rounded-xl bg-[#E7BA40] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-[#6B3F1D]" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      case 'how-it-works':
        return (
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Simple 3-Step Process
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get started in minutes and transform your study habits
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <div key={index} className="relative text-center group">
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-[#E7BA40] transform translate-x-4 z-0"></div>
                    )}
                    <div className="relative z-10">
                      <div className="bg-[#E7BA40] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 text-2xl font-bold text-[#6B3F1D]">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'testimonials':
        return (
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Loved by Students Worldwide
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  {benefits.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="bg-[#E7BA40] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-[#6B3F1D]" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{stat.stat}</div>
                        <div className="text-gray-600">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-[#E7BA40] fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      default:
        return (
          <>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#E7BA40] to-[#F4C842] py-20 px-4">
              <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                  <h1 className="text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight">
                    Master Your Study Journey
                  </h1>
                  <p className="text-xl text-[#1A1A1A]/80 mb-8 max-w-lg">
                    Track your sessions, analyze your progress, and achieve your academic goals with our intelligent study companion.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link to="/auth">
                      <Button size="lg" className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-[#6B3F1D] text-white hover:bg-[#6B3F1D]/90">
                        Start Free Today
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="px-8 py-4 rounded-full font-semibold text-lg border-[#6B3F1D] text-[#6B3F1D] hover:bg-[#6B3F1D] hover:text-white"
                      onClick={() => setActiveTab('features')}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <img 
                      src="/lovable-uploads/afe1a72a-7972-44d1-b818-6b69557e3396.png" 
                      alt="Student focused on studying at desk with books" 
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6B3F1D]/20 to-transparent"></div>
                  </div>
                  
                  {/* Floating Study Stats */}
                  <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg animate-bounce">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-800">Study Session Active</span>
                    </div>
                    <div className="text-2xl font-bold text-[#6B3F1D] mt-1">2h 15m</div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-4 w-4 text-[#E7BA40]" />
                      <span className="text-sm font-semibold text-gray-800">Daily Goal</span>
                    </div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-gradient-to-r from-[#E7BA40] to-[#6B3F1D] rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">4/5 hours completed</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Benefits */}
            <section className="py-16 px-4 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="text-center group">
                        <div className="bg-[#E7BA40] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-8 w-8 text-[#6B3F1D]" />
                        </div>
                        <div className="text-3xl font-bold text-[#6B3F1D] mb-2">{benefit.stat}</div>
                        <div className="text-gray-600">{benefit.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gray-50">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Ready to Transform Your Study Habits?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Join thousands of students who have already revolutionized their learning experience
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {['Free to get started', 'No credit card required', 'Full analytics dashboard'].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link to="/auth">
                  <Button size="lg" className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-[#6B3F1D] text-white hover:bg-[#6B3F1D]/90">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl py-[16px] px-[16px] mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E7BA40] to-[#F4C842] rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="h-6 w-6 text-[#6B3F1D]" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">Study Tracker</span>
                <div className="text-xs text-amber-700/70 font-medium -mt-1">Your Learning Companion</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex space-x-8">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === item.id
                      ? 'text-[#6B3F1D] bg-[#E7BA40]/20'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex gap-3">
              <Link to="/auth">
                <Button variant="outline" className="border-[#6B3F1D] text-[#6B3F1D] hover:bg-[#6B3F1D] hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-[#6B3F1D] text-white hover:bg-[#6B3F1D]/90">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden mt-4 flex space-x-1 overflow-x-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === item.id
                    ? 'text-[#6B3F1D] bg-[#E7BA40]/20'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default LandingPage;
