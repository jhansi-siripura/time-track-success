
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
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Learning Matrix</h1>
          <p className="text-muted-foreground">
            Organize and prioritize your learning journey with known and unknown subjects
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Known Subjects Section */}
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                Known Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <KnownTechnologies />
            </CardContent>
          </Card>

          {/* Unknown Subjects Section */}
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                Learning Priorities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UnknownTechnologies />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default LearningMatrixPage;
