
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Lightbulb, Star, MoreHorizontal } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import TechnologyCard from './TechnologyCard';

type LearningMatrixUnknown = Database['public']['Tables']['learning_matrix_unknown']['Row'];

interface UnknownTechQuadrantsProps {
  technologies: LearningMatrixUnknown[];
  onUpdate: () => void;
}

const UnknownTechQuadrants: React.FC<UnknownTechQuadrantsProps> = ({ technologies, onUpdate }) => {
  const getQuadrantData = (priority: string) => {
    return technologies.filter(tech => tech.priority_category === priority);
  };

  const quadrants = [
    {
      id: 'job-critical',
      title: 'Job-Critical',
      icon: AlertTriangle,
      bgColor: 'bg-red-50 border-red-200',
      titleColor: 'text-red-700',
      iconColor: 'text-red-600',
      data: getQuadrantData('job-critical')
    },
    {
      id: 'important-not-urgent',
      title: 'Important but Not Urgent',
      icon: Clock,
      bgColor: 'bg-orange-50 border-orange-200',
      titleColor: 'text-orange-700',
      iconColor: 'text-orange-600',
      data: getQuadrantData('important-not-urgent')
    },
    {
      id: 'curious-emerging',
      title: 'Curious & Emerging',
      icon: Lightbulb,
      bgColor: 'bg-blue-50 border-blue-200',
      titleColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      data: getQuadrantData('curious-emerging')
    },
    {
      id: 'nice-to-know',
      title: 'Nice to Know',
      icon: Star,
      bgColor: 'bg-green-50 border-green-200',
      titleColor: 'text-green-700',
      iconColor: 'text-green-600',
      data: getQuadrantData('nice-to-know')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quadrants.map((quadrant) => {
        const Icon = quadrant.icon;
        
        return (
          <Card key={quadrant.id} className={`${quadrant.bgColor} border-2`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-2 text-sm font-medium ${quadrant.titleColor}`}>
                <Icon className={`w-4 h-4 ${quadrant.iconColor}`} />
                {quadrant.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quadrant.data.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No subjects in this category
                </p>
              ) : (
                quadrant.data.map((tech) => (
                  <TechnologyCard
                    key={tech.id}
                    technology={tech}
                    onUpdate={onUpdate}
                    compact={true}
                  />
                ))
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UnknownTechQuadrants;
