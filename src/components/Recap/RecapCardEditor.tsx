
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';

interface StudyLog {
  id: number;
  date: string;
  time: string;
  duration: number;
  subject: string;
  topic?: string;
  source?: string;
  comments: string;
  achievements: string;
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
    comments: log.comments,
    achievements: log.achievements,
  });

  const sourceOptions = [
    'YouTube',
    'Udemy',
    'Book',
    'ChatGPT',
    'Documentation',
    'Course Material',
    'Practice Problems',
    'Tutorial',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
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
      comments: formData.comments,
      achievements: formData.achievements,
    };

    onSave(updatedData);
  };

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          Edit Study Session
          <div className="flex gap-2">
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
      <CardContent className="space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-subject">Subject</Label>
            <Input
              id="edit-subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Subject"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-topic">Topic</Label>
            <Input
              id="edit-topic"
              value={formData.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              placeholder="Topic (optional)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-source">Source</Label>
            <Select value={formData.source} onValueChange={(value) => handleInputChange('source', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No source</SelectItem>
                {sourceOptions.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-comments">Comments</Label>
          <Textarea
            id="edit-comments"
            value={formData.comments}
            onChange={(e) => handleInputChange('comments', e.target.value)}
            placeholder="Study notes and comments..."
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-achievements">Achievements</Label>
          <Textarea
            id="edit-achievements"
            value={formData.achievements}
            onChange={(e) => handleInputChange('achievements', e.target.value)}
            placeholder="What did you accomplish?"
            rows={3}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RecapCardEditor;
