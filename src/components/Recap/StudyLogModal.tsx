
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Target,
  Calendar
} from 'lucide-react';
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

interface StudyLogModalProps {
  log: StudyLog | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (logId: number, updatedData: Partial<StudyLog>) => void;
  onDelete: (logId: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const StudyLogModal: React.FC<StudyLogModalProps> = ({
  log,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!log) return null;

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleSave = (data: Partial<StudyLog>) => {
    onUpdate(log.id, data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this study log?')) {
      onDelete(log.id);
      onClose();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-gray-800">
                    {log.subject}
                    {log.topic && (
                      <span className="text-gray-600 font-normal"> • {log.topic}</span>
                    )}
                  </DialogTitle>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(log.date)} at {log.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{Math.floor(log.duration / 60)}h {log.duration % 60}m</span>
                    </div>
                    {log.source && (
                      <div className="flex items-center space-x-1">
                        <Target className="h-3.5 w-3.5" />
                        <span>{log.source}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Navigation and Action Buttons */}
              <div className="flex items-center space-x-2">
                {hasPrevious && onPrevious && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrevious}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                
                {hasNext && onNext && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onNext}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {isEditing ? (
              <RecapCardEditor 
                log={log} 
                onSave={handleSave} 
                onCancel={() => setIsEditing(false)} 
              />
            ) : (
              <>
                {/* Study Notes */}
                {log.notes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Study Notes
                    </h4>
                    <SafeHtml 
                      html={log.notes}
                      className="text-gray-800 leading-relaxed"
                    />
                  </div>
                )}

                {/* Achievements */}
                {log.achievements && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Achievements
                    </h4>
                    <p className="text-green-800 leading-relaxed">{log.achievements}</p>
                  </div>
                )}

                {/* Attachments */}
                {log.images && log.images.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Attachments ({log.images.length})
                    </h4>
                    <div className="grid grid-cols-6 gap-3">
                      {log.images.map((src, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden border border-blue-200 cursor-pointer hover:shadow-md transition-all duration-200 group"
                          onClick={() => handleImageClick(index)}
                        >
                          <img
                            src={src}
                            alt={`attachment-${index}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'fallback.png';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

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

export default StudyLogModal;
