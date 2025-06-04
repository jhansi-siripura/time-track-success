
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, BookOpen, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import MobileNavbar from '@/components/Navigation/MobileNavbar';
import BottomNav from '@/components/Navigation/BottomNav';

const SubjectsPage = () => {
  const { goalId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [subjectName, setSubjectName] = useState('');

  const { data: goal } = useQuery({
    queryKey: ['study-goal', goalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_goals')
        .select('*')
        .eq('id', goalId)
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!goalId && !!user?.id,
  });

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects', goalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subject_stats')
        .select('*')
        .eq('goal_id', goalId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!goalId,
  });

  const createSubjectMutation = useMutation({
    mutationFn: async (newSubject: { subject_name: string }) => {
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          ...newSubject,
          goal_id: goalId,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setIsDialogOpen(false);
      setSubjectName('');
      toast({
        title: "Success",
        description: "Subject created successfully!",
      });
    },
  });

  const updateSubjectMutation = useMutation({
    mutationFn: async ({ id, subject_name }: { id: string; subject_name: string }) => {
      const { data, error } = await supabase
        .from('subjects')
        .update({ subject_name })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setIsDialogOpen(false);
      setEditingSubject(null);
      setSubjectName('');
      toast({
        title: "Success",
        description: "Subject updated successfully!",
      });
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast({
        title: "Success",
        description: "Subject deleted successfully!",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    if (editingSubject) {
      updateSubjectMutation.mutate({ id: editingSubject.id, subject_name: subjectName });
    } else {
      createSubjectMutation.mutate({ subject_name: subjectName });
    }
  };

  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
    setSubjectName(subject.subject_name);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subject? This will also delete all related courses.')) {
      deleteSubjectMutation.mutate(id);
    }
  };

  const resetDialog = () => {
    setIsDialogOpen(false);
    setEditingSubject(null);
    setSubjectName('');
  };

  const getExpertiseBadge = (level: string) => {
    const badges = {
      'Newbie': { emoji: '🆕', color: 'bg-gray-100 text-gray-800' },
      'Beginner': { emoji: '🧪', color: 'bg-blue-100 text-blue-800' },
      'Intermediate': { emoji: '📘', color: 'bg-green-100 text-green-800' },
      'Advanced': { emoji: '🧠', color: 'bg-purple-100 text-purple-800' },
      'Expert': { emoji: '🌟', color: 'bg-yellow-100 text-yellow-800' },
      'Master': { emoji: '🚀', color: 'bg-red-100 text-red-800' },
    };
    const badge = badges[level as keyof typeof badges] || badges['Newbie'];
    return (
      <Badge className={badge.color}>
        {badge.emoji} {level}
      </Badge>
    );
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
        <div className="flex items-center gap-4 mb-6">
          <Link to="/study-goals">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Goals
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {goal?.goal_name} - Subjects
            </h1>
            <p className="text-gray-600">Manage subjects within this study goal</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSubject ? 'Edit Subject' : 'Create New Subject'}
                </DialogTitle>
                <DialogDescription>
                  {editingSubject ? 'Update your subject' : 'Add a new subject to this study goal'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subject-name">Subject Name</Label>
                    <Input
                      id="subject-name"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="e.g., JavaScript Fundamentals"
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={resetDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createSubjectMutation.isPending || updateSubjectMutation.isPending}>
                    {editingSubject ? 'Update Subject' : 'Create Subject'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects?.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">{subject.subject_name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(subject)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(subject.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expertise Level:</span>
                    {getExpertiseBadge(subject.expertise_level)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Planned Hours:</span>
                    <span className="font-medium">{subject.planned_hours || 0}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Actual Hours:</span>
                    <span className="font-medium">{subject.actual_hours || 0}h</span>
                  </div>
                  <Link to={`/subjects/${subject.id}/courses`}>
                    <Button variant="outline" className="w-full mt-4">
                      Manage Courses
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {subjects?.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects yet</h3>
            <p className="text-gray-600 mb-4">Add subjects to organize your learning materials</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Subject
            </Button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default SubjectsPage;
