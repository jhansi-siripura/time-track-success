
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowRight, BookOpen, TrendingUp, Target, BarChart3, FileText, CheckSquare, Star, Users, Clock, Trophy, Brain, Zap, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/20 via-background to-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Master Your
                  <span className="text-primary block">
                    Study Journey
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Track. Reflect. Grow.
                </p>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Organize your study sessions, monitor your progress, and achieve your academic goals with our powerful study tracking tool.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/auth">
                  <Button size="lg" className="px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Tracking Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Track Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Analyze Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Achieve Goals</span>
                </div>
              </div>
            </div>

            {/* Right Column - Study Image */}
            <div className="relative">
              <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png"
                  alt="Student studying"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-12 bg-muted">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="why-this-app">Why This App</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-16">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
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
                      <div key={index} className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group">
                        <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div className="mb-4">
                          <div className="text-3xl font-bold text-primary">{benefit.stat}</div>
                          <div className="text-sm text-muted-foreground">{benefit.label}</div>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Everything You Need to Excel
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                    <div key={index} className="group p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Why This App Tab */}
            <TabsContent value="why-this-app" className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  How It Works
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                        <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-primary/30 transform translate-x-4 z-0"></div>
                      )}
                      <div className="relative z-10">
                        <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
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
                        <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-muted-foreground">{stat.label}</div>
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
                  <div key={index} className="bg-muted p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-primary fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to Transform Your Study Habits?
                </h2>
                <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
                  Join thousands of students who have already revolutionized their learning experience
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {['Free to get started', 'No credit card required', 'Full analytics dashboard', 'Unlimited study sessions', 'Mobile-friendly design'].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link to="/auth">
                    <Button size="lg" className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                      Start Your Journey Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">
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
