
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EditSubjectDialog from './EditTechnologyDialog';

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
        title: 'Subject deleted',
        description: `${technology.subject_name} has been removed from your learning matrix.`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete subject. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="bg-white/80 hover:bg-white/90 transition-colors">
        <CardContent className={compact ? "p-3" : "p-4"}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                {technology.subject_name}
              </h4>
              {technology.topic_name && (
                <p className={`text-gray-600 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                  {technology.topic_name}
                </p>
              )}
              
              <div className={`flex flex-wrap gap-1 ${compact ? 'mt-2' : 'mt-3'}`}>
                {technology.estimated_hours && (
                  <Badge variant="outline" className={compact ? 'text-xs px-2 py-0' : 'text-xs'}>
                    {technology.estimated_hours}h
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

      <EditSubjectDialog
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
