import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ImageUpload } from '@/components/ui/image-upload';
import { CreatableCombobox } from '@/components/ui/creatable-combobox';
import { PreviewModal } from '@/components/StudyLog/PreviewModal';
import { Save, X, Eye, Trash2 } from 'lucide-react';
import { useStudyAutocomplete } from '@/hooks/useStudyAutocomplete';
interface StudyLog {
  id: number;
  date: string;
  time: string;
  duration: number;
  subject: string;
  topic?: string;
  lesson?: string;
  source?: string;
  notes: string;
  achievements: string;
  images?: string[];
}
interface RecapCardEditorProps {
  log: StudyLog;
  onSave: (updatedData: Partial<StudyLog>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}
const RecapCardEditor: React.FC<RecapCardEditorProps> = ({
  log,
  onSave,
  onCancel,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    date: log.date || '',
    time: log.time || '',
    duration: (log.duration || 0).toString(),
    subject: log.subject || '',
    topic: log.topic || '',
    lesson: log.lesson || '',
    source: log.source || '',
    notes: log.notes || '',
    achievements: log.achievements || '',
    images: Array.isArray(log.images) ? log.images : []
  });
  const [showPreview, setShowPreview] = useState(false);
  const {
    subjects,
    topics,
    lessons,
    sources,
    fetchTopicsForSubject,
    fetchLessonsForTopic
  } = useStudyAutocomplete();

  // Fetch topics when subject changes
  useEffect(() => {
    if (formData.subject) {
      fetchTopicsForSubject(formData.subject);
    }
  }, [formData.subject, fetchTopicsForSubject]);

  // Fetch lessons when topic changes
  useEffect(() => {
    if (formData.topic) {
      fetchLessonsForTopic(formData.topic);
    }
  }, [formData.topic, fetchLessonsForTopic]);
  const handleInputChange = (field: string, value: string | string[]) => {
    if (field === 'subject') {
      setFormData(prev => ({
        ...prev,
        subject: value as string,
        topic: '',
        lesson: ''
      }));
    } else if (field === 'topic') {
      setFormData(prev => ({
        ...prev,
        topic: value as string,
        lesson: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  const handleSave = () => {
    const updatedData = {
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration) || 0,
      subject: formData.subject,
      topic: formData.topic || null,
      lesson: formData.lesson || null,
      source: formData.source || null,
      notes: formData.notes,
      achievements: formData.achievements,
      images: Array.isArray(formData.images) ? formData.images : []
    };
    onSave(updatedData);
  };
  const handlePreview = () => {
    setShowPreview(true);
  };
  const handlePreviewConfirm = () => {
    setShowPreview(false);
    handleSave();
  };
  const shouldShowPreview = formData.notes && formData.notes.trim() || Array.isArray(formData.images) && formData.images.length > 0;
  return <>
      <Card className="border-amber-200 shadow-lg bg-gradient-to-br from-amber-50/50 to-yellow-50/30 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="text-amber-800">Edit Study Session</span>
            <div className="flex gap-2">
              {shouldShowPreview && <Button onClick={handlePreview} variant="outline" size="sm" className="h-8 border-amber-200 text-amber-700 hover:bg-amber-50">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>}
              <Button onClick={handleSave} size="sm" className="h-8 bg-amber-500 hover:bg-amber-600 text-white">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button onClick={onCancel} variant="outline" size="sm" className="h-8 border-amber-200 text-amber-700 hover:bg-amber-50">
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              {onDelete && <Button onClick={onDelete} variant="outline" size="sm" className="h-8 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subject, Topic, Lesson, Source Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CreatableCombobox value={formData.subject} onValueChange={value => handleInputChange('subject', value)} options={subjects} placeholder="Select or type a subject..." className="w-full" />
            
            <CreatableCombobox value={formData.topic} onValueChange={value => handleInputChange('topic', value)} options={topics} placeholder="Select or type a topic..." className="w-full" disabled={!formData.subject} />

            <CreatableCombobox value={formData.lesson} onValueChange={value => handleInputChange('lesson', value)} options={lessons} placeholder="Select or type a lesson..." className="w-full" disabled={!formData.topic} />
            
            <CreatableCombobox value={formData.source} onValueChange={value => handleInputChange('source', value)} options={sources} placeholder="Select or type a source..." className="w-full" />
          </div>

          {/* Date, Time, Duration Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input type="date" value={formData.date} onChange={e => handleInputChange('date', e.target.value)} />
            
            <Input type="time" value={formData.time} onChange={e => handleInputChange('time', e.target.value)} />
            
            <Input type="number" min="1" value={formData.duration} onChange={e => handleInputChange('duration', e.target.value)} placeholder="Duration (minutes)" />
          </div>

          {/* Rich Text Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <RichTextEditor value={formData.notes} onChange={value => handleInputChange('notes', value)} placeholder="Write your study notes here..." maxLength={5000} />
          </div>

          {/* Achievements and Images side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="edit-achievements">Achievements</Label>
              <Textarea id="edit-achievements" value={formData.achievements} onChange={e => handleInputChange('achievements', e.target.value)} placeholder="What did you accomplish?" rows={6} maxLength={1000} />
              <div className="text-xs text-muted-foreground">
                {(formData.achievements || '').length} / 1000 characters
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <ImageUpload images={Array.isArray(formData.images) ? formData.images : []} onImagesChange={images => handleInputChange('images', Array.isArray(images) ? images : [])} maxImages={3} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <PreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} onConfirm={handlePreviewConfirm} formData={{
      subject: formData.subject,
      topic: formData.topic,
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
      images: Array.isArray(formData.images) ? formData.images : []
    }} />
    </>;
};
export default RecapCardEditor;