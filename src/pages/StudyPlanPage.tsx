
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Target, BookOpen, PlayCircle, Calendar as CalendarIcon, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navigation/Navbar';
import BottomNav from '@/components/Navigation/BottomNav';

const StudyPlanPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Dialog states
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isAssignDateOpen, setIsAssignDateOpen] = useState(false);
  
  // Form states
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  // Form data
  const [goalName, setGoalName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [courseData, setCourseData] = useState({
    resource_name: '',
    source_type: '',
    trainer: '',
    link: '',
    duration_hours: '',
    notes: ''
  });
  const [assignDate, setAssignDate] = useState<Date>();
  const [taskType, setTaskType] = useState('');
  
  // Expanded states
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  // Fetch all data
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

  const { data: subjects } = useQuery({
    queryKey: ['all-subjects', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subject_stats')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: courses } = useQuery({
    queryKey: ['all-courses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Mutations
  const createGoalMutation = useMutation({
    mutationFn: async (newGoal: { goal_name: string }) => {
      const { data, error } = await supabase
        .from('study_goals')
        .insert({ ...newGoal, user_id: user?.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-goals'] });
      setIsGoalDialogOpen(false);
      setGoalName('');
      toast({ title: "Success", description: "Study goal created successfully!" });
    },
  });

  const createSubjectMutation = useMutation({
    mutationFn: async (newSubject: { subject_name: string; goal_id: string }) => {
      const { data, error } = await supabase
        .from('subjects')
        .insert(newSubject)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-subjects'] });
      setIsSubjectDialogOpen(false);
      setSubjectName('');
      setSelectedGoalId('');
      toast({ title: "Success", description: "Subject created successfully!" });
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (newCourse: any) => {
      const { data, error } = await supabase
        .from('courses')
        .insert(newCourse)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
      setIsCourseDialogOpen(false);
      setCourseData({
        resource_name: '',
        source_type: '',
        trainer: '',
        link: '',
        duration_hours: '',
        notes: ''
      });
      setSelectedSubjectId('');
      toast({ title: "Success", description: "Course created successfully!" });
    },
  });

  const createTodoMutation = useMutation({
    mutationFn: async (newTodo: any) => {
      const { data, error } = await supabase
        .from('todos')
        .insert(newTodo)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
      setIsAssignDateOpen(false);
      setAssignDate(undefined);
      setTaskType('');
      setSelectedCourse(null);
      toast({ title: "Success", description: "Task assigned successfully!" });
    },
  });

  const updateCourseWatchedMutation = useMutation({
    mutationFn: async ({ courseId, watched }: { courseId: string; watched: boolean }) => {
      const { data, error } = await supabase
        .from('courses')
        .update({ watched })
        .eq('id', courseId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-courses'] });
      toast({ title: "Success", description: "Course status updated!" });
    },
  });

  // Helper functions
  const toggleGoalExpansion = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const toggleSubjectExpansion = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId);
    } else {
      newExpanded.add(subjectId);
    }
    setExpandedSubjects(newExpanded);
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

  const handleAssignDate = (course: any) => {
    setSelectedCourse(course);
    setIsAssignDateOpen(true);
  };

  const handleCreateTodo = () => {
    if (!assignDate || !taskType || !selectedCourse) return;

    createTodoMutation.mutate({
      user_id: user?.id,
      course_id: selectedCourse.id,
      task_type: taskType,
      assigned_date: format(assignDate, 'yyyy-MM-dd'),
    });
  };

  const getSubjectsForGoal = (goalId: string) => {
    return subjects?.filter(subject => subject.goal_id === goalId) || [];
  };

  const getCoursesForSubject = (subjectId: string) => {
    return courses?.filter(course => course.subject_id === subjectId) || [];
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Study Plan</h1>
            <p className="text-gray-600">Manage your complete learning hierarchy</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsGoalDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
            <Button variant="outline" onClick={() => setIsSubjectDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
            <Button variant="outline" onClick={() => setIsCourseDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {goals?.map((goal) => (
            <Card key={goal.id} className="overflow-hidden">
              <Collapsible>
                <CardHeader className="pb-4">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center space-x-2">
                        {expandedGoals.has(goal.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                        <Target className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">{goal.goal_name}</CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="ml-6 space-y-3">
                      {getSubjectsForGoal(goal.id).map((subject) => (
                        <Card key={subject.id} className="border-l-4 border-l-green-500">
                          <Collapsible>
                            <CardHeader className="pb-2">
                              <CollapsibleTrigger asChild>
                                <div className="flex items-center justify-between cursor-pointer">
                                  <div className="flex items-center space-x-2">
                                    {expandedSubjects.has(subject.id) ? 
                                      <ChevronDown className="h-4 w-4" /> : 
                                      <ChevronRight className="h-4 w-4" />
                                    }
                                    <BookOpen className="h-4 w-4 text-green-600" />
                                    <CardTitle className="text-base">{subject.subject_name}</CardTitle>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getExpertiseBadge(subject.expertise_level)}
                                    <Badge variant="outline">{subject.planned_hours}h planned</Badge>
                                    <Badge variant="outline">{subject.actual_hours}h actual</Badge>
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                            </CardHeader>
                            
                            <CollapsibleContent>
                              <CardContent className="pt-0">
                                <div className="ml-6 space-y-2">
                                  {getCoursesForSubject(subject.id).map((course) => (
                                    <Card key={course.id} className="border-l-4 border-l-purple-500">
                                      <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                              <PlayCircle className="h-4 w-4 text-purple-600" />
                                              <h4 className="font-medium">{course.resource_name}</h4>
                                              {course.watched && <Badge className="bg-green-100 text-green-800">✅ Watched</Badge>}
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                                              <div>Source: {course.source_type}</div>
                                              <div>Duration: {course.duration_hours}h</div>
                                              {course.trainer && <div>Trainer: {course.trainer}</div>}
                                              {course.link && (
                                                <div className="flex items-center space-x-1">
                                                  <ExternalLink className="h-3 w-3" />
                                                  <a href={course.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    Link
                                                  </a>
                                                </div>
                                              )}
                                            </div>
                                            {course.notes && (
                                              <div className="mt-2 text-sm text-gray-600">
                                                <strong>Notes:</strong> {course.notes}
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex flex-col space-y-2 ml-4">
                                            <div className="flex items-center space-x-2">
                                              <Checkbox
                                                checked={course.watched}
                                                onCheckedChange={(checked) => {
                                                  updateCourseWatchedMutation.mutate({
                                                    courseId: course.id,
                                                    watched: !!checked
                                                  });
                                                }}
                                              />
                                              <span className="text-sm">Watched</span>
                                            </div>
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => handleAssignDate(course)}
                                            >
                                              <CalendarIcon className="h-3 w-3 mr-1" />
                                              Assign Date
                                            </Button>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </CardContent>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Dialogs */}
        {/* Goal Dialog */}
        <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Study Goal</DialogTitle>
              <DialogDescription>Add a new learning objective</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g., Learn React Development"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => createGoalMutation.mutate({ goal_name: goalName })}>
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Subject Dialog */}
        <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
              <DialogDescription>Add a new subject to a study goal</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-select">Select Goal</Label>
                <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals?.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.goal_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject-name">Subject Name</Label>
                <Input
                  id="subject-name"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="e.g., JavaScript Fundamentals"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => createSubjectMutation.mutate({ 
                subject_name: subjectName, 
                goal_id: selectedGoalId 
              })}>
                Create Subject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Course Dialog */}
        <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Add a new course to a subject</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject-select">Select Subject</Label>
                <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.subject_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course-name">Course Name</Label>
                  <Input
                    id="course-name"
                    value={courseData.resource_name}
                    onChange={(e) => setCourseData({ ...courseData, resource_name: e.target.value })}
                    placeholder="e.g., React Basics Course"
                  />
                </div>
                <div>
                  <Label htmlFor="source-type">Source Type</Label>
                  <Select 
                    value={courseData.source_type} 
                    onValueChange={(value) => setCourseData({ ...courseData, source_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose source type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Book">Book</SelectItem>
                      <SelectItem value="Article">Article</SelectItem>
                      <SelectItem value="Course">Course</SelectItem>
                      <SelectItem value="Tutorial">Tutorial</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trainer">Trainer</Label>
                  <Input
                    id="trainer"
                    value={courseData.trainer}
                    onChange={(e) => setCourseData({ ...courseData, trainer: e.target.value })}
                    placeholder="Instructor name"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    step="0.5"
                    value={courseData.duration_hours}
                    onChange={(e) => setCourseData({ ...courseData, duration_hours: e.target.value })}
                    placeholder="2.5"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="link">Link (optional)</Label>
                <Input
                  id="link"
                  value={courseData.link}
                  onChange={(e) => setCourseData({ ...courseData, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={courseData.notes}
                  onChange={(e) => setCourseData({ ...courseData, notes: e.target.value })}
                  placeholder="Additional notes about this course"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCourseDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => createCourseMutation.mutate({ 
                ...courseData, 
                subject_id: selectedSubjectId,
                duration_hours: parseFloat(courseData.duration_hours) || 0
              })}>
                Create Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Date Dialog */}
        <Dialog open={isAssignDateOpen} onOpenChange={setIsAssignDateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Date to Course</DialogTitle>
              <DialogDescription>
                Create a todo item for: {selectedCourse?.resource_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Task Type</Label>
                <Select value={taskType} onValueChange={setTaskType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Study">Study</SelectItem>
                    <SelectItem value="Revision R1">Revision R1</SelectItem>
                    <SelectItem value="Revision R2">Revision R2</SelectItem>
                    <SelectItem value="Revision R3">Revision R3</SelectItem>
                    <SelectItem value="Revision R4">Revision R4</SelectItem>
                    <SelectItem value="Revision R5">Revision R5</SelectItem>
                    <SelectItem value="Revision R6">Revision R6</SelectItem>
                    <SelectItem value="Revision R7">Revision R7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assign Date</Label>
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
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={assignDate}
                      onSelect={setAssignDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTodo}>Assign Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <BottomNav />
    </div>
  );
};

export default StudyPlanPage;
