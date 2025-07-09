
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Lightbulb, Star, MoreHorizontal } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import TechnologyCard from './TechnologyCard';

type LearningMatrixUnknown = Database['public']['Tables']['learning_matrix_unknown']['Row'];

interface GroupedSubject {
  subject_name: string;
  topics: string[];
  total_hours: number;
  ids: string[]; // Keep track of individual IDs for actions
  priority_category: string;
  // We'll use the first entry for other properties
  representative_entry: LearningMatrixUnknown;
}

interface UnknownTechQuadrantsProps {
  technologies: LearningMatrixUnknown[];
  onUpdate: () => void;
}

const UnknownTechQuadrants: React.FC<UnknownTechQuadrantsProps> = ({ technologies, onUpdate }) => {
  const getQuadrantData = (priority: string): GroupedSubject[] => {
    const quadrantTechs = technologies.filter(tech => tech.priority_category === priority);
    
    // Group by subject name
    const groupedBySubject = quadrantTechs.reduce((acc, tech) => {
      const subjectName = tech.subject_name;
      
      if (!acc[subjectName]) {
        acc[subjectName] = {
          subject_name: subjectName,
          topics: [],
          total_hours: 0,
          ids: [],
          priority_category: priority,
          representative_entry: tech
        };
      }
      
      // Add topic if it exists and isn't already in the list
      if (tech.topic_name && !acc[subjectName].topics.includes(tech.topic_name)) {
        acc[subjectName].topics.push(tech.topic_name);
      }
      
      // Add to total hours
      acc[subjectName].total_hours += tech.estimated_hours || 0;
      
      // Keep track of IDs
      acc[subjectName].ids.push(tech.id);
      
      return acc;
    }, {} as Record<string, GroupedSubject>);
    
    return Object.values(groupedBySubject);
  };

  const getQuadrantTotalHours = (priority: string): number => {
    const quadrantTechs = technologies.filter(tech => tech.priority_category === priority);
    return quadrantTechs.reduce((total, tech) => total + (tech.estimated_hours || 0), 0);
  };

  const quadrants = [
    {
      id: 'job-critical',
      title: 'Job-Critical',
      icon: AlertTriangle,
      bgColor: 'bg-red-50/80 border-red-200/60 backdrop-blur-sm',
      titleColor: 'text-red-700',
      iconColor: 'text-red-600',
      badgeColor: 'bg-red-100 text-red-700 border-red-200',
      data: getQuadrantData('job-critical'),
      totalHours: getQuadrantTotalHours('job-critical')
    },
    {
      id: 'important-not-urgent',
      title: 'Important but Not Urgent',
      icon: Clock,
      bgColor: 'bg-orange-50/80 border-orange-200/60 backdrop-blur-sm',
      titleColor: 'text-orange-700',
      iconColor: 'text-orange-600',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
      data: getQuadrantData('important-not-urgent'),
      totalHours: getQuadrantTotalHours('important-not-urgent')
    },
    {
      id: 'curious-emerging',
      title: 'Curious & Emerging',
      icon: Lightbulb,
      bgColor: 'bg-blue-50/80 border-blue-200/60 backdrop-blur-sm',
      titleColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      data: getQuadrantData('curious-emerging'),
      totalHours: getQuadrantTotalHours('curious-emerging')
    },
    {
      id: 'nice-to-know',
      title: 'Nice to Know',
      icon: Star,
      bgColor: 'bg-green-50/80 border-green-200/60 backdrop-blur-sm',
      titleColor: 'text-green-700',
      iconColor: 'text-green-600',
      badgeColor: 'bg-green-100 text-green-700 border-green-200',
      data: getQuadrantData('nice-to-know'),
      totalHours: getQuadrantTotalHours('nice-to-know')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quadrants.map((quadrant) => {
        const Icon = quadrant.icon;
        
        return (
          <Card key={quadrant.id} className={`${quadrant.bgColor} border-2 shadow-sm`}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center justify-between text-sm font-medium ${quadrant.titleColor}`}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${quadrant.iconColor}`} />
                  {quadrant.title}
                </div>
                {quadrant.totalHours > 0 && (
                  <Badge 
                    variant="outline" 
                    className={`${quadrant.badgeColor} text-xs px-2 py-1 rounded-full font-medium border`}
                  >
                    {quadrant.totalHours}h
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {quadrant.data.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  No subjects in this category
                </p>
              ) : (
                quadrant.data.map((groupedSubject) => (
                  <TechnologyCard
                    key={`${groupedSubject.subject_name}-${quadrant.id}`}
                    groupedData={groupedSubject}
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
