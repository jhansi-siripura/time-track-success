
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KnownTechnologies from '@/components/LearningMatrix/KnownTechnologies';
import UnknownTechnologies from '@/components/LearningMatrix/UnknownTechnologies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target } from 'lucide-react';

const LearningMatrixPage = () => {
  return (
    <MainLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Matrix</h1>
          <p className="text-gray-600">
            Organize and prioritize your learning journey with known and unknown subjects
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Known Subjects Section */}
          <Card className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200 h-fit">
            <CardHeader className="pb-4 bg-white border-b border-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                <div className="p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <BookOpen className="w-5 w-5 text-green-600" />
                </div>
                Known Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-6">
              <KnownTechnologies />
            </CardContent>
          </Card>

          {/* Unknown Subjects Section */}
          <Card className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200 h-fit">
            <CardHeader className="pb-4 bg-white border-b border-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                Learning Priorities
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-6">
              <UnknownTechnologies />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default LearningMatrixPage;
