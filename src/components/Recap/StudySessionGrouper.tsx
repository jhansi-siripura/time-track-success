
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CompactRecapCard from './CompactRecapCard';
import StudyLogModal from './StudyLogModal';
import { BookOpen, Clock, Calendar, Target } from 'lucide-react';

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

interface StudySessionGrouperProps {
  logs: StudyLog[];
  onUpdate: (logId: number, updatedData: Partial<StudyLog>) => void;
  onDelete: (logId: number) => void;
}

const StudySessionGrouper: React.FC<StudySessionGrouperProps> = ({ logs, onUpdate, onDelete }) => {
  const [selectedLog, setSelectedLog] = useState<StudyLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Group logs by date
  const groupedLogs = logs.reduce((groups, log) => {
    const date = log.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, StudyLog[]>);

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const getDateStats = (logs: StudyLog[]) => {
    const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
    const subjects = [...new Set(logs.map(log => log.subject))];
    const topics = [...new Set(logs.map(log => log.topic).filter(Boolean))];
    
    return {
      totalDuration,
      subjects,
      topics,
      sessionCount: logs.length
    };
  };

  const handleViewDetails = (log: StudyLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const handleNext = () => {
    if (!selectedLog) return;
    
    // Find current log and get next one in the same day or across days
    const allLogs = logs.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
    
    const currentIndex = allLogs.findIndex(log => log.id === selectedLog.id);
    if (currentIndex < allLogs.length - 1) {
      setSelectedLog(allLogs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (!selectedLog) return;
    
    const allLogs = logs.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
    
    const currentIndex = allLogs.findIndex(log => log.id === selectedLog.id);
    if (currentIndex > 0) {
      setSelectedLog(allLogs[currentIndex - 1]);
    }
  };

  const getNavigationInfo = () => {
    if (!selectedLog) return { hasNext: false, hasPrevious: false };
    
    const allLogs = logs.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
    
    const currentIndex = allLogs.findIndex(log => log.id === selectedLog.id);
    return {
      hasNext: currentIndex < allLogs.length - 1,
      hasPrevious: currentIndex > 0
    };
  };

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
          <BookOpen className="h-10 w-10 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Study Sessions Found</h3>
        <p className="text-gray-600">Start your learning journey by adding your first study session!</p>
      </div>
    );
  }

  const navInfo = getNavigationInfo();

  return (
    <>
      <div className="space-y-6">
        {sortedDates.map((date) => {
          const dayLogs = groupedLogs[date];
          const stats = getDateStats(dayLogs);
          
          return (
            <div key={date} className="space-y-4">
              {/* Date Header with Stats */}
              <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-sm">
                <CardHeader className="pb-2 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-sm">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-800">{formatDate(date)}</CardTitle>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-medium text-xs">{Math.floor(stats.totalDuration / 60)}h {stats.totalDuration % 60}m</span>
                      </div>
                      <div className="flex items-center space-x-1 text-green-600">
                        <Target className="h-3.5 w-3.5" />
                        <span className="font-medium text-xs">{stats.sessionCount} sessions</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Compact Subject Overview */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {stats.subjects.map((subject, index) => (
                      <Badge 
                        key={subject} 
                        variant="secondary" 
                        className="bg-white/70 text-gray-700 hover:bg-white/90 transition-colors text-xs px-2 py-0.5"
                      >
                        <BookOpen className="h-2.5 w-2.5 mr-1" />
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>
              
              {/* Compact Grid of Study Session Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dayLogs
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((log) => (
                    <CompactRecapCard
                      key={log.id}
                      log={log}
                      onViewDetails={() => handleViewDetails(log)}
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <StudyLogModal
        log={selectedLog}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={navInfo.hasNext}
        hasPrevious={navInfo.hasPrevious}
      />
    </>
  );
};

export default StudySessionGrouper;
