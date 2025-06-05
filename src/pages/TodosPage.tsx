import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CheckSquare, Calendar, Clock, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';

const TodosPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
            duration_hours
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
    mutationFn: async ({ todoId, completed }: { todoId: string; completed: boolean }) => {
      const { data, error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', todoId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({ title: "Success", description: "Task updated successfully!" });
    },
  });

  const getTaskTypeBadge = (taskType: string) => {
    const isRevision = taskType.startsWith('Revision');
    return (
      <Badge className={isRevision ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
        {taskType}
      </Badge>
    );
  };

  const handleToggleComplete = (todoId: string, completed: boolean) => {
    updateTodoMutation.mutate({ todoId, completed: !completed });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const pendingTodos = todos?.filter(todo => !todo.completed) || [];
  const completedTodos = todos?.filter(todo => todo.completed) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <CheckSquare className="h-8 w-8 mr-3 text-blue-600" />
            To-Do List
          </h1>
          <p className="text-gray-600">Manage your assigned study tasks</p>
        </div>

        <div className="grid gap-8">
          {/* Pending Tasks */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pending Tasks ({pendingTodos.length})
            </h2>
            {pendingTodos.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No pending tasks. Great job staying on top of your studies!
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingTodos.map((todo) => (
                  <Card key={todo.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => handleToggleComplete(todo.id, todo.completed)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{todo.courses?.resource_name}</h3>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(todo.assigned_date), 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{todo.courses?.source_type}</span>
                              </div>
                              {todo.courses?.duration_hours && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{todo.courses.duration_hours}h</span>
                                </div>
                              )}
                            </div>
                            {todo.courses?.trainer && (
                              <p className="text-sm text-gray-600 mt-1">
                                Trainer: {todo.courses.trainer}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getTaskTypeBadge(todo.task_type)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Completed Tasks ({completedTodos.length})
            </h2>
            {completedTodos.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No completed tasks yet. Keep working on your goals!
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedTodos.map((todo) => (
                  <Card key={todo.id} className="border-l-4 border-l-green-500 opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => handleToggleComplete(todo.id, todo.completed)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-lg line-through">{todo.courses?.resource_name}</h3>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(todo.assigned_date), 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{todo.courses?.source_type}</span>
                              </div>
                              {todo.courses?.duration_hours && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{todo.courses.duration_hours}h</span>
                                </div>
                              )}
                            </div>
                            {todo.courses?.trainer && (
                              <p className="text-sm text-gray-600 mt-1">
                                Trainer: {todo.courses.trainer}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {getTaskTypeBadge(todo.task_type)}
                          <Badge className="bg-green-100 text-green-800">✅ Completed</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default TodosPage;
