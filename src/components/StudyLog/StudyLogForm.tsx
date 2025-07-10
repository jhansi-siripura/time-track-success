
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
import { validateAuthState, validateStudyLogData, sanitizeInput, sanitizeHtml, rateLimiter } from '@/lib/security';
import { CreatableCombobox } from '@/components/ui/creatable-combobox';
import { useStudyAutocomplete } from '@/hooks/useStudyAutocomplete';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ImageUpload } from '@/components/ui/image-upload';
import { PreviewModal } from './PreviewModal';
import { getTodayDate } from '@/lib/dateUtils';

interface StudyLogFormProps {
  editingLog?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const StudyLogForm: React.FC<StudyLogFormProps> = ({
  editingLog,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    source: '',
    date: getTodayDate(),
    time: new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    duration: '',
    notes: '',
    achievements: '',
    images: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const {
    user
  } = useAuth();
  const {
    subjects,
    topics,
    sources,
    loadingSubjects,
    loadingTopics,
    loadingSources,
    fetchTopicsForSubject
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
        images: editingLog.images || []
      });
      if (editingLog.subject) {
        fetchTopicsForSubject(editingLog.subject);
      }
    }
  }, [editingLog]);

  useEffect(() => {
    if (formData.subject && !editingLog) {
      fetchTopicsForSubject(formData.subject);
    }
  }, [formData.subject, fetchTopicsForSubject, editingLog]);

  const handleInputChange = (field: string, value: string | number | string[]) => {
    if (field === 'duration') {
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
    } else if (field === 'notes') {
      // Sanitize HTML content for rich text
      const sanitizedHtml = sanitizeHtml(value as string);
      setFormData(prev => ({
        ...prev,
        notes: sanitizedHtml
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: typeof value === 'string' ? sanitizeInput(value) : value
      }));
    }
  };

  const handleSubjectChange = (value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({
      ...prev,
      subject: sanitizedValue,
      topic: ''
    }));
    if (sanitizedValue) {
      fetchTopicsForSubject(sanitizedValue);
    }
  };

  const validateRequiredFields = () => {
    const errors: string[] = [];
    if (!formData.subject.trim()) errors.push('Subject is required');
    if (!formData.date) errors.push('Date is required');
    if (!formData.time) errors.push('Time is required');
    if (!formData.duration || parseInt(formData.duration) <= 0) errors.push('Duration is required and must be greater than 0');
    return errors;
  };

  const shouldShowPreview = () => {
    const hasNotes = formData.notes && formData.notes.trim() !== '';
    const hasImages = formData.images && formData.images.length > 0;
    return hasNotes || hasImages;
  };

  const performSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save study logs",
        variant: "destructive"
      });
      return;
    }

    // Rate limiting check with endpoint-specific tracking
    if (!rateLimiter.canMakeRequest(user.id, 'study-log-submit')) {
      toast({
        title: "Too Many Requests",
        description: "Please wait before submitting another study log",
        variant: "destructive"
      });
      return;
    }

    // Validate authentication state
    const authValidation = await validateAuthState();
    if (!authValidation.isValid) {
      toast({
        title: "Authentication Error",
        description: authValidation.error || "Please log in again",
        variant: "destructive"
      });
      return;
    }

    // Prepare data for submission with additional sanitization
    const dataToSubmit = {
      ...formData,
      subject: sanitizeInput(formData.subject),
      topic: formData.topic ? sanitizeInput(formData.topic) : 'General',
      source: formData.source ? sanitizeInput(formData.source) : null,
      achievements: formData.achievements ? sanitizeInput(formData.achievements) : null,
      notes: formData.notes ? sanitizeHtml(formData.notes) : null,
      duration: parseInt(formData.duration) || 0,
      user_id: user.id
    };

    // Enhanced validation
    const validation = validateStudyLogData(dataToSubmit);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      if (editingLog) {
        const {
          error
        } = await supabase.from('study_logs').update(dataToSubmit).eq('id', editingLog.id).eq('user_id', user.id);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Study log updated successfully!"
        });
      } else {
        const {
          error
        } = await supabase.from('study_logs').insert([dataToSubmit]);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Study log created successfully!"
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error('Study log submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save study log",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRequiredFields();
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(', '),
        variant: "destructive"
      });
      return;
    }
    if (shouldShowPreview()) {
      setShowPreview(true);
    } else {
      await performSave();
    }
  };

  const handlePreviewConfirm = async () => {
    setShowPreview(false);
    await performSave();
  };

  const handlePreviewCancel = () => {
    setShowPreview(false);
  };

  return <>
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="border-b border-gray-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel} 
              className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {editingLog ? 'Edit Study Session' : 'Add Study Session'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject, Topic, Source Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Subject *</Label>
                <CreatableCombobox 
                  value={formData.subject} 
                  onValueChange={handleSubjectChange} 
                  options={subjects} 
                  placeholder="Select or type a subject... *" 
                  emptyMessage="No subjects found." 
                  loading={loadingSubjects} 
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Topic</Label>
                <CreatableCombobox 
                  value={formData.topic} 
                  onValueChange={value => handleInputChange('topic', value)} 
                  options={topics} 
                  placeholder={formData.subject ? "Select or type a topic..." : "Select a subject first"} 
                  emptyMessage={formData.subject ? "No topics found for this subject." : "Select a subject first."} 
                  loading={loadingTopics} 
                  disabled={!formData.subject} 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Source</Label>
                <CreatableCombobox 
                  value={formData.source} 
                  onValueChange={value => handleInputChange('source', value)} 
                  options={sources} 
                  placeholder="Select or type a source..." 
                  emptyMessage="No sources found." 
                  loading={loadingSources} 
                />
              </div>
            </div>

            {/* Date, Time, Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Date *</Label>
                <Input 
                  type="date" 
                  value={formData.date} 
                  onChange={e => handleInputChange('date', e.target.value)} 
                  required 
                  className="border-gray-200 bg-white focus:border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Time *</Label>
                <Input 
                  type="time" 
                  value={formData.time} 
                  onChange={e => handleInputChange('time', e.target.value)} 
                  required 
                  className="border-gray-200 bg-white focus:border-gray-300"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Duration (minutes) *</Label>
                <Input 
                  type="text" 
                  value={formData.duration} 
                  onChange={e => handleInputChange('duration', e.target.value)} 
                  placeholder="Duration (minutes) *" 
                  required 
                  className="border-gray-200 bg-white focus:border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
              <div className="border border-gray-200 rounded-lg bg-white">
                <RichTextEditor 
                  value={formData.notes} 
                  onChange={value => handleInputChange('notes', value)} 
                  placeholder="Add your study notes, observations, or reflections..." 
                  maxLength={1000} 
                />
              </div>
            </div>

            {/* Achievements and Images side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="achievements" className="text-sm font-medium text-gray-700">Achievements</Label>
                <Textarea 
                  id="achievements" 
                  value={formData.achievements} 
                  onChange={e => handleInputChange('achievements', e.target.value)} 
                  placeholder="What did you accomplish in this session?" 
                  rows={6} 
                  maxLength={500} 
                  className="border-gray-200 bg-white focus:border-gray-300 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Images</Label>
                <div className="border border-gray-200 rounded-lg bg-white p-4">
                  <ImageUpload 
                    images={formData.images} 
                    onImagesChange={images => handleInputChange('images', images)} 
                    maxImages={3} 
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-100">
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
              >
                {loading ? 'Saving...' : editingLog ? 'Update Session' : 'Save Session'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                disabled={loading} 
                className="flex-1 h-11 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PreviewModal 
        isOpen={showPreview} 
        onClose={handlePreviewCancel} 
        onConfirm={handlePreviewConfirm} 
        formData={formData} 
      />
    </>;
};

export default StudyLogForm;
