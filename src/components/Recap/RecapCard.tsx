
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, ChevronDown, ChevronUp, Clock, BookOpen, Target, Play } from 'lucide-react';
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
  lesson?: string;
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

  const getSourceIcon = (source: string) => {
    const lowerSource = source.toLowerCase();
    if (lowerSource.includes('youtube') || lowerSource.includes('video')) {
      return Play;
    }
    return Target;
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
      <Card className="group hover:shadow-md transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
        {/* Subject Color Bar */}
        <div className={`h-0.5 w-full bg-gradient-to-r ${getSubjectColor(log.subject)}`} />
        
        {/* Card Header */}
        <div className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Subject and Topic Line */}
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-3.5 w-3.5 text-gray-500" />
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-medium text-gray-800 text-sm">{log.subject}</h3>
                  {log.topic && (
                    <>
                      <span className="text-gray-400 text-xs">·</span>
                      <p className="text-sm text-gray-600">{log.topic}</p>
                    </>
                  )}
                </div>
              </div>
              
      
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 
                  <ChevronUp className="h-3.5 w-3.5 text-gray-400" /> : 
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                }
              </Button>
            </div>
          </div>
          
          {/* Preview Content - Show rich text preview when collapsed */}
          {!isExpanded && log.notes && (
            <div className="mt-2">
              <div className="text-xs text-gray-600 line-clamp-2">
                <SafeHtml 
                  html={log.notes.length > 150 ? log.notes.substring(0, 150) + '...' : log.notes}
                  className="text-xs text-gray-600"
                />
              </div>
            </div>
          )}
          
          {/* Quick Image Preview */}
          {!isExpanded && log.images && log.images.length > 0 && (
            <div className="mt-2 flex space-x-1.5">
              {log.images.slice(0, 4).map((src, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-md overflow-hidden border border-gray-200 cursor-pointer hover:scale-105 transition-transform"
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
              {log.images.length > 4 && (
                <div className="w-8 h-8 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
                  +{log.images.length - 4}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <CardContent className="pt-0 px-3 pb-3 space-y-3">
            {/* Lesson Display in Expanded View */}
            {log.lesson && log.lesson.toLowerCase() !== 'general' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-blue-900 underline decoration-blue-400 decoration-2 underline-offset-2">
                  {log.lesson}
                </h4>
              </div>
            )}
            
            {log.notes && (
              <div className="bg-gray-50/50 rounded-md p-3">
                <h4 className="text-xs font-medium text-gray-700 mb-2">
                  {log.lesson && log.lesson.toLowerCase() !== 'general' ? 'Notes' : 'Study Notes'}
                </h4>
                <SafeHtml 
                  html={log.notes}
                  className="text-gray-800"
                />
              </div>
            )}

            {log.achievements && (
              <div className="bg-green-50/50 rounded-md p-3">
                <h4 className="text-xs font-medium text-green-700 mb-2">Achievements</h4>
                <p className="text-sm text-green-800">{log.achievements}</p>
              </div>
            )}

            {log.images && log.images.length > 0 && (
              <div className="bg-blue-50/50 rounded-md p-3">
                <h4 className="text-xs font-medium text-blue-700 mb-2">Attachments ({log.images.length})</h4>
               
                <div className="mt-2 flex space-x-1.5">
                  {log.images.map((src, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-16 rounded-md overflow-hidden border border-blue-200 cursor-pointer hover:shadow-sm transition-all duration-200 group"
                      onClick={() => handleImageClick(i)}
                    >
                      <img
                        src={src}
                        alt={`attachment-${i}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'fallback.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 rounded-md" />
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
