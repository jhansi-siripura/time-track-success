
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ImageUpload } from '@/components/ui/image-upload';
import { CreatableCombobox } from '@/components/ui/creatable-combobox';
import { PreviewModal } from '@/components/StudyLog/PreviewModal';
import { Save, X, Eye } from 'lucide-react';
import { useStudyAutocomplete } from '@/hooks/useStudyAutocomplete';

interface StudyLog {
  id: number;
  date: string;
  time: string;
  duration: number;
  subject: string;
  topic?: string;
  source?: string;
  notes: string;
  achievements: string;
  images?: string[];
}

interface RecapCardEditorProps {
  log: StudyLog;
  onSave: (updatedData: Partial<StudyLog>) => void;
  onCancel: () => void;
}

const RecapCardEditor: React.FC<RecapCardEditorProps> = ({ log, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: log.date,
    time: log.time,
    duration: log.duration.toString(),
    subject: log.subject,
    topic: log.topic || '',
    source: log.source || '',
    notes: log.notes,
    achievements: log.achievements,
    images: log.images || [],
  });

  const [showPreview, setShowPreview] = useState(false);
  const { subjects, topics, sources, fetchTopicsForSubject } = useStudyAutocomplete();

  // Fetch topics when subject changes
  useEffect(() => {
    if (formData.subject) {
      fetchTopicsForSubject(formData.subject);
    }
  }, [formData.subject, fetchTopicsForSubject]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const updatedData = {
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration) || 0,
      subject: formData.subject,
      topic: formData.topic || null,
      source: formData.source || null,
      notes: formData.notes,
      achievements: formData.achievements,
      images: formData.images,
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

  const shouldShowPreview = formData.notes.trim() || formData.images.length > 0;

  return (
    <>
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center justify-between">
            Edit Study Session
            <div className="flex gap-2">
              {shouldShowPreview && (
                <Button onClick={handlePreview} variant="outline" size="sm" className="h-8">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              )}
              <Button onClick={handleSave} size="sm" className="h-8">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button onClick={onCancel} variant="outline" size="sm" className="h-8">
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date, Time, Duration Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-time">Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration (minutes)</Label>
              <Input
                id="edit-duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
              />
            </div>
          </div>

          {/* Subject, Topic, Source Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject</Label>
              <CreatableCombobox
                value={formData.subject}
                onValueChange={(value) => handleInputChange('subject', value)}
                options={subjects}
                placeholder="Select or create subject..."
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-topic">Topic</Label>
              <CreatableCombobox
                value={formData.topic}
                onValueChange={(value) => handleInputChange('topic', value)}
                options={topics}
                placeholder="Select or create topic..."
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-source">Source</Label>
              <CreatableCombobox
                value={formData.source}
                onValueChange={(value) => handleInputChange('source', value)}
                options={sources}
                placeholder="Select or create source..."
                className="w-full"
              />
            </div>
          </div>

          {/* Rich Text Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <RichTextEditor
              value={formData.notes}
              onChange={(value) => handleInputChange('notes', value)}
              placeholder="Write your study notes here..."
              maxLength={2000}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Images</Label>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => handleInputChange('images', images)}
              maxImages={3}
            />
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <Label htmlFor="edit-achievements">Achievements</Label>
            <RichTextEditor
              value={formData.achievements}
              onChange={(value) => handleInputChange('achievements', value)}
              placeholder="What did you accomplish?"
              maxLength={1000}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handlePreviewConfirm}
        formData={{
          subject: formData.subject,
          topic: formData.topic,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
          images: formData.images,
        }}
      />
    </>
  );
};

export default RecapCardEditor;
