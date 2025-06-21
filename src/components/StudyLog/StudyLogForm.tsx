
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { validateAuthState, validateStudyLogData, sanitizeInput, rateLimiter } from '@/lib/security';

interface StudyLogFormProps {
  editingLog?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const StudyLogForm: React.FC<StudyLogFormProps> = ({ editingLog, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    duration: 0,
    achievements: '',
    comments: '',
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (editingLog) {
      setFormData({
        subject: editingLog.subject || '',
        topic: editingLog.topic || '',
        source: editingLog.source || '',
        date: editingLog.date || '',
        time: editingLog.time || '',
        duration: editingLog.duration || 0,
        achievements: editingLog.achievements || '',
        comments: editingLog.comments || '',
      });
    }
  }, [editingLog]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? sanitizeInput(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save study logs",
        variant: "destructive",
      });
      return;
    }

    // Rate limiting check
    if (!rateLimiter.canMakeRequest(user.id)) {
      toast({
        title: "Too Many Requests",
        description: "Please wait before submitting another study log",
        variant: "destructive",
      });
      return;
    }

    // Validate authentication state
    const authValidation = await validateAuthState();
    if (!authValidation.isValid) {
      toast({
        title: "Authentication Error",
        description: authValidation.error || "Please log in again",
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    const validation = validateStudyLogData(formData);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        user_id: user.id, // Ensure user_id is always set
      };

      if (editingLog) {
        const { error } = await supabase
          .from('study_logs')
          .update(dataToSubmit)
          .eq('id', editingLog.id)
          .eq('user_id', user.id); // Additional security check

        if (error) throw error;

        toast({
          title: "Success",
          description: "Study log updated successfully!",
        });
      } else {
        const { error } = await supabase
          .from('study_logs')
          .insert([dataToSubmit]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Study log created successfully!",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Study log submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save study log",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>
            {editingLog ? 'Edit Study Session' : 'Add Study Session'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="e.g., Mathematics, Physics"
                required
                maxLength={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                type="text"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="e.g., Calculus, Thermodynamics"
                maxLength={100}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              type="text"
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
              placeholder="e.g., Textbook, Online Course, Video"
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="1440"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                placeholder="e.g., 60"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Achievements</Label>
            <Textarea
              id="achievements"
              value={formData.achievements}
              onChange={(e) => handleInputChange('achievements', e.target.value)}
              placeholder="What did you accomplish in this session?"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              placeholder="Any additional notes or observations"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : (editingLog ? 'Update Session' : 'Save Session')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudyLogForm;
