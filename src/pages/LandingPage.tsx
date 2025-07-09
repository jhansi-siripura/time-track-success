import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, TrendingUp, Target, BarChart3, CheckCircle, Star, Clock, Trophy, Users, FileText, Brain, Mic, Video, Zap, Shield, Calendar, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'testimonials', label: 'Reviews' }
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Smart Analytics Dashboard',
      description: 'Comprehensive analytics showing study patterns, time distribution across subjects, and progress trends over weeks and months.',
      highlight: 'Real-time insights with 12-month trend analysis',
      image: '/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png'
    },
    {
      icon: Target,
      title: 'Intelligent Goal Tracking',
      description: 'Set daily study targets with AI-powered recommendations based on your historical performance and learning patterns.',
      highlight: 'Adaptive goals that evolve with your progress',
      image: '/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png'
    },
    {
      icon: FileText,
      title: 'Rich Session Logging',
      description: 'Capture detailed study sessions with subject categorization, duration tracking, achievements, and multimedia note attachments.',
      highlight: 'Support for images, notes, and structured topics',
      image: '/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png'
    },
    {
      icon: Brain,
      title: 'Learning Matrix System',
      description: 'Organize technologies and concepts by expertise level - from unknown to expert - with priority-based learning paths.',
      highlight: 'Visual knowledge mapping for career growth',
      image: '/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png'
    },
    {
      icon: Calendar,
      title: 'Spaced Repetition & Recap',
      description: 'Built-in revision system with calendar-based review scheduling to combat forgetting curve and ensure long-term retention.',
      highlight: 'Smart reminders for optimal memory retention',
      image: '/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png'
    },
    {
      icon: Clock,
      title: 'Pomodoro Timer Integration',
      description: 'Built-in focus timer with customizable work/break intervals, automatic session logging, and productivity tracking.',
      highlight: 'Seamlessly logs study time to your analytics',
      image: '/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png'
    },
    {
      icon: Mic,
      title: 'Voice & AI Note Taking',
      description: 'Convert speech to text for quick note capture during lectures or while reviewing concepts on the go.',
      highlight: 'Premium: AI-powered note organization and summarization',
      image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=500&h=300&fit=crop&crop=center'
    },
    {
      icon: Video,
      title: 'YouTube & Video Note Integration',
      description: 'Take timestamped notes while watching educational videos, with direct links back to specific video moments.',
      highlight: 'Premium: Automatic transcript extraction and key point identification',
      image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&h=300&fit=crop&crop=center'
    },
    {
      icon: TrendingUp,
      title: 'Progress Visualization',
      description: 'Beautiful charts showing weekly consistency, subject distribution, and learning velocity over time.',
      highlight: 'Gamified progress tracking with achievement badges',
      image: '/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png'
    }
  ];

  const benefits = [
    { icon: Clock, stat: '3+ Hours', label: 'Saved Weekly' },
    { icon: Trophy, stat: '40%', label: 'Better Results' },
    { icon: Users, stat: '10K+', label: 'Happy Learners' },
    { icon: Star, stat: '4.9/5', label: 'User Rating' }
  ];

  const steps = [
    {
      number: '01',
      title: 'Capture Your Learning',
      description: 'Log study sessions with subject, topic, duration, and rich notes. Attach images, voice memos, or video timestamps.',
      details: 'Supports multiple subjects simultaneously - perfect for professionals learning AWS, React, and Python in parallel',
      image: '/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png'
    },
    {
      number: '02',
      title: 'Organize & Prioritize',
      description: 'Use the Learning Matrix to categorize technologies by expertise level and priority for your career goals.',
      details: 'Visual knowledge mapping helps you focus on high-impact skills first',
      image: '/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png'
    },
    {
      number: '03',
      title: 'Analyze Your Patterns',
      description: 'View detailed analytics showing your most productive times, subject distribution, and consistency trends.',
      details: 'Data-driven insights help optimize your learning schedule and identify knowledge gaps',
      image: '/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png'
    },
    {
      number: '04',
      title: 'Review & Retain',
      description: 'Use spaced repetition calendar to review notes at optimal intervals, ensuring long-term retention.',
      details: 'Combat the forgetting curve with smart revision scheduling',
      image: '/lovable-uploads/6c52fde8-95d4-4721-9e52-91722cfa3c83.png'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer (Career Switcher)',
      content: 'This app helped me transition from marketing to tech. The Learning Matrix kept me focused on job-critical skills while the analytics showed my progress.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b332c1cd?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Medical Student',
      content: 'Managing multiple subjects was overwhelming until I found this. The spaced repetition feature is a game-changer for retaining complex information.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emily Watson',
      role: 'Working Professional',
      content: 'As a busy parent learning cloud computing, the Pomodoro integration and session logging help me make the most of my limited study time.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free Forever',
      price: '$0',
      period: 'Always Free',
      description: 'Perfect for getting started with essential learning tools',
      features: [
        'Unlimited study session logging',
        'Basic analytics dashboard',
        'Pomodoro timer with session tracking',
        'Learning Matrix (up to 20 technologies)',
        'Simple note-taking and image attachments',
        'Basic spaced repetition calendar',
        '500MB storage for notes and images',
        'Export data as CSV'
      ],
      limitations: [
        'No voice note-taking',
        'No AI-powered features',
        'No video integration',
        'Basic analytics only'
      ],
      buttonText: 'Start Free',
      popular: false
    },
    {
      name: 'Premium',
      price: '$8',
      period: 'per month',
      yearlyPrice: '$79',
      yearlyPeriod: 'per year (2 months free)',
      description: 'For serious learners who want advanced features and unlimited growth',
      features: [
        'Everything in Free, plus:',
        'AI-powered voice note-taking and transcription',
        'YouTube & video note integration with timestamps',
        'AI note summarization and organization',
        'Advanced analytics with 24-month history',
        'Unlimited Learning Matrix technologies',
        'Smart goal recommendations based on progress',
        '10GB storage per month',
        'Priority customer support',
        'Advanced export options (PDF, Notion, etc.)',
        'Team collaboration features (coming soon)'
      ],
      buttonText: 'Start 60-Day Free Trial',
      popular: true,
      highlight: 'Most Popular'
    }
  ];

  const targetAudience = [
    {
      icon: Users,
      title: 'Working Professionals',
      description: 'Reskilling in new technologies while managing a full-time job',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      icon: BookOpen,
      title: 'Students & Freshers',
      description: 'Managing multiple subjects and preparing for interviews',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face'
    },
    {
      icon: Brain,
      title: 'Lifelong Learners',
      description: 'Anyone from age 16 to 65+ committed to continuous learning',
      image: 'https://images.unsplash.com/photo-1582750433449-6ca0a78fb36b?w=150&h=150&fit=crop&crop=face'
    },
    {
      icon: Zap,
      title: 'Career Switchers',
      description: 'Transitioning careers and need structured learning approach',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
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
                  Everything You Need to Master Any Subject
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Built for the modern learner juggling multiple technologies, subjects, and career goals
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-[#E7BA40] hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="relative mb-4 rounded-xl overflow-hidden">
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 w-12 h-12 rounded-xl bg-[#E7BA40] flex items-center justify-center shadow-lg">
                          <Icon className="h-6 w-6 text-[#6B3F1D]" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-3">{feature.description}</p>
                      <div className="text-sm font-medium text-[#6B3F1D] bg-[#E7BA40]/10 px-3 py-1 rounded-full">
                        {feature.highlight}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Target Audience Section */}
              <div className="bg-gradient-to-br from-gray-50 to-[#E7BA40]/5 rounded-3xl p-8 mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Who This App Is For</h3>
                <p className="text-gray-600 text-center mb-8 max-w-4xl mx-auto text-lg leading-relaxed">
                  Though we use the word "student," this isn't just for school kids. We are ALL students today — whether you're a CEO understanding your team's tech stack or a retiree learning digital tools. From age 16 to 65+, learning is part of everyone's life.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {targetAudience.map((audience, index) => {
                    const Icon = audience.icon;
                    return (
                      <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="relative mb-4">
                          <img 
                            src={audience.image} 
                            alt={audience.title}
                            className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-[#E7BA40]/20"
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#E7BA40] flex items-center justify-center">
                            <Icon className="h-4 w-4 text-[#6B3F1D]" />
                          </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{audience.title}</h4>
                        <p className="text-sm text-gray-600">{audience.description}</p>
                      </div>
                    );
                  })}
                </div>
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
                  From Overwhelmed to Organized
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Built to solve real problems: forgetting what you learned, losing track of parallel subjects, and lack of systematic revision
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 mb-16">
                {steps.map((step, index) => (
                  <div key={index} className="relative group">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="bg-[#E7BA40] w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-2xl font-bold text-[#6B3F1D] shadow-lg">
                          {step.number}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>
                        <div className="text-sm text-[#6B3F1D] bg-[#E7BA40]/10 px-3 py-2 rounded-lg mb-4">
                          {step.details}
                        </div>
                        <div className="rounded-xl overflow-hidden shadow-lg">
                          <img 
                            src={step.image} 
                            alt={step.title}
                            className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pain Points Section */}
              <div className="bg-gradient-to-r from-[#E7BA40]/10 to-[#F4C842]/10 rounded-3xl p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">The Problems We Solve</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Information Overload</h4>
                        <p className="text-gray-600">It's not enough to know "AWS" — you need Lambda, S3, ECS, and more. Tech evolves fast, making it easy to lose track.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Forgetting What You Learned</h4>
                        <p className="text-gray-600">Without a revision system, even well-understood concepts fade from memory over time.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Parallel Subject Chaos</h4>
                        <p className="text-gray-600">Learning multiple subjects simultaneously makes traditional note-taking ineffective.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">No Strategic Learning Path</h4>
                        <p className="text-gray-600">Without prioritization, you end up learning nice-to-know skills instead of job-critical ones.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'pricing':
        return (
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Choose Your Learning Journey
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Start free and upgrade when you're ready for advanced features. No credit card required for free plan.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {pricingPlans.map((plan, index) => (
                  <div key={index} className={`relative p-8 rounded-3xl border-2 transition-all duration-300 ${
                    plan.popular 
                      ? 'border-[#E7BA40] shadow-2xl scale-105 bg-gradient-to-br from-white to-[#E7BA40]/5' 
                      : 'border-gray-200 hover:border-[#E7BA40]/50 hover:shadow-lg'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#E7BA40] to-[#F4C842] text-[#6B3F1D] px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {plan.highlight}
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mb-2">
                        <span className="text-5xl font-bold text-[#6B3F1D]">{plan.price}</span>
                        <span className="text-gray-600 ml-2 text-lg">{plan.period}</span>
                      </div>
                      {plan.yearlyPrice && (
                        <div className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                          or <span className="font-semibold text-green-700">{plan.yearlyPrice}</span> {plan.yearlyPeriod}
                        </div>
                      )}
                      <p className="text-gray-600 mt-4 text-lg">{plan.description}</p>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          What's Included
                        </h4>
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3 text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {plan.limitations && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Limitations
                          </h4>
                          <ul className="space-y-2">
                            {plan.limitations.map((limitation, limitIndex) => (
                              <li key={limitIndex} className="flex items-start gap-3 text-gray-500">
                                <div className="w-4 h-4 border border-gray-300 rounded mt-0.5 flex-shrink-0"></div>
                                <span className="text-sm">{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <Link to="/auth" className="block">
                      <Button 
                        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-[#6B3F1D] to-[#8B5A2B] text-white hover:shadow-xl transform hover:-translate-y-1'
                            : 'bg-white border-2 border-[#6B3F1D] text-[#6B3F1D] hover:bg-[#6B3F1D] hover:text-white'
                        }`}
                      >
                        {plan.buttonText}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>

                    {plan.popular && (
                      <div className="text-center mt-4 text-sm text-gray-600">
                        <Shield className="h-4 w-4 inline mr-1" />
                        60-day money-back guarantee
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center mt-12 p-8 bg-gradient-to-r from-gray-50 to-[#E7BA40]/10 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Not Sure Which Plan?</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Start with our free plan and upgrade anytime. Your data and progress carry over seamlessly.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No credit card required for free plan</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Upgrade or downgrade anytime</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Export your data anytime</span>
                  </div>
                </div>
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
                  Loved by Learners Worldwide
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="text-center group">
                        <div className="bg-gradient-to-r from-[#E7BA40] to-[#F4C842] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Icon className="h-10 w-10 text-[#6B3F1D]" />
                        </div>
                        <div className="text-4xl font-bold text-[#6B3F1D] mb-2">{benefit.stat}</div>
                        <div className="text-gray-600 font-medium">{benefit.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-[#E7BA40] fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic leading-relaxed text-lg">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#E7BA40]/30"
                      />
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
                  Join thousands of learners who have already revolutionized their learning experience
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
