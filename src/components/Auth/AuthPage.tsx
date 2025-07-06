
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, BookOpen, BarChart3, Target, ArrowLeft, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Signed in successfully!",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to confirm your account.",
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setResetLoading(false);

    if (error) {
      toast({
        title: "Password Reset Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for password reset instructions.",
      });
      setShowForgotPassword(false);
      setResetEmail('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E7BA40] via-[#F5F2E7] to-white flex items-center justify-center px-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E7BA40]/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#6B3F1D]/15 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <Card className="backdrop-blur-sm bg-white/95 border border-[#E7BA40]/20 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 w-12 h-12 bg-[#E7BA40] rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-[#6B3F1D]" />
              </div>
              <CardTitle className="text-2xl text-[#6B3F1D] font-bold">
                Reset Password
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your email to receive password reset instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium text-[#6B3F1D]">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="h-12 border-[#E7BA40]/30 focus:border-[#E7BA40] focus:ring-[#E7BA40]/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#E7BA40] hover:bg-[#E7BA40]/90 text-[#6B3F1D] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Email'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12 border-[#6B3F1D]/20 text-[#6B3F1D] hover:bg-[#6B3F1D]/5" 
                  onClick={() => setShowForgotPassword(false)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7BA40] via-[#F5F2E7] to-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E7BA40]/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#6B3F1D]/15 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#E7BA40]/10 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/landing" className="flex items-center space-x-2 text-[#6B3F1D] hover:text-[#6B3F1D]/80 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#E7BA40] rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-[#6B3F1D]" />
            </div>
            <span className="text-2xl font-bold text-[#6B3F1D]">Study Tracker</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Marketing content */}
          <div className="hidden lg:block space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#6B3F1D] mb-4">
                Welcome to Your Study Journey
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed">
                Join thousands of students who have transformed their study habits and achieved academic success with our intelligent tracking system.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#E7BA40] rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-[#6B3F1D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#6B3F1D] text-lg">Smart Analytics</h3>
                  <p className="text-gray-600">Monitor your study sessions and see your improvement over time with beautiful visualizations</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#E7BA40] rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-[#6B3F1D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#6B3F1D] text-lg">Goal Setting</h3>
                  <p className="text-gray-600">Create study plans and achieve your academic targets with intelligent recommendations</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#E7BA40] rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#6B3F1D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#6B3F1D] text-lg">Progress Tracking</h3>
                  <p className="text-gray-600">Keep all your study materials organized and track your learning journey effectively</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#E7BA40]/20 shadow-lg">
              <p className="text-gray-700 italic mb-4">
                "This app transformed how I study. The analytics helped me find my most productive hours and I increased my efficiency by 40%!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#E7BA40] rounded-full flex items-center justify-center">
                  <span className="text-[#6B3F1D] font-semibold text-sm">SC</span>
                </div>
                <div>
                  <div className="font-semibold text-[#6B3F1D]">Sarah Chen</div>
                  <div className="text-gray-600 text-sm">Computer Science Student</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth form */}
          <div className="w-full">
            <Card className="backdrop-blur-sm bg-white/95 border border-[#E7BA40]/20 shadow-2xl">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 w-12 h-12 bg-[#E7BA40] rounded-full flex items-center justify-center lg:hidden">
                  <BookOpen className="h-6 w-6 text-[#6B3F1D]" />
                </div>
                <CardTitle className="text-2xl text-[#6B3F1D] font-bold">
                  Study Tracker
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Track your study sessions and achieve your goals
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#F5F2E7]">
                    <TabsTrigger 
                      value="signin" 
                      className="data-[state=active]:bg-[#E7BA40] data-[state=active]:text-[#6B3F1D] data-[state=active]:shadow-sm font-medium"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      className="data-[state=active]:bg-[#E7BA40] data-[state=active]:text-[#6B3F1D] data-[state=active]:shadow-sm font-medium"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-sm font-medium text-[#6B3F1D]">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 border-[#E7BA40]/30 focus:border-[#E7BA40] focus:ring-[#E7BA40]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-sm font-medium text-[#6B3F1D]">Password</Label>
                        <div className="relative">
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 pr-12 border-[#E7BA40]/30 focus:border-[#E7BA40] focus:ring-[#E7BA40]/20"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#6B3F1D]"
                            title={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-[#6B3F1D] hover:text-[#6B3F1D]/80 hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-[#E7BA40] hover:bg-[#E7BA40]/90 text-[#6B3F1D] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                        disabled={loading}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-sm font-medium text-[#6B3F1D]">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 border-[#E7BA40]/30 focus:border-[#E7BA40] focus:ring-[#E7BA40]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium text-[#6B3F1D]">Password</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 pr-12 border-[#E7BA40]/30 focus:border-[#E7BA40] focus:ring-[#E7BA40]/20"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#6B3F1D]"
                            title={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-[#E7BA40] hover:bg-[#E7BA40]/90 text-[#6B3F1D] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
