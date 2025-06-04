
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import MobileNavbar from '@/components/Navigation/MobileNavbar';
import BottomNav from '@/components/Navigation/BottomNav';
import { Link } from 'react-router-dom';

const StudyGoalsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [goalName, setGoalName] = useState('');

  const { data: goals, isLoading } = useQuery({
    queryKey: ['study-goals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (newGoal: { goal_name: string }) => {
      const { data, error } = await supabase
        .from('study_goals')
        .insert({
          ...newGoal,
          user_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-goals'] });
      setIsDialogOpen(false);
      setGoalName('');
      toast({
        title: "Success",
        description: "Study goal created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create study goal",
        variant: "destructive",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, goal_name }: { id: string; goal_name: string }) => {
      const { data, error } = await supabase
        .from('study_goals')
        .update({ goal_name })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-goals'] });
      setIsDialogOpen(false);
      setEditingGoal(null);
      setGoalName('');
      toast({
        title: "Success",
        description: "Study goal updated successfully!",
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('study_goals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-goals'] });
      toast({
        title: "Success",
        description: "Study goal deleted successfully!",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName.trim()) return;

    if (editingGoal) {
      updateGoalMutation.mutate({ id: editingGoal.id, goal_name: goalName });
    } else {
      createGoalMutation.mutate({ goal_name: goalName });
    }
  };

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setGoalName(goal.goal_name);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this goal? This will also delete all related subjects and courses.')) {
      deleteGoalMutation.mutate(id);
    }
  };

  const resetDialog = () => {
    setIsDialogOpen(false);
    setEditingGoal(null);
    setGoalName('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileNavbar />
        <div className="max-w-7xl mx-auto px-4 py-8 pb-20 md:pb-8">
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
      <MobileNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Study Goals</h1>
            <p className="text-gray-600">Manage your learning objectives and track progress</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? 'Edit Study Goal' : 'Create New Study Goal'}
                </DialogTitle>
                <DialogDescription>
                  {editingGoal ? 'Update your study goal' : 'Add a new learning objective to track your progress'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal-name">Goal Name</Label>
                    <Input
                      id="goal-name"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                      placeholder="e.g., Learn React Development"
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={resetDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createGoalMutation.isPending || updateGoalMutation.isPending}>
                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals?.map((goal) => (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{goal.goal_name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(goal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Created {new Date(goal.created_at).toLocaleDateString()}
                </CardDescription>
                <Link to={`/goals/${goal.id}/subjects`}>
                  <Button variant="outline" className="w-full">
                    Manage Subjects
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {goals?.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No study goals yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first learning objective</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default StudyGoalsPage;
