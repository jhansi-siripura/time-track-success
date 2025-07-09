import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Clock, BookOpen, Image, MoreVertical, Pencil, Trash2 } from 'lucide-react';
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
interface CompactRecapCardProps {
  log: StudyLog;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}
const CompactRecapCard: React.FC<CompactRecapCardProps> = ({
  log,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  const getSubjectColor = (subject: string) => {
    const colors = ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600', 'from-indigo-500 to-indigo-600'];
    const hash = subject.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  const getNotesPreview = (notes: string) => {
    if (!notes) return '';
    // Strip HTML tags for preview
    const textOnly = notes.replace(/<[^>]*>/g, '');
    return textOnly.length > 80 ? textOnly.substring(0, 80) + '...' : textOnly;
  };
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this study log?')) {
      onDelete();
    }
  };
  return <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-white/90 backdrop-blur-sm h-[200px] flex flex-col">
      {/* Subject Color Bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${getSubjectColor(log.subject)}`} />
      
      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Header with Subject and Topic */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <BookOpen className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
              <h3 className="font-medium text-gray-800 text-sm truncate">{log.subject}</h3>
            </div>
            {log.topic && <p className="text-xs text-gray-600 truncate ml-5">{log.topic}</p>}
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={onViewDetails} className="h-7 w-7 p-0">
              <Eye className="h-3.5 w-3.5 text-gray-500" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreVertical className="h-3.5 w-3.5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer bg-white">
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-destructive focus:text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Notes Preview */}
        <div className="flex-1 mb-3">
          {log.notes && <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
              {getNotesPreview(log.notes)}
            </p>}
        </div>

        {/* Footer with Time, Duration, and Attachments */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{log.time}</span>
            </div>
            <span>•</span>
            <span>{Math.floor(log.duration / 60)}h {log.duration % 60}m</span>
          </div>
          
          {log.images && log.images.length > 0 && <div className="flex items-center space-x-1">
              <Image className="h-3 w-3" />
              <span>{log.images.length}</span>
            </div>}
        </div>
      </CardContent>
    </Card>;
};
export default CompactRecapCard;