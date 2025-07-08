
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
import EditTechnologyDialog from './EditTechnologyDialog';

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
    tech.technology_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tech.description && tech.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (technology: LearningMatrixUnknown) => {
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
            placeholder="Search technologies..."
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
              <TableHead>Technology</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>ROI</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTechnologies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No technologies match your search.' : 'No technologies added yet.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredTechnologies.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{tech.technology_name}</div>
                      {tech.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {tech.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getPriorityColor(tech.priority_category)} text-xs`}>
                      {getPriorityLabel(tech.priority_category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tech.urgency_level && (
                      <Badge variant="outline" className="text-xs">
                        {tech.urgency_level.charAt(0).toUpperCase() + tech.urgency_level.slice(1)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {tech.estimated_hours ? `${tech.estimated_hours}h` : '-'}
                  </TableCell>
                  <TableCell>
                    {tech.expected_roi && (
                      <Badge variant="outline" className="text-xs">
                        {tech.expected_roi.charAt(0).toUpperCase() + tech.expected_roi.slice(1)}
                      </Badge>
                    )}
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
        <EditTechnologyDialog
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
