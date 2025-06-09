
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import RecapCardEditor from './RecapCardEditor';

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

interface RecapCardProps {
  log: StudyLog;
  onUpdate: (logId: number, updatedData: Partial<StudyLog>) => void;
  onDelete: (logId: number) => void;
}

const RecapCard: React.FC<RecapCardProps> = ({ log, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSubjectColor = (subject: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ];
    const hash = subject.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handleSave = (updatedData: Partial<StudyLog>) => {
    onUpdate(log.id, updatedData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <RecapCardEditor
        log={log}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              {formatDate(log.date)} • {log.time}
            </div>
            <div className="text-sm text-gray-500">
              {formatDuration(log.duration)}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(log.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getSubjectColor(log.subject)}>
            {log.subject}
          </Badge>
          {log.topic && (
            <Badge variant="outline" className="bg-gray-50">
              {log.topic}
            </Badge>
          )}
          {log.source && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {log.source}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {log.comments && (
            <div>
              <div className="prose prose-sm max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                  style={{ lineHeight: '1.6' }}
                >
                  {log.comments}
                </div>
              </div>
            </div>
          )}

          {log.achievements && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-green-800 mb-1">Achievements</h4>
              <div className="text-sm text-green-700 whitespace-pre-wrap">
                {log.achievements}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecapCard;
