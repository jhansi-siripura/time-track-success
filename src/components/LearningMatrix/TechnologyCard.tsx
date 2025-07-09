
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

interface GroupedSubject {
  subject_name: string;
  topics: string[];
  total_hours: number;
  ids: string[];
  priority_category: string;
  representative_entry: LearningMatrixUnknown;
}

interface TechnologyCardProps {
  technology?: LearningMatrixUnknown;
  groupedData?: GroupedSubject;
  onUpdate: () => void;
  compact?: boolean;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ technology, groupedData, onUpdate, compact = false }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  // Use grouped data if available, otherwise fall back to individual technology
  const displayData = groupedData || {
    subject_name: technology?.subject_name || '',
    topics: technology?.topic_name ? [technology.topic_name] : [],
    total_hours: technology?.estimated_hours || 0,
    ids: technology ? [technology.id] : [],
    priority_category: technology?.priority_category || '',
    representative_entry: technology!
  };

  const handleDelete = async () => {
    try {
      // If we have grouped data, we need to delete all entries for this subject in this quadrant
      const idsToDelete = displayData.ids;
      
      const { error } = await supabase
        .from('learning_matrix_unknown')
        .delete()
        .in('id', idsToDelete);

      if (error) throw error;

      const subjectText = displayData.topics.length > 1 
        ? `${displayData.subject_name} with ${displayData.topics.length} topics`
        : displayData.subject_name;

      toast({
        title: 'Subject deleted',
        description: `${subjectText} has been removed from your learning matrix.`,
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
                {displayData.subject_name}
              </h4>
              
              {displayData.topics.length > 0 && (
                <div className={`mt-1 ${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
                  {displayData.topics.length === 1 ? (
                    <p>{displayData.topics[0]}</p>
                  ) : (
                    <div>
                      <p className="font-medium mb-1">Topics:</p>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        {displayData.topics.map((topic, index) => (
                          <li key={index}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <div className={`flex flex-wrap gap-1 ${compact ? 'mt-2' : 'mt-3'}`}>
                {displayData.total_hours > 0 && (
                  <Badge variant="outline" className={compact ? 'text-xs px-2 py-0' : 'text-xs'}>
                    {displayData.total_hours}h
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
        technology={displayData.representative_entry}
        onSuccess={() => {
          setShowEditDialog(false);
          onUpdate();
        }}
      />
    </>
  );
};

export default TechnologyCard;
