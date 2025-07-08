
import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KnownTechnologies from '@/components/LearningMatrix/KnownTechnologies';
import UnknownTechnologies from '@/components/LearningMatrix/UnknownTechnologies';

const LearningMatrixPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                Learning Matrix
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Organize and prioritize your learning journey
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Known Technologies
                  </h2>
                  <KnownTechnologies />
                </div>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Technologies to Learn
                  </h2>
                  <UnknownTechnologies viewMode="overview" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="planning" className="space-y-6">
              <UnknownTechnologies viewMode="full" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LearningMatrixPage;
