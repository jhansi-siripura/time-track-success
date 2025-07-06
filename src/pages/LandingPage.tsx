
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowRight, BookOpen, TrendingUp, Target, BarChart3, FileText, CheckSquare, Star, Users, Clock, Trophy, Brain, Zap, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F2E7]">
      {/* Header */}
      <header className="bg-[#E7BA40] px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-[#1A1A1A]">
            Study Tracker
          </div>
          <div className="flex gap-3">
            <Link to="/auth">
              <Button variant="outline" className="border-[#6B3F1D] text-[#6B3F1D] hover:bg-[#6B3F1D] hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-[#6B3F1D] text-white hover:bg-[#6B3F1D]/90">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#E7BA40] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-full max-w-md mx-auto mb-8">
              <img 
                src="/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png"
                alt="Student studying at desk"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-[#1A1A1A] mb-4">
            Master Your Study Journey
          </h1>
          
          <p className="text-xl md:text-2xl text-[#1A1A1A] mb-8">
            Track. Reflect. Grow.
          </p>
        </div>
      </section>

      {/* Tab Navigation and Content */}
      <section className="bg-[#F5F2E7] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 bg-white border border-[#6B3F1D]/20 p-1 rounded-lg">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-[#E7BA40] data-[state=active]:text-[#1A1A1A] text-[#6B3F1D] px-4 py-2 text-sm md:text-base"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="features" 
                  className="data-[state=active]:bg-[#E7BA40] data-[state=active]:text-[#1A1A1A] text-[#6B3F1D] px-4 py-2 text-sm md:text-base"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger 
                  value="why-this-app" 
                  className="data-[state=active]:bg-[#E7BA40] data-[state=active]:text-[#1A1A1A] text-[#6B3F1D] px-4 py-2 text-sm md:text-base"
                >
                  Why This App
                </TabsTrigger>
                <TabsTrigger 
                  value="testimonials" 
                  className="data-[state=active]:bg-[#E7BA40] data-[state=active]:text-[#1A1A1A] text-[#6B3F1D] px-4 py-2 text-sm md:text-base"
                >
                  Testimonials
                </TabsTrigger>
                <TabsTrigger 
                  value="progress" 
                  className="data-[state=active]:bg-[#E7BA40] data-[state=active]:text-[#1A1A1A] text-[#6B3F1D] px-4 py-2 text-sm md:text-base"
                >
                  Progress
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-16">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8">
                  Transform Your Study Experience
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { icon: Clock, title: 'Save 3+ Hours Weekly', stat: '3+ hrs', label: 'Time Saved' },
                    { icon: Trophy, title: 'Boost Success Rate', stat: '40%', label: 'Better Results' },
                    { icon: Brain, title: 'Enhance Retention', stat: '60%', label: 'Better Retention' },
                    { icon: Zap, title: 'Stay Motivated', stat: '85%', label: 'More Motivated' }
                  ].map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group border border-[#6B3F1D]/10">
                        <div className="bg-[#E7BA40] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-8 w-8 text-[#6B3F1D]" />
                        </div>
                        <div className="mb-4">
                          <div className="text-3xl font-bold text-[#6B3F1D]">{benefit.stat}</div>
                          <div className="text-sm text-[#1A1A1A]/70">{benefit.label}</div>
                        </div>
                        <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{benefit.title}</h3>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                  Everything You Need to Excel
                </h2>
                <p className="text-xl text-[#1A1A1A]/70 max-w-3xl mx-auto">
                  Comprehensive tools designed to help you track, analyze, and optimize your study habits
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { icon: BarChart3, title: 'Smart Analytics', description: 'Visualize your study patterns with detailed charts and insights' },
                  { icon: FileText, title: 'Session Tracking', description: 'Log detailed study sessions with notes, images, and achievements' },
                  { icon: Target, title: 'Goal Setting', description: 'Set and track study goals with intelligent recommendations' },
                  { icon: CheckSquare, title: 'Task Management', description: 'Organize your study tasks and track completion progress' },
                  { icon: BookOpen, title: 'Study Recap', description: 'Review and reflect on your learning journey with rich notes' },
                  { icon: TrendingUp, title: 'Progress Trends', description: 'Monitor your improvement over time with trend analysis' }
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="group p-6 rounded-2xl bg-white border border-[#6B3F1D]/10 hover:border-[#E7BA40] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 rounded-xl bg-[#E7BA40] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-[#6B3F1D]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{feature.title}</h3>
                      <p className="text-[#1A1A1A]/70 leading-relaxed">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Why This App Tab */}
            <TabsContent value="why-this-app" className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                  How It Works
                </h2>
                <p className="text-xl text-[#1A1A1A]/70 max-w-3xl mx-auto">
                  Get started in minutes and transform your study habits with our simple 4-step process
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: Plus, title: 'Log Your Sessions', description: 'Quickly record study sessions with subject, duration, notes, and achievements', step: '01' },
                  { icon: BarChart3, title: 'Analyze Your Data', description: 'View detailed analytics and insights about your study patterns and progress', step: '02' },
                  { icon: Target, title: 'Set Smart Goals', description: 'Create achievable study goals based on your historical performance data', step: '03' },
                  { icon: TrendingUp, title: 'Track Progress', description: 'Monitor your improvement over time and celebrate your achievements', step: '04' }
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="relative text-center group">
                      {index < 3 && (
                        <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-[#E7BA40] transform translate-x-4 z-0"></div>
                      )}
                      <div className="relative z-10">
                        <div className="bg-[#E7BA40] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-8 w-8 text-[#6B3F1D]" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-[#6B3F1D] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2 mt-4">{step.title}</h3>
                      <p className="text-[#1A1A1A]/70 leading-relaxed">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-8">
                  Trusted by Students Worldwide
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  {[
                    { icon: Users, value: '10,000+', label: 'Active Students' },
                    { icon: BookOpen, value: '500K+', label: 'Study Sessions' },
                    { icon: TrendingUp, value: '89%', label: 'Improved Grades' },
                    { icon: Star, value: '4.9/5', label: 'User Rating' }
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="bg-[#E7BA40] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-[#6B3F1D]" />
                        </div>
                        <div className="text-3xl font-bold text-[#1A1A1A]">{stat.value}</div>
                        <div className="text-[#1A1A1A]/70">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: 'Sarah Chen', role: 'Computer Science Student', avatar: '👩‍💻', content: 'This app completely transformed how I approach studying. The analytics helped me identify my most productive hours and optimize my schedule.', rating: 5 },
                  { name: 'Marcus Rodriguez', role: 'Medical Student', avatar: '👨‍⚕️', content: 'The goal tracking feature keeps me accountable. I\'ve increased my study efficiency by 40% since I started using Study Tracker.', rating: 5 },
                  { name: 'Emily Watson', role: 'MBA Candidate', avatar: '👩‍🎓', content: 'Love how I can track multiple subjects and see detailed breakdowns. The recap feature helps me review what I\'ve learned effectively.', rating: 5 }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300 border border-[#6B3F1D]/10">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-[#E7BA40] fill-current" />
                      ))}
                    </div>
                    <p className="text-[#1A1A1A]/70 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-[#1A1A1A]">{testimonial.name}</div>
                        <div className="text-[#1A1A1A]/70 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                  Ready to Transform Your Study Habits?
                </h2>
                <p className="text-xl md:text-2xl mb-8 text-[#1A1A1A]/70">
                  Join thousands of students who have already revolutionized their learning experience
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {['Free to get started', 'No credit card required', 'Full analytics dashboard', 'Unlimited study sessions', 'Mobile-friendly design'].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#6B3F1D]/20">
                      <Target className="h-5 w-5 text-[#6B3F1D]" />
                      <span className="text-[#1A1A1A]">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link to="/auth">
                    <Button size="lg" className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-[#6B3F1D] text-white hover:bg-[#6B3F1D]/90">
                      Start Your Journey Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-[#1A1A1A]/70">
                  Start tracking your study sessions in under 2 minutes. No setup required.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
