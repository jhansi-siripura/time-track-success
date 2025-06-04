
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Calendar as CalendarIcon, ArrowLeft, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import MobileNavbar from '@/components/Navigation/MobileNavbar';
import BottomNav from '@/components/Navigation/BottomNav';

const CoursesPage = () => {
  const { subjectId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [assignDate, setAssignDate] = useState<Date>();
  const [taskType, setTaskType] = useState('Study');
  
  // Form states
  const [resourceName, setResourceName] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [trainer, setTrainer] = useState('');
  const [link, setLink] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [notes, setNotes] = useState('');
  const [watched, setWatched] = useState(false);

  const { data: subject } = useQuery({
    queryKey: ['subject', subjectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*, study_goals(*)')
        .eq('id', subjectId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!subjectId,
  });

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', subjectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('subject_id', subjectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!subjectId,
  });

  const createCourseMutation = useMutation({
    mutationFn: async (newCourse: any) => {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...newCourse,
          subject_id: subjectId,
          duration_hours: parseFloat(newCourse.duration_hours) || 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      resetForm();
      toast({
        title: "Success",
        description: "Course created successfully!",
      });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('courses')
        .update({
          ...updateData,
          duration_hours: parseFloat(updateData.duration_hours) || 0,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      resetForm();
      toast({
        title: "Success",
        description: "Course updated successfully!",
      });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Success",
        description: "Course deleted successfully!",
      });
    },
  });

  const assignDateMutation = useMutation({
    mutationFn: async (todoData: any) => {
      const { data, error } = await supabase
        .from('todos')
        .insert({
          ...todoData,
          user_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setIsDateDialogOpen(false);
      setSelectedCourse(null);
      setAssignDate(undefined);
      setTaskType('Study');
      toast({
        title: "Success",
        description: "Date assigned successfully!",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const courseData = {
      resource_name: resourceName,
      source_type: sourceType,
      trainer: trainer || null,
      link: link || null,
      duration_hours: durationHours,
      notes: notes || null,
      watched,
    };

    if (editingCourse) {
      updateCourseMutation.mutate({ id: editingCourse.id, ...courseData });
    } else {
      createCourseMutation.mutate(courseData);
    }
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setResourceName(course.resource_name);
    setSourceType(course.source_type);
    setTrainer(course.trainer || '');
    setLink(course.link || '');
    setDurationHours(course.duration_hours?.toString() || '');
    setNotes(course.notes || '');
    setWatched(course.watched || false);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      deleteCourseMutation.mutate(id);
    }
  };

  const handleAssignDate = (course: any) => {
    setSelectedCourse(course);
    setIsDateDialogOpen(true);
  };

  const handleDateAssignment = () => {
    if (!assignDate || !selectedCourse) return;

    assignDateMutation.mutate({
      course_id: selectedCourse.id,
      task_type: taskType,
      assigned_date: format(assignDate, 'yyyy-MM-dd'),
      completed: false,
    });
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingCourse(null);
    setResourceName('');
    setSourceType('');
    setTrainer('');
    setLink('');
    setDurationHours('');
    setNotes('');
    setWatched(false);
  };

  const sourceTypes = ['Video', 'Book', 'Article', 'Course', 'Tutorial', 'Other'];
  const taskTypes = ['Study', 'Revision R1', 'Revision R2', 'Revision R3', 'Revision R4', 'Revision R5', 'Revision R6', 'Revision R7'];

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
          <Link to={`/goals/${subject?.goal_id}/subjects`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subjects
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {subject?.subject_name} - Courses
            </h1>
            <p className="text-gray-600">Manage learning resources and materials</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </DialogTitle>
                <DialogDescription>
                  {editingCourse ? 'Update your course details' : 'Add a new learning resource to this subject'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resource-name">Resource Name *</Label>
                    <Input
                      id="resource-name"
                      value={resourceName}
                      onChange={(e) => setResourceName(e.target.value)}
                      placeholder="e.g., React Complete Guide"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="source-type">Source Type *</Label>
                    <Select value={sourceType} onValueChange={setSourceType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source type" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="trainer">Trainer/Author</Label>
                    <Input
                      id="trainer"
                      value={trainer}
                      onChange={(e) => setTrainer(e.target.value)}
                      placeholder="e.g., John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link">Link (Optional)</Label>
                    <Input
                      id="link"
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (Hours)</Label>
                    <Input
                      id="duration"
                      type="number"
                      step="0.5"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      placeholder="e.g., 2.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional notes..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="watched"
                      checked={watched}
                      onCheckedChange={setWatched}
                    />
                    <Label htmlFor="watched">Mark as watched/completed</Label>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createCourseMutation.isPending || updateCourseMutation.isPending}>
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {course.watched ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                    <CardTitle className="text-lg">{course.resource_name}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(course)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium">{course.source_type}</span>
                  </div>
                  {course.trainer && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Trainer:</span>
                      <span className="text-sm font-medium">{course.trainer}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">{course.duration_hours || 0}h</span>
                  </div>
                  {course.link && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Link:</span>
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                  {course.notes && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-1">Notes:</span>
                      <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded text-wrap break-words">
                        {course.notes}
                      </p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => handleAssignDate(course)}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Assign Date
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses?.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-4">Add learning resources to this subject</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Course
            </Button>
          </div>
        )}

        {/* Date Assignment Dialog */}
        <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Date for {selectedCourse?.resource_name}</DialogTitle>
              <DialogDescription>
                Choose a date and task type for this course
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Task Type</Label>
                <Select value={taskType} onValueChange={setTaskType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assigned Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !assignDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {assignDate ? format(assignDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={assignDate}
                      onSelect={setAssignDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDateDialogOpen(false);
                  setSelectedCourse(null);
                  setAssignDate(undefined);
                  setTaskType('Study');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDateAssignment}
                disabled={!assignDate || assignDateMutation.isPending}
              >
                Assign Date
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <BottomNav />
    </div>
  );
};

export default CoursesPage;
