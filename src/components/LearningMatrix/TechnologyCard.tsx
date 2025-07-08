
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EditTechnologyDialog from './EditTechnologyDialog';

type LearningMatrixUnknown = Database['public']['Tables']['learning_matrix_unknown']['Row'];

interface TechnologyCardProps {
  technology: LearningMatrixUnknown;
  onUpdate: () => void;
  compact?: boolean;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ technology, onUpdate, compact = false }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('learning_matrix_unknown')
        .delete()
        .eq('id', technology.id);

      if (error) throw error;

      toast({
        title: 'Technology deleted',
        description: `${technology.technology_name} has been removed from your learning matrix.`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting technology:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete technology. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoiColor = (roi: string | null) => {
    switch (roi) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className="bg-white/80 hover:bg-white/90 transition-colors">
        <CardContent className={compact ? "p-3" : "p-4"}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                {technology.technology_name}
              </h4>
              {technology.description && (
                <p className={`text-gray-600 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                  {technology.description}
                </p>
              )}
              
              <div className={`flex flex-wrap gap-1 ${compact ? 'mt-2' : 'mt-3'}`}>
                {technology.estimated_hours && (
                  <Badge variant="outline" className={compact ? 'text-xs px-2 py-0' : 'text-xs'}>
                    {technology.estimated_hours}h
                  </Badge>
                )}
                {technology.urgency_level && (
                  <Badge className={`text-xs ${getUrgencyColor(technology.urgency_level)}`}>
                    {technology.urgency_level === 'high' ? 'High Urgency' : 
                     technology.urgency_level === 'medium' ? 'Medium Urgency' : 'Low Urgency'}
                  </Badge>
                )}
                {technology.expected_roi && (
                  <Badge className={`text-xs ${getRoiColor(technology.expected_roi)}`}>
                    {technology.expected_roi === 'high' ? 'High ROI' : 
                     technology.expected_roi === 'medium' ? 'Medium ROI' : 
                     technology.expected_roi === 'low' ? 'Low ROI' : 'Unknown ROI'}
                  </Badge>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <EditTechnologyDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        technology={technology}
        onSuccess={() => {
          setShowEditDialog(false);
          onUpdate();
        }}
      />
    </>
  );
};

export default TechnologyCard;
