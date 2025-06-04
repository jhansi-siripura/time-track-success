
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckSquare, Calendar, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navigation/Navbar';
import { format } from 'date-fns';

const TodosPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [actualDuration, setActualDuration] = useState('');

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todos')
        .select(`
          *,
          courses (
            resource_name,
            source_type,
            trainer,
            subjects (
              subject_name,
              study_goals (
                goal_name
              )
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('assigned_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, completed, actual_duration }: { id: string; completed: boolean; actual_duration?: number }) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ completed, actual_duration })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
      setEditingTodo(null);
      setActualDuration('');
      toast({ title: "Success", description: "Todo updated successfully!" });
    },
  });

  const handleToggleComplete = (todo: any) => {
    if (!todo.completed && !todo.actual_duration) {
      setEditingTodo(todo);
    } else {
      updateTodoMutation.mutate({
        id: todo.id,
        completed: !todo.completed,
        actual_duration: todo.actual_duration
      });
    }
  };

  const handleSaveWithDuration = () => {
    if (!editingTodo || !actualDuration) return;
    
    updateTodoMutation.mutate({
      id: editingTodo.id,
      completed: true,
      actual_duration: parseFloat(actualDuration)
    });
  };

  const getTaskTypeBadge = (taskType: string) => {
    const colors = {
      'Study': 'bg-blue-100 text-blue-800',
      'Revision R1': 'bg-green-100 text-green-800',
      'Revision R2': 'bg-yellow-100 text-yellow-800',
      'Revision R3': 'bg-orange-100 text-orange-800',
      'Revision R4': 'bg-red-100 text-red-800',
      'Revision R5': 'bg-purple-100 text-purple-800',
      'Revision R6': 'bg-pink-100 text-pink-800',
      'Revision R7': 'bg-indigo-100 text-indigo-800',
    };
    
    return (
      <Badge className={colors[taskType as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {taskType}
      </Badge>
    );
  };

  const getStatusBadge = (completed: boolean, assignedDate: string) => {
    const today = new Date();
    const taskDate = new Date(assignedDate);
    
    if (completed) {
      return <Badge className="bg-green-100 text-green-800">✅ Completed</Badge>;
    } else if (taskDate < today) {
      return <Badge className="bg-red-100 text-red-800">⏰ Overdue</Badge>;
    } else if (taskDate.toDateString() === today.toDateString()) {
      return <Badge className="bg-yellow-100 text-yellow-800">📅 Due Today</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800">📋 Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const pendingTodos = todos?.filter(todo => !todo.completed) || [];
  const completedTodos = todos?.filter(todo => todo.completed) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">To-Do List</h1>
          <p className="text-gray-600">Track your assigned study tasks and revisions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Tasks */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckSquare className="h-5 w-5 mr-2 text-blue-600" />
              Pending Tasks ({pendingTodos.length})
            </h2>
            <div className="space-y-3">
              {pendingTodos.map((todo) => (
                <Card key={todo.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            checked={false}
                            onCheckedChange={() => handleToggleComplete(todo)}
                          />
                          <h3 className="font-medium">{todo.courses?.resource_name}</h3>
                        </div>
                        <div className="ml-6 space-y-1">
                          <div className="text-sm text-gray-600">
                            {todo.courses?.subjects?.study_goals?.goal_name} → {todo.courses?.subjects?.subject_name}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(todo.assigned_date), 'MMM dd, yyyy')}</span>
                            </div>
                            <div>{todo.courses?.source_type}</div>
                            {todo.courses?.trainer && <div>by {todo.courses?.trainer}</div>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 items-end">
                        {getTaskTypeBadge(todo.task_type)}
                        {getStatusBadge(todo.completed, todo.assigned_date)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pendingTodos.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending tasks</h3>
                    <p className="text-gray-600">All caught up! Assign new tasks from your Study Plan.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckSquare className="h-5 w-5 mr-2 text-green-600" />
              Completed Tasks ({completedTodos.length})
            </h2>
            <div className="space-y-3">
              {completedTodos.map((todo) => (
                <Card key={todo.id} className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            checked={true}
                            onCheckedChange={() => handleToggleComplete(todo)}
                          />
                          <h3 className="font-medium line-through text-gray-600">{todo.courses?.resource_name}</h3>
                        </div>
                        <div className="ml-6 space-y-1">
                          <div className="text-sm text-gray-600">
                            {todo.courses?.subjects?.study_goals?.goal_name} → {todo.courses?.subjects?.subject_name}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(todo.assigned_date), 'MMM dd, yyyy')}</span>
                            </div>
                            {todo.actual_duration && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{todo.actual_duration}h completed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 items-end">
                        {getTaskTypeBadge(todo.task_type)}
                        {getStatusBadge(todo.completed, todo.assigned_date)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Duration Input Dialog */}
        <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Task as Completed</DialogTitle>
              <DialogDescription>
                How many hours did you spend on: {editingTodo?.courses?.resource_name}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="duration">Actual Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  step="0.5"
                  value={actualDuration}
                  onChange={(e) => setActualDuration(e.target.value)}
                  placeholder="2.5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTodo(null)}>Cancel</Button>
              <Button onClick={handleSaveWithDuration}>Mark Complete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TodosPage;
