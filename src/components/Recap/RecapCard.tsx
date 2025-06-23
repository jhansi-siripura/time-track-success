// RecapCard.tsx
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

  /** Format "YYYY-MM-DD" + "HH:mm" → "8-Jun-2025 10 AM" */
  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const [h, mm] = timeStr.split(':').map(Number);
      const dt = new Date(y, m - 1, d, h, mm);
      const ampm = dt.getHours() >= 12 ? 'PM' : 'AM';
      const h12 = dt.getHours() % 12 === 0 ? 12 : dt.getHours() % 12;
      const month = dt.toLocaleString('en-US', { month: 'short' });
      return `${dt.getDate()}-${month}-${dt.getFullYear()} ${h12} ${ampm}`;
    } catch (e) {
      return `${dateStr} ${timeStr}`;
    }
  };

  /** Stable colour per subject */
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

  /** 1 → 1col, 2 → 2col, ≥3 → 3col */
  const getImageGridLayout = (count: number) =>
    count === 1 ? 'grid-cols-1' : count === 2 ? 'grid-cols-2' : 'grid-cols-3';

  /* ---------- handlers ---------- */
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

  /* ---------- edit mode ---------- */
  if (isEditing) {
    return (
      <div className="space-y-4">
        <RecapCardEditor log={log} onSave={handleSave} onCancel={() => setIsEditing(false)} />
        <div className="flex justify-end">
          <Button variant="destructive" size="sm" onClick={handleDelete} className="h-8">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    );
  }

  /* ---------- display mode ---------- */
  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        {/* ░░ HEADER  ░░ */}
        <div className="bg-gray-600 px-4 py-2 flex justify-between items-start rounded-t-md border-b border-gray-200">
          {/* date / time */}
          <div className="text-sm text-gray-600 font-medium tracking-tight">
            {formatDateTime(log.date, log.time)}
          </div>

          {/* badges + buttons */}
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge className={getSubjectColor(log.subject)}>{log.subject}</Badge>
              {log.topic && (
                <Badge variant="outline" className="bg-white text-gray-800 border-gray-300">
                  {log.topic}
                </Badge>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* ░░ BODY  ░░ */}
        {isExpanded && (
          <CardContent className="bg-white p-6 space-y-5">
            {log.notes && (
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: log.notes }}
                style={{ lineHeight: '1.6' }}
              />
            )}

            {log.images?.length ? (
              <div className="pt-4 border-t border-gray-100">
                <div className="mb-3 text-sm font-medium text-gray-600">
                  Attachments ({log.images.length})
                </div>
                <div className={`grid ${getImageGridLayout(log.images.length)} gap-2 w-fit`}>
                  {log.images.map((src, i) => (
                    <div
                      key={i}
                      className="group relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={() => handleImageClick(i)}
                    >
                      <img
                        src={src}
                        alt={`log-img-${i}`}
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
            ) : null}
          </CardContent>
        )}
      </Card>

      {/* lightbox */}
      {log.images?.length && (
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