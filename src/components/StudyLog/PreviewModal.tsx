
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SafeHtml } from '@/components/ui/safe-html';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: {
    subject: string;
    topic: string;
    date: string;
    time: string;
    notes: string;
    images: string[];
  };
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  formData
}) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getImageGridLayout = (imageCount: number) => {
    switch (imageCount) {
      case 1:
        return 'grid-cols-1 max-w-md mx-auto';
      case 2:
        return 'grid-cols-2 gap-4';
      case 3:
        return 'grid-cols-3 gap-2';
      default:
        return '';
    }
  };

  const getImageAspectRatio = (imageCount: number) => {
    switch (imageCount) {
      case 1:
        return 'aspect-video'; // 16:9 for single image
      case 2:
        return 'aspect-square'; // Square for side by side
      case 3:
        return 'aspect-square'; // Square for 3-column grid
      default:
        return 'aspect-square';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview Study Session</DialogTitle>
        </DialogHeader>
        
        <Card className="my-4">
          <CardContent className="p-6">
            {/* Header with Date, Time, Subject, Topic */}
            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-2">
                {formatDate(formData.date)} {formatTime(formData.time)}
              </div>
              <h3 className="font-semibold text-lg">{formData.subject}</h3>
              {formData.topic && (
                <div className="text-muted-foreground">
                  {formData.topic}
                </div>
              )}
            </div>

            {/* Notes Content */}
            {formData.notes && (
              <div className="mb-4">
                <SafeHtml 
                  html={formData.notes}
                  className="prose prose-sm max-w-none"
                />
              </div>
            )}

            {/* Images with Dynamic Layout */}
            {formData.images && formData.images.length > 0 && (
              <div className="mt-4">
                <div className={`grid ${getImageGridLayout(formData.images.length)}`}>
                  {formData.images.map((imageUrl, index) => (
                    <div 
                      key={index} 
                      className={`${getImageAspectRatio(formData.images.length)} rounded-lg overflow-hidden border border-border`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Study session image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyVjE5QTIgMiAwIDAgMSAxOSAyMUg1QTIgMiAwIDAgMSAzIDE5VjVBMiAyIDAgMCAxIDUgM0gxMiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHN2Zz4K';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
