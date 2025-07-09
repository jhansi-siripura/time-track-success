
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, ChevronLeft, ChevronRight, Clock, BookOpen, Target, Calendar, X } from 'lucide-react';
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

  const getSubjectColor = (subject: string) => {
    const colors = ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600', 'from-indigo-500 to-indigo-600'];
    const hash = subject.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

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

  // Prevent dialog from closing when lightbox is open
  const handleDialogOpenChange = (open: boolean) => {
    if (!lightboxOpen) {
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          {/* Subject Color Bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getSubjectColor(log.subject)} rounded-t-lg`} />
          
          {/* Navigation Arrows */}
          {hasPrevious && onPrevious && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPrevious} 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 bg-white/80 hover:bg-white/90 shadow-md rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          {hasNext && onNext && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNext} 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 bg-white/80 hover:bg-white/90 shadow-md rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          <DialogHeader className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold text-gray-800">
                    {log.subject}
                    {log.topic && <span className="text-gray-600 font-normal"> • {log.topic}</span>}
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
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{log.source}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-6 px-6">
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
                  <div className="bg-gray-50/80 rounded-lg p-4 border border-gray-200/50">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Study Notes
                    </h4>
                    <SafeHtml html={log.notes} className="text-gray-800 leading-relaxed" />
                  </div>
                )}

                {/* Achievements */}
                {log.achievements && (
                  <div className="bg-green-50/80 rounded-lg p-4 border border-green-200/50">
                    <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Achievements
                    </h4>
                    <p className="text-green-800 leading-relaxed">{log.achievements}</p>
                  </div>
                )}

                {/* Attachments */}
                {log.images && log.images.length > 0 && (
                  <div className="bg-blue-50/80 rounded-lg p-4 border border-blue-200/50">
                    <h4 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Attachments ({log.images.length})
                    </h4>
                    <div className="grid grid-cols-6 gap-3">
                      {log.images.map((src, index) => (
                        <div 
                          key={index} 
                          className="relative aspect-square rounded-lg overflow-hidden border border-blue-200 cursor-pointer hover:shadow-md transition-all duration-200 group" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageClick(index);
                          }}
                        >
                          <img 
                            src={src} 
                            alt={`attachment-${index}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
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

      {/* Image Lightbox - will appear above the modal */}
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
