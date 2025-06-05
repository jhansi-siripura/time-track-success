
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter } from 'lucide-react';

interface TodoFiltersProps {
  dateFilter: string;
  subjectFilter: string;
  taskTypeFilter: string;
  statusFilter: string;
  subjects: string[];
  onDateFilterChange: (date: string) => void;
  onSubjectFilterChange: (subject: string) => void;
  onTaskTypeFilterChange: (type: string) => void;
  onStatusFilterChange: (status: string) => void;
}

const TodoFilters = ({
  dateFilter,
  subjectFilter,
  taskTypeFilter,
  statusFilter,
  subjects,
  onDateFilterChange,
  onSubjectFilterChange,
  onTaskTypeFilterChange,
  onStatusFilterChange,
}: TodoFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="date-filter" className="text-sm font-medium text-gray-700">Date</Label>
            <div className="relative">
              <Input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => onDateFilterChange(e.target.value)}
                className="pl-8"
              />
              <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="subject-filter" className="text-sm font-medium text-gray-700">Subject</Label>
            <Select value={subjectFilter} onValueChange={onSubjectFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="task-type-filter" className="text-sm font-medium text-gray-700">Task Type</Label>
            <Select value={taskTypeFilter} onValueChange={onTaskTypeFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="revision">Revision</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status-filter" className="text-sm font-medium text-gray-700">Status</Label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoFilters;
