
import React from 'react';
import StudySummaryWidget from '@/components/Dashboard/StudySummaryWidget';
import DailyTargetWidget from '@/components/Dashboard/DailyTargetWidget';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FeatureDeepDive = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the actual components that power thousands of successful study sessions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Live Dashboard Widgets */}
          <div className="space-y-6">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <StudySummaryWidget 
                totalSessions={47}
                totalHours={128.5}
                totalSubjects={6}
              />
            </div>
            
            <div className="transform hover:scale-105 transition-transform duration-300">
              <DailyTargetWidget
                avg21Days={3.2}
                avg7Days={4.1}
                yesterdayHours={3.8}
                todayHours={4.5}
              />
            </div>
          </div>

          {/* Right - Feature Description */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Real-Time Analytics Dashboard
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Get instant insights into your study habits with our comprehensive dashboard. 
                Track your progress, monitor trends, and stay motivated with intelligent goal tracking.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Smart Goal Recommendations</h4>
                  <p className="text-gray-600">AI-powered suggestions based on your study patterns</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Progress Visualization</h4>
                  <p className="text-gray-600">Beautiful charts that make your data easy to understand</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Achievement Tracking</h4>
                  <p className="text-gray-600">Celebrate milestones and maintain motivation</p>
                </div>
              </div>
            </div>

            {/* Sample Recap Card */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Rich Study Notes</h4>
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm text-gray-600 font-medium">
                      22-Jun-2025 2 PM
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-100 text-blue-800">Mathematics</Badge>
                      <Badge variant="outline" className="bg-gray-50">Calculus</Badge>
                    </div>
                  </div>
                  <div className="text-gray-700">
                    <p>Completed integration by parts practice problems. The key insight was recognizing the pattern in the LIATE rule...</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded border border-gray-200"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded border border-gray-200"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureDeepDive;
