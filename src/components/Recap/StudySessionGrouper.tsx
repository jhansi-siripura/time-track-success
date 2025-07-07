
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RecapCard from './RecapCard';
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

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-amber-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Study Sessions Found</h3>
        <p className="text-gray-600">Start your learning journey by adding your first study session!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => {
        const dayLogs = groupedLogs[date];
        const stats = getDateStats(dayLogs);
        
        return (
          <div key={date} className="space-y-4">
            {/* Date Header with Stats */}
            <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800">{formatDate(date)}</CardTitle>
                      <p className="text-sm text-gray-600">{new Date(date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{Math.floor(stats.totalDuration / 60)}h {stats.totalDuration % 60}m</span>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">{stats.sessionCount} sessions</span>
                    </div>
                  </div>
                </div>
                
                {/* Subject Overview */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {stats.subjects.map((subject, index) => (
                    <Badge 
                      key={subject} 
                      variant="secondary" 
                      className="bg-white/70 text-gray-700 hover:bg-white/90 transition-colors"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
            
            {/* Study Session Cards */}
            <div className="grid gap-4">
              {dayLogs
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((log) => (
                  <RecapCard
                    key={log.id}
                    log={log}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudySessionGrouper;
