
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, ChevronDown, ChevronUp, Clock, Calendar, BookOpen, Target } from 'lucide-react';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { SafeHtml } from '@/components/ui/safe-html';
import RecapCardEditor from './RecapCardEditor';

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

interface RecapCardProps {
  log: StudyLog;
  onUpdate: (logId: number, updatedData: Partial<StudyLog>) => void;
  onDelete: (logId: number) => void;
}

const RecapCard: React.FC<RecapCardProps> = ({ log, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const [h, mm] = timeStr.split(':').map(Number);
      const dt = new Date(y, m - 1, d, h, mm);
      const ampm = dt.getHours() >= 12 ? 'PM' : 'AM';
      const h12 = dt.getHours() % 12 === 0 ? 12 : dt.getHours() % 12;
      const month = dt.toLocaleString('en-US', { month: 'short' });
      return `${dt.getDate()} ${month}, ${h12}:${mm.toString().padStart(2, '0')} ${ampm}`;
    } catch (e) {
      return `${dateStr} ${timeStr}`;
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600'
    ];
    const hash = subject.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getImageGridLayout = (count: number) =>
    count === 1 ? 'grid-cols-1' : count === 2 ? 'grid-cols-2' : 'grid-cols-3';

  const handleImageClick = (i: number) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };

  const handleSave = (data: Partial<StudyLog>) => {
    onUpdate(log.id, data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this study log?')) onDelete(log.id);
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <RecapCardEditor log={log} onSave={handleSave} onCancel={() => setIsEditing(false)} />
        <div className="flex justify-end">
          <Button variant="destructive" size="sm" onClick={handleDelete} className="h-8">
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden transform hover:-translate-y-1 relative">
        {/* Subject Color Bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${getSubjectColor(log.subject)}`} />
        
        {/* Card Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Subject Badge */}
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getSubjectColor(log.subject)} flex items-center justify-center shadow-sm`}>
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{log.subject}</h3>
                  {log.topic && (
                    <p className="text-sm text-gray-600">{log.topic}</p>
                  )}
                </div>
              </div>
              
              {/* Meta Information */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDateTime(log.date, log.time)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{log.duration} min</span>
                </div>
                {log.source && (
                  <div className="flex items-center space-x-1">
                    <Target className="h-3 w-3" />
                    <span className="truncate max-w-24">{log.source}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 
                  <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                }
              </Button>
            </div>
          </div>
          
          {/* Preview Content */}
          {!isExpanded && log.notes && (
            <div className="mt-2">
              <SafeHtml 
                html={log.notes.substring(0, 120) + (log.notes.length > 120 ? '...' : '')}
                className="text-sm text-gray-700 line-clamp-2 prose prose-sm max-w-none"
              />
            </div>
          )}
          
          {/* Quick Image Preview */}
          {!isExpanded && log.images && log.images.length > 0 && (
            <div className="mt-3 flex space-x-2">
              {log.images.slice(0, 3).map((src, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleImageClick(i)}
                >
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'fallback.png';
                    }}
                  />
                </div>
              ))}
              {log.images.length > 3 && (
                <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-xs text-gray-500 font-medium">
                  +{log.images.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <CardContent className="pt-0 px-4 pb-4 space-y-4">
            {log.notes && (
              <div className="bg-gray-50/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Study Notes</h4>
                <SafeHtml 
                  html={log.notes}
                  className="prose prose-sm max-w-none text-gray-800"
                />
              </div>
            )}

            {log.achievements && (
              <div className="bg-green-50/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-700 mb-2">Achievements</h4>
                <p className="text-sm text-green-800">{log.achievements}</p>
              </div>
            )}

            {log.images && log.images.length > 0 && (
              <div className="bg-blue-50/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-700 mb-3">Attachments ({log.images.length})</h4>
                <div className={`grid ${getImageGridLayout(log.images.length)} gap-3`}>
                  {log.images.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden border border-blue-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 group"
                      onClick={() => handleImageClick(i)}
                    >
                      <img
                        src={src}
                        alt={`attachment-${i}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'fallback.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {log.images && log.images.length > 0 && (
        <ImageLightbox
          images={log.images}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
};

export default RecapCard;
