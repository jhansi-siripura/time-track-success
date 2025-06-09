
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface StudyLogFormProps {
  editingLog?: any;
  onSuccess: () => void;
  onCancel?: () => void;
}

const StudyLogForm: React.FC<StudyLogFormProps> = ({ editingLog, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '',
    subject: '',
    topic: '',
    source: '',
    comments: '',
    achievements: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const sourceOptions = [
    'YouTube',
    'Udemy',
    'Book',
    'ChatGPT',
    'Documentation',
    'Course Material',
    'Practice Problems',
    'Tutorial',
    'LinkedIn',
    'Other'
  ];

  useEffect(() => {
    if (editingLog) {
      setFormData({
        date: editingLog.date || '',
        time: editingLog.time || '',
        duration: editingLog.duration?.toString() || '',
        subject: editingLog.subject || '',
        topic: editingLog.topic || '',
        source: editingLog.source || '',
        comments: editingLog.comments || '',
        achievements: editingLog.achievements || '',
      });
    } else {
      // Set current date and time for new entries
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);
      setFormData(prev => ({
        ...prev,
        date: currentDate,
        time: currentTime,
      }));
    }
  }, [editingLog]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const studyLogData = {
      user_id: user.id,
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration) || 0,
      subject: formData.subject,
      topic: formData.topic || null,
      source: formData.source || null,
      comments: formData.comments,
      achievements: formData.achievements,
    };

    try {
      if (editingLog) {
        const { error } = await supabase
          .from('study_logs')
          .update(studyLogData)
          .eq('id', editingLog.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Study log updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from('study_logs')
          .insert([studyLogData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Study log added successfully!",
        });

        // Reset form for new entries
        setFormData({
          date: formData.date,
          time: '',
          duration: '',
          subject: '',
          topic: '',
          source: '',
          comments: '',
          achievements: '',
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingLog ? 'Edit Study Log' : 'Add Study Session'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="60"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Mathematics, Physics, etc."
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select learning source" />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic (Optional)</Label>
              <Input
                id="topic"
                type="text"
                placeholder="e.g., Java 8 Streams, Calculus Integration"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Achievements</Label>
            <Textarea
              id="achievements"
              placeholder="What did you accomplish in this session?"
              value={formData.achievements}
              onChange={(e) => handleInputChange('achievements', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              placeholder="Additional notes about this study session"
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingLog ? 'Update' : 'Add Session')}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudyLogForm;
