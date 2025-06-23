
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageLightbox } from '@/components/ui/image-lightbox';
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Helper to format date and time as: 8-Jun-2025 10 AM
  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      // dateStr is "YYYY-MM-DD", timeStr is "HH:mm", combine into JS Date
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = timeStr.split(':').map(Number);
      const dateObj = new Date(year, month - 1, day, hour, minute);

      // Get day, abbreviated month, year, 12h hour and AM/PM
      const dayNum = dateObj.getDate();
      const monthShort = dateObj.toLocaleString('en-US', { month: 'short' });
      const yearNum = dateObj.getFullYear();
      let hourNum = dateObj.getHours();
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;

      return `${dayNum}-${monthShort}-${yearNum} ${hour12} ${ampm}`;
    } catch (e) {
      return dateStr + ' ' + timeStr;
    }
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

  const getImageGridLayout = (imageCount: number) => {
    switch (imageCount) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      default:
        return 'grid-cols-3';
    }
  };

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleSave = (updatedData: Partial<StudyLog>) => {
    onUpdate(log.id, updatedData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this study log?')) {
      onDelete(log.id);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <RecapCardEditor
          log={log}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="h-8"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            {/* DATE/TIME on the top-left */}
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium tracking-tight">
                {formatDateTime(log.date, log.time)}
              </div>
            </div>
            {/* Subject and Topic on the top-right */}
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-2">
                <Badge className={getSubjectColor(log.subject)}>
                  {log.subject}
                </Badge>
                {log.topic && (
                  <Badge variant="outline" className="bg-gray-50">
                    {log.topic}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 p-0"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-5">
              {/* Rich Text Notes Section */}
              {log.notes && (
                <div>
                  <div 
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: log.notes }}
                    style={{
                      lineHeight: '1.6'
                    }}
                  />
                </div>
              )}

              {/* Images Section with improved spacing and smaller thumbnails */}
              {log.images && log.images.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      Attachments ({log.images.length})
                    </span>
                  </div>
                  <div className={`grid ${getImageGridLayout(log.images.length)} gap-2 w-fit`}>
                    {log.images.map((imageUrl, index) => (
                      <div 
                        key={index} 
                        className="group relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                        onClick={() => handleImageClick(index)}
                      >
                        <img
                          src={imageUrl}
                          alt={`Study session image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyVjE5QTIgMiAwIDAgMSAxOSAyMUg1QTIgMiAwIDAgMSAzIDE5VjVBMiAyIDAgMCAxIDUgM0gxMiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHN2Zz4K';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Lightbox */}
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
