
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Plus, Edit, Trash2, Calendar as CalendarIconLucide, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import MobileNavbar from '@/components/Navigation/MobileNavbar';
import BottomNav from '@/components/Navigation/BottomNav';

interface Course {
  id: string;
  subject_id: string;
  resource_name: string;
  source_type: string;
  trainer?: string;
  link?: string;
  duration_hours: number;
  notes?: string;
  watched: boolean;
  created_at: string;
}

interface Subject {
  id: string;
  goal_id: string;
  subject_name: string;
  created_at: string;
}

interface Todo {
  id: string;
  user_id: string;
  course_id: string;
  task_type: string;
  assigned_date: string;
  completed: boolean;
  actual_duration?: number;
  created_at: string;
}

const CoursesPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTaskType, setSelectedTaskType] = useState('Study');

  // Form state
  const [formData, setFormData] = useState({
    resource_name: '',
    source_type: '',
    trainer: '',
    link: '',
    duration_hours: 0,
    notes: '',
  });

  useEffect(() => {
    if (user && subjectId) {
      fetchSubject();
      fetchCourses();
    }
  }, [user, subjectId]);

  const fetchSubject = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subjectId)
        .single();

      if (error) throw error;
      setSubject(data);
    } catch (error) {
      console.error('Error fetching subject:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch subject details',
        variant: 'destructive',
      });
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('subject_id', subjectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch courses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subjectId) return;

    try {
      const courseData = {
        ...formData,
        subject_id: subjectId,
        duration_hours: Number(formData.duration_hours),
      };

      let error;
      if (editingCourse) {
        const { error: updateError } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', editingCourse.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('courses')
          .insert([courseData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Course ${editingCourse ? 'updated' : 'created'} successfully!`,
      });

      setIsCreateDialogOpen(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: 'Error',
        description: 'Failed to save course',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      resource_name: course.resource_name,
      source_type: course.source_type,
      trainer: course.trainer || '',
      link: course.link || '',
      duration_hours: course.duration_hours,
      notes: course.notes || '',
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Course deleted successfully!',
      });

      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete course',
        variant: 'destructive',
      });
    }
  };

  const handleWatchedChange = async (courseId: string, watched: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ watched })
        .eq('id', courseId);

      if (error) throw error;

      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, watched } : course
      ));

      toast({
        title: 'Success',
        description: `Course marked as ${watched ? 'watched' : 'not watched'}!`,
      });
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: 'Error',
        description: 'Failed to update course',
        variant: 'destructive',
      });
    }
  };

  const handleAssignDate = (course: Course) => {
    setSelectedCourse(course);
    setIsDateDialogOpen(true);
  };

  const handleDateAssignment = async () => {
    if (!selectedDate || !selectedCourse || !user) return;

    try {
      const { error } = await supabase
        .from('todos')
        .insert([
          {
            user_id: user.id,
            course_id: selectedCourse.id,
            task_type: selectedTaskType,
            assigned_date: format(selectedDate, 'yyyy-MM-dd'),
            completed: false,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Task assigned successfully!',
      });

      setIsDateDialogOpen(false);
      setSelectedCourse(null);
      setSelectedDate(new Date());
      setSelectedTaskType('Study');
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign task',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      resource_name: '',
      source_type: '',
      trainer: '',
      link: '',
      duration_hours: 0,
      notes: '',
    });
  };

  const sourceTypes = ['Video', 'Book', 'Article', 'Course', 'Tutorial', 'Other'];
  const taskTypes = ['Study', 'Revision R1', 'Revision R2', 'Revision R3', 'Revision R4', 'Revision R5', 'Revision R6', 'Revision R7'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading courses...</div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <MobileNavbar />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/goals/${subject?.goal_id}/subjects`)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Subjects</span>
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Courses for {subject?.subject_name}
          </h1>
          <p className="text-gray-600">
            Manage courses and resources for this subject
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Courses ({courses.length})</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Course</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
                <DialogDescription>
                  {editingCourse ? 'Update course details' : 'Add a new course or resource to this subject'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resource_name">Resource Name</Label>
                  <Input
                    id="resource_name"
                    value={formData.resource_name}
                    onChange={(e) => setFormData({ ...formData, resource_name: e.target.value })}
                    placeholder="e.g., React Fundamentals"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source_type">Source Type</Label>
                  <Select value={formData.source_type} onValueChange={(value) => setFormData({ ...formData, source_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trainer">Trainer/Author (Optional)</Label>
                  <Input
                    id="trainer"
                    value={formData.trainer}
                    onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link (Optional)</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_hours">Duration (Hours)</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData({ ...formData, duration_hours: parseFloat(e.target.value) || 0 })}
                    placeholder="2.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about this course"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setEditingCourse(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {courses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first course or resource.</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{course.resource_name}</CardTitle>
                      <CardDescription>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                          {course.source_type}
                        </span>
                        {course.trainer && (
                          <span className="text-gray-600">by {course.trainer}</span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={course.watched}
                          onCheckedChange={(checked) => handleWatchedChange(course.id, checked === true)}
                        />
                        <span className="text-sm text-gray-600">Watched</span>
                      </div>
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
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration: {course.duration_hours} hours</span>
                      {course.watched && (
                        <span className="text-green-600 font-medium">✅ Completed</span>
                      )}
                    </div>
                    
                    {course.notes && (
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {course.notes}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        {course.link && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(course.link, '_blank')}
                            className="flex items-center space-x-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Open Link</span>
                          </Button>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignDate(course)}
                        className="flex items-center space-x-1"
                      >
                        <CalendarIconLucide className="h-3 w-3" />
                        <span>Assign Date</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Date Assignment Dialog */}
        <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Date</DialogTitle>
              <DialogDescription>
                Assign a date and task type for: {selectedCourse?.resource_name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task_type">Task Type</Label>
                <Select value={selectedTaskType} onValueChange={setSelectedTaskType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleDateAssignment}>
                  Assign Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <BottomNav />
    </div>
  );
};

export default CoursesPage;
