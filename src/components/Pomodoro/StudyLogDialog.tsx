
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { SessionType } from '@/hooks/usePomodoroTimer';

interface StudyLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionType: SessionType;
  duration: number; // in minutes
  cycle: number;
}

const StudyLogDialog: React.FC<StudyLogDialogProps> = ({
  open,
  onOpenChange,
  sessionType,
  duration,
  cycle,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = React.useState({
    subject: '',
    topic: '',
    notes: '',
    achievements: '',
  });

  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0].slice(0, 5);

  const createStudyLog = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('study_logs').insert({
        user_id: user.id,
        date: currentDate,
        time: currentTime,
        duration: Math.round(duration),
        subject: data.subject,
        topic: data.topic,
        notes: data.notes,
        achievements: data.achievements,
        session_type: sessionType === 'focus' ? 'pomodoro_focus' : 'pomodoro_break',
        pomodoro_cycle: cycle,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-logs'] });
      toast.success('Study session logged successfully!');
      onOpenChange(false);
      setFormData({ subject: '', topic: '', notes: '', achievements: '' });
    },
    onError: (error) => {
      toast.error('Failed to log study session');
      console.error('Error logging study session:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    createStudyLog.mutate(formData);
  };

  const handleSkip = () => {
    onOpenChange(false);
    setFormData({ subject: '', topic: '', notes: '', achievements: '' });
  };

  // Only show dialog for focus sessions
  if (sessionType !== 'focus') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Your Study Session</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Date:</strong> {currentDate}
            </div>
            <div>
              <strong>Time:</strong> {currentTime}
            </div>
            <div>
              <strong>Duration:</strong> {Math.round(duration)} minutes
            </div>
            <div>
              <strong>Cycle:</strong> {cycle}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g., Mathematics, Programming, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="e.g., Calculus, React Hooks, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="What did you learn or work on?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Achievements</Label>
            <Textarea
              id="achievements"
              value={formData.achievements}
              onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
              placeholder="What did you accomplish?"
              rows={2}
            />
          </div>

          <div className="flex space-x-3">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createStudyLog.isPending}
            >
              {createStudyLog.isPending ? 'Logging...' : 'Log Session'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1"
            >
              Skip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudyLogDialog;
