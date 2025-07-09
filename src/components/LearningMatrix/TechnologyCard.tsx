
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
      <Card className="bg-white/80 hover:bg-white/90 transition-colors shadow-sm border border-gray-200/50">
        <CardContent className={compact ? "p-3" : "p-3"}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                  {displayData.subject_name}
                </h4>
                <div className="flex items-center gap-1 ml-2">
                  {displayData.total_hours > 0 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-700 border-gray-300 font-medium">
                      {displayData.total_hours}h
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-50">
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
              </div>
              
              {displayData.topics.length > 0 && (
                <div className="mt-1.5">
                  {displayData.topics.length === 1 ? (
                    <p className="text-xs text-gray-600 leading-relaxed">{displayData.topics[0]}</p>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {displayData.topics.map((topic, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
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
