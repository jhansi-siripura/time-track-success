
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Calendar, Clock, Video } from 'lucide-react';

interface SavedCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: {
    id: string;
    video_title: string;
    video_id: string;
    summary: string;
    created_at: string;
    video_url: string;
  } | null;
}

export const SavedCardModal: React.FC<SavedCardModalProps> = ({
  isOpen,
  onClose,
  card
}) => {
  if (!card) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-0 shadow-2xl">
        {/* Top colored border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg"></div>
        
        {/* Close button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full h-8 w-8 p-0 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </Button>

        <DialogHeader className="pt-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Video className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                {card.video_title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(card.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  <span>Video ID: {card.video_id}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="prose prose-sm max-w-none text-gray-700">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {card.summary}
                </pre>
              </div>
            </div>
          </div>

          {card.video_url && (
            <div className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => window.open(card.video_url, '_blank')}
                className="flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Watch Original Video
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
