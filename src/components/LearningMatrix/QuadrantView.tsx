
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Clock, Target, TrendingUp, Coffee } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Technology {
  id: string;
  technology_name: string;
  description: string | null;
  priority_category: 'job-critical' | 'important-not-urgent' | 'curious-emerging' | 'nice-to-know';
  urgency_level: 'high' | 'medium' | 'low' | null;
  estimated_hours: number | null;
  expected_roi: 'high' | 'medium' | 'low' | 'unknown' | null;
}

interface QuadrantViewProps {
  data: Technology[];
  onUpdate: () => void;
}

const QuadrantView = ({ data, onUpdate }: QuadrantViewProps) => {
  const quadrants = {
    'job-critical': {
      title: 'Job Critical',
      subtitle: 'Urgent & Important',
      icon: Target,
      color: 'border-red-200 bg-red-50',
      headerColor: 'text-red-700',
      iconColor: 'text-red-600',
    },
    'important-not-urgent': {
      title: 'Important but Not Urgent',
      subtitle: 'Important & Strategic',
      icon: Clock,
      color: 'border-blue-200 bg-blue-50',
      headerColor: 'text-blue-700',
      iconColor: 'text-blue-600',
    },
    'curious-emerging': {
      title: 'Curious & Emerging',
      subtitle: 'Trending & Interesting',
      icon: TrendingUp,
      color: 'border-green-200 bg-green-50',
      headerColor: 'text-green-700',
      iconColor: 'text-green-600',
    },
    'nice-to-know': {
      title: 'Nice to Know',
      subtitle: 'Low Priority',
      icon: Coffee,
      color: 'border-gray-200 bg-gray-50',
      headerColor: 'text-gray-700',
      iconColor: 'text-gray-600',
    },
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('learning_matrix_unknown')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Technology removed from learning matrix');
      onUpdate();
    } catch (error) {
      console.error('Error deleting technology:', error);
      toast.error('Failed to remove technology');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Object.entries(quadrants).map(([key, quadrant]) => {
        const Icon = quadrant.icon;
        const technologies = data.filter(tech => tech.priority_category === key);
        
        return (
          <Card key={key} className={`${quadrant.color} border-2`}>
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center gap-2 text-base ${quadrant.headerColor}`}>
                <Icon className={`h-5 w-5 ${quadrant.iconColor}`} />
                {quadrant.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{quadrant.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {technologies.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No technologies in this category
                </p>
              ) : (
                technologies.map((tech) => (
                  <TechnologyCard
                    key={tech.id}
                    technology={tech}
                    onDelete={() => handleDelete(tech.id)}
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

const TechnologyCard = ({ 
  technology, 
  onDelete 
}: { 
  technology: Technology; 
  onDelete: () => void;
}) => {
  return (
    <div className="bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-sm mb-1">{technology.technology_name}</h4>
          {technology.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {technology.description}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {technology.urgency_level && (
              <Badge variant="outline" className="text-xs">
                {technology.urgency_level} urgency
              </Badge>
            )}
            {technology.estimated_hours && (
              <Badge variant="outline" className="text-xs">
                ~{technology.estimated_hours}h
              </Badge>
            )}
            {technology.expected_roi && technology.expected_roi !== 'unknown' && (
              <Badge variant="outline" className="text-xs">
                {technology.expected_roi} ROI
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default QuadrantView;
