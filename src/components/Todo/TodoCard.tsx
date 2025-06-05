
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, BookOpen, Edit, Trash2, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

interface Todo {
  id: string;
  title: string | null;
  task_type: string;
  assigned_date: string;
  completed: boolean;
  revision_round: number | null;
  actual_duration: number | null;
  notes: string | null;
  courses?: {
    resource_name: string;
    source_type: string;
    trainer: string | null;
    duration_hours: number | null;
  };
}

interface TodoCardProps {
  todo: Todo;
  isOverdue?: boolean;
  onToggleComplete: (todoId: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: string) => void;
  onReschedule?: (todoId: string) => void;
}

const TodoCard = ({ 
  todo, 
  isOverdue = false, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onReschedule 
}: TodoCardProps) => {
  const getTaskTypeBadge = (taskType: string, revisionRound: number | null) => {
    const isRevision = taskType.toLowerCase().includes('revision');
    return (
      <Badge className={isRevision ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
        {taskType}
      </Badge>
    );
  };

  const getBorderColor = () => {
    if (isOverdue) return 'border-l-red-500';
    if (todo.completed) return 'border-l-green-500';
    return 'border-l-orange-500';
  };

  const displayTitle = todo.title || todo.courses?.resource_name || 'Untitled Task';

  return (
    <Card className={`border-l-4 ${getBorderColor()} ${todo.completed ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggleComplete(todo.id, todo.completed)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-lg ${todo.completed ? 'line-through' : ''}`}>
                {displayTitle}
                {todo.revision_round && todo.revision_round > 1 && (
                  <span className="text-purple-600"> – Revision (Round {todo.revision_round})</span>
                )}
              </h3>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(todo.assigned_date), 'MMM dd, yyyy')}</span>
                  {isOverdue && <Badge variant="destructive" className="ml-2">Overdue</Badge>}
                </div>
                {todo.courses?.source_type && (
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{todo.courses.source_type}</span>
                  </div>
                )}
                {(todo.actual_duration || todo.courses?.duration_hours) && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{todo.actual_duration || todo.courses?.duration_hours}h</span>
                  </div>
                )}
              </div>
              {todo.courses?.trainer && (
                <p className="text-sm text-gray-600 mt-1">
                  Trainer: {todo.courses.trainer}
                </p>
              )}
              {todo.notes && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  {todo.notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2 ml-4">
            {getTaskTypeBadge(todo.task_type, todo.revision_round)}
            {todo.completed && (
              <Badge className="bg-green-100 text-green-800">✅ Completed</Badge>
            )}
            <div className="flex space-x-1">
              {isOverdue && onReschedule && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReschedule(todo.id)}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(todo)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(todo.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoCard;
