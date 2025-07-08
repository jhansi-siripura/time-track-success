
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Trash2 } from 'lucide-react';
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

interface TableViewProps {
  data: Technology[];
  onUpdate: () => void;
}

const TableView = ({ data, onUpdate }: TableViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredData = data.filter((tech) => {
    const matchesSearch = tech.technology_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tech.description && tech.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || tech.priority_category === priorityFilter;
    return matchesSearch && matchesPriority;
  });

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

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'job-critical':
        return 'destructive';
      case 'important-not-urgent':
        return 'default';
      case 'curious-emerging':
        return 'secondary';
      case 'nice-to-know':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatPriorityLabel = (priority: string) => {
    return priority.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Learning Technologies</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="job-critical">Job Critical</SelectItem>
              <SelectItem value="important-not-urgent">Important but Not Urgent</SelectItem>
              <SelectItem value="curious-emerging">Curious & Emerging</SelectItem>
              <SelectItem value="nice-to-know">Nice to Know</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm || priorityFilter !== 'all' 
                ? 'No technologies match your filters' 
                : 'No technologies added yet'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Technology</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Est. Hours</TableHead>
                  <TableHead>Expected ROI</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((tech) => (
                  <TableRow key={tech.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{tech.technology_name}</p>
                        {tech.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {tech.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(tech.priority_category)}>
                        {formatPriorityLabel(tech.priority_category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tech.urgency_level ? (
                        <Badge variant="outline" className="capitalize">
                          {tech.urgency_level}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tech.estimated_hours ? (
                        <span>{tech.estimated_hours}h</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tech.expected_roi && tech.expected_roi !== 'unknown' ? (
                        <Badge variant="outline" className="capitalize">
                          {tech.expected_roi}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tech.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TableView;
