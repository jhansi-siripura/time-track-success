
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
import { CreatableCombobox } from '@/components/ui/creatable-combobox';
import { useStudyAutocomplete } from '@/hooks/useStudyAutocomplete';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ImageUpload } from '@/components/ui/image-upload';

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
    duration: '',
    notes: '',
    achievements: '',
    images: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const {
    subjects,
    topics,
    sources,
    loadingSubjects,
    loadingTopics,
    loadingSources,
    fetchTopicsForSubject,
  } = useStudyAutocomplete();

  useEffect(() => {
    if (editingLog) {
      setFormData({
        subject: editingLog.subject || '',
        topic: editingLog.topic || '',
        source: editingLog.source || '',
        date: editingLog.date || '',
        time: editingLog.time || '',
        duration: editingLog.duration?.toString() || '',
        achievements: editingLog.achievements || '',
        notes: editingLog.notes || '',
        images: editingLog.images || [],
      });
      
      // Fetch topics for the subject if editing
      if (editingLog.subject) {
        fetchTopicsForSubject(editingLog.subject);
      }
    }
  }, [editingLog]);

  // Fetch topics when subject changes - but only when not editing initially
  useEffect(() => {
    if (formData.subject && !editingLog) {
      fetchTopicsForSubject(formData.subject);
    }
  }, [formData.subject, fetchTopicsForSubject, editingLog]);

  const handleInputChange = (field: string, value: string | number | string[]) => {
    if (field === 'duration') {
      // Only allow positive integers for duration
      const numValue = value.toString().replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [field]: numValue
      }));
    } else if (field === 'images') {
      setFormData(prev => ({
        ...prev,
        [field]: value as string[]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: typeof value === 'string' ? sanitizeInput(value) : value
      }));
    }
  };

  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subject: value,
      topic: '' // Reset topic when subject changes
    }));
    
    // Fetch topics for the new subject
    if (value) {
      fetchTopicsForSubject(value);
    }
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

    // Prepare data for submission
    const dataToSubmit = {
      ...formData,
      topic: formData.topic.trim() || 'General', // Default to "General" if empty
      duration: parseInt(formData.duration) || 0,
      user_id: user.id,
    };

    // Validate form data
    const validation = validateStudyLogData(dataToSubmit);
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <CreatableCombobox
                value={formData.subject}
                onValueChange={handleSubjectChange}
                options={subjects}
                placeholder="Select or type a subject..."
                emptyMessage="No subjects found."
                loading={loadingSubjects}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <CreatableCombobox
                value={formData.topic}
                onValueChange={(value) => handleInputChange('topic', value)}
                options={topics}
                placeholder={formData.subject ? "Select or type a topic (defaults to 'General')..." : "Select a subject first"}
                emptyMessage={formData.subject ? "No topics found for this subject." : "Select a subject first."}
                loading={loadingTopics}
                disabled={!formData.subject}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <CreatableCombobox
              value={formData.source}
              onValueChange={(value) => handleInputChange('source', value)}
              options={sources}
              placeholder="Select or type a source..."
              emptyMessage="No sources found."
              loading={loadingSources}
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
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 25"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <RichTextEditor
              value={formData.notes}
              onChange={(value) => handleInputChange('notes', value)}
              placeholder="Add your study notes, observations, or reflections..."
              maxLength={1000}
            />
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
            <Label>Images</Label>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => handleInputChange('images', images)}
              maxImages={3}
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
