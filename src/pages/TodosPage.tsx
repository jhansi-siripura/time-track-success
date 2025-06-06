import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format, isAfter, parseISO } from 'date-fns';
import { getTodayDate, isToday, isDateSame } from '@/lib/dateUtils';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';
import TodoFilters from '@/components/Todo/TodoFilters';
import TodoSummary from '@/components/Todo/TodoSummary';
import TodoEditDialog from '@/components/Todo/TodoEditDialog';
import TodoCard from '@/components/Todo/TodoCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

const TodosPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Filter states - use timezone-aware today date
  const [dateFilter, setDateFilter] = useState(getTodayDate());
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [taskTypeFilter, setTaskTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
      return data as Todo[];
    },
    enabled: !!user?.id,
  });

  const updateTodoMutation = useMutation({
    mutationFn: async ({ todoId, updates }: { todoId: string; updates: any }) => {
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
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

  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId: string) => {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todoId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({ title: "Success", description: "Task deleted successfully!" });
    },
  });

  // Filter and categorize todos using timezone-aware utilities
  const { filteredTodos, overdueTodos, pendingTodos, completedTodos, subjects, summaryStats } = useMemo(() => {
    if (!todos) return { 
      filteredTodos: [], 
      overdueTodos: [], 
      pendingTodos: [], 
      completedTodos: [], 
      subjects: [],
      summaryStats: { totalStudyTimeToday: 0, completedTasksToday: 0, revisionRoundsCompleted: 0, weeklyStreak: 0 }
    };

    const today = getTodayDate();
    
    // Extract unique subjects
    const uniqueSubjects = Array.from(new Set(
      todos.map(todo => todo.courses?.resource_name).filter(Boolean)
    )) as string[];

    // Apply filters
    let filtered = todos.filter(todo => {
      const todoDate = todo.assigned_date;
      const isDateMatch = dateFilter === '' || todoDate === dateFilter;
      const isSubjectMatch = subjectFilter === 'all' || todo.courses?.resource_name === subjectFilter;
      const isTaskTypeMatch = taskTypeFilter === 'all' || 
        (taskTypeFilter === 'study' && todo.revision_round === 1) ||
        (taskTypeFilter === 'revision' && (todo.revision_round || 1) > 1);
      const isStatusMatch = statusFilter === 'all' ||
        (statusFilter === 'pending' && !todo.completed) ||
        (statusFilter === 'completed' && todo.completed) ||
        (statusFilter === 'overdue' && !todo.completed && todoDate < today);

      return isDateMatch && isSubjectMatch && isTaskTypeMatch && isStatusMatch;
    });

    // Categorize todos using timezone-aware comparison
    const overdue = filtered.filter(todo => 
      !todo.completed && todo.assigned_date < today
    );
    const pending = filtered.filter(todo => 
      !todo.completed && todo.assigned_date >= today
    );
    const completed = filtered.filter(todo => todo.completed);

    // Calculate summary stats using timezone-aware today check
    const todayTodos = todos.filter(todo => isToday(todo.assigned_date));
    const completedTodayTodos = todayTodos.filter(todo => todo.completed);
    const totalStudyTimeToday = completedTodayTodos.reduce((sum, todo) => 
      sum + (todo.actual_duration || todo.courses?.duration_hours || 0), 0
    );
    const revisionRoundsCompleted = completedTodayTodos.filter(todo => 
      (todo.revision_round || 1) > 1
    ).length;
    
    // Simple weekly streak calculation (mock for now)
    const weeklyStreak = 5; // This would require more complex date calculations

    return {
      filteredTodos: filtered,
      overdueTodos: overdue,
      pendingTodos: pending,
      completedTodos: completed,
      subjects: uniqueSubjects,
      summaryStats: {
        totalStudyTimeToday,
        completedTasksToday: completedTodayTodos.length,
        revisionRoundsCompleted,
        weeklyStreak
      }
    };
  }, [todos, dateFilter, subjectFilter, taskTypeFilter, statusFilter]);

  const handleToggleComplete = (todoId: string, completed: boolean) => {
    updateTodoMutation.mutate({ todoId, updates: { completed: !completed } });
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditDialogOpen(true);
  };

  const handleSaveTodo = (todoId: string, updates: any) => {
    updateTodoMutation.mutate({ todoId, updates });
  };

  const handleDeleteTodo = (todoId: string) => {
    setDeletingTodoId(todoId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingTodoId) {
      deleteTodoMutation.mutate(deletingTodoId);
      setDeletingTodoId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleReschedule = (todoId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-CA');
    updateTodoMutation.mutate({ todoId, updates: { assigned_date: tomorrowStr } });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <CheckSquare className="h-8 w-8 mr-3 text-blue-600" />
            To-Do List
          </h1>
          <p className="text-gray-600">Manage your assigned study tasks and revisions</p>
        </div>

        {/* Summary Dashboard */}
        <TodoSummary {...summaryStats} />

        {/* Filters */}
        <TodoFilters
          dateFilter={dateFilter}
          subjectFilter={subjectFilter}
          taskTypeFilter={taskTypeFilter}
          statusFilter={statusFilter}
          subjects={subjects}
          onDateFilterChange={setDateFilter}
          onSubjectFilterChange={setSubjectFilter}
          onTaskTypeFilterChange={setTaskTypeFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <div className="grid gap-8">
          {/* Overdue Tasks */}
          {overdueTodos.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Overdue Tasks ({overdueTodos.length})
              </h2>
              <div className="space-y-4">
                {overdueTodos.map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    isOverdue={true}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                    onReschedule={handleReschedule}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pending Tasks */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Pending Tasks ({pendingTodos.length})
            </h2>
            {pendingTodos.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No pending tasks for the selected filters.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingTodos.map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                  />
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
                  No completed tasks for the selected filters.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedTodos.map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Dialog */}
        <TodoEditDialog
          todo={editingTodo}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveTodo}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogFooter>
        </AlertDialog>
      </div>
      <BottomNav />
    </div>
  );
};

export default TodosPage;
