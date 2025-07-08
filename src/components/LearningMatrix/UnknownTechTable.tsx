
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Search } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EditSubjectDialog from './EditTechnologyDialog';

type LearningMatrixUnknown = Database['public']['Tables']['learning_matrix_unknown']['Row'];

interface UnknownTechTableProps {
  technologies: LearningMatrixUnknown[];
  onUpdate: () => void;
}

const UnknownTechTable: React.FC<UnknownTechTableProps> = ({ technologies, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editTech, setEditTech] = useState<LearningMatrixUnknown | null>(null);
  const { toast } = useToast();

  const filteredTechnologies = technologies.filter(tech =>
    tech.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tech.topic_name && tech.topic_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (technology: LearningMatrixUnknown) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'job-critical': return 'bg-red-100 text-red-800';
      case 'important-not-urgent': return 'bg-orange-100 text-orange-800';
      case 'curious-emerging': return 'bg-blue-100 text-blue-800';
      case 'nice-to-know': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'job-critical': return 'Job-Critical';
      case 'important-not-urgent': return 'Important but Not Urgent';
      case 'curious-emerging': return 'Curious & Emerging';
      case 'nice-to-know': return 'Nice to Know';
      default: return priority;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search subjects and topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTechnologies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No subjects match your search.' : 'No subjects added yet.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredTechnologies.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell>
                    <div className="font-medium">{tech.subject_name}</div>
                  </TableCell>
                  <TableCell>
                    {tech.topic_name && (
                      <div className="text-sm text-muted-foreground">
                        {tech.topic_name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getPriorityColor(tech.priority_category)} text-xs`}>
                      {getPriorityLabel(tech.priority_category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tech.estimated_hours ? `${tech.estimated_hours}h` : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditTech(tech)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(tech)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editTech && (
        <EditSubjectDialog
          open={!!editTech}
          onOpenChange={() => setEditTech(null)}
          technology={editTech}
          onSuccess={() => {
            setEditTech(null);
            onUpdate();
          }}
        />
      )}
    </div>
  );
};

export default UnknownTechTable;
