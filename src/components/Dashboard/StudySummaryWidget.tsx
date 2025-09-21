
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, Target, Flame, Calendar } from 'lucide-react';
import { getTodayDate } from '@/lib/dateUtils';

interface StudyLog {
  date: string;
  subject: string;
  topic?: string;
  duration: number;
}

interface StudySummaryWidgetProps {
  totalSessions: number;
  totalHours: number;
  totalSubjects: number;
  studyLogs?: StudyLog[];
}

const StudySummaryWidget = ({ totalSessions, totalHours, totalSubjects, studyLogs = [] }: StudySummaryWidgetProps) => {
  // Calculate study streaks (excluding revision)
  const calculateStreaks = () => {
    const today = getTodayDate();
    
    // Get unique study dates (excluding revision)
    const studyDates = [...new Set(
      studyLogs
        .filter(log => log.subject.toLowerCase() !== 'revision')
        .map(log => log.date)
    )].sort();
    
    // Get unique revision dates
    const revisionDates = [...new Set(
      studyLogs
        .filter(log => log.subject.toLowerCase() === 'revision')
        .map(log => log.date)
    )].sort();
    
    // Calculate study streaks
    const studyStreaks = calculateStreakData(studyDates, today);
    const revisionStreaks = calculateStreakData(revisionDates, today);
    
    return { studyStreaks, revisionStreaks };
  };

  const calculateStreakData = (dates: string[], today: string) => {
    if (dates.length === 0) return { longest: 0, current: 0 };
    
    // Sort dates to ensure proper order
    const sortedDates = [...dates].sort();
    
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 1;
    
    // Calculate longest streak
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1] + 'T00:00:00');
      const currDate = new Date(sortedDates[i] + 'T00:00:00');
      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Calculate current streak (working backwards from today)
    const todayDate = new Date(today + 'T00:00:00');
    let checkDate = new Date(todayDate);
    
    // Create a Set for faster lookup
    const dateSet = new Set(dates);
    
    while (true) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      if (dateSet.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return { longest: longestStreak, current: currentStreak };
  };

  const { studyStreaks, revisionStreaks } = calculateStreaks();

  // Main statistics (top row)
  const mainStats = [
    {
      label: 'Total Sessions',
      value: totalSessions.toString(),
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Total Study Hours',
      value: `${totalHours.toFixed(1)} hrs`,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
    },
    {
      label: 'Unique Subjects',
      value: totalSubjects.toString(),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
    },
  ];

  // Streak statistics (bottom row)
  const streakStats = [
    {
      label: 'Study Streak',
      current: studyStreaks.current,
      longest: studyStreaks.longest,
      icon: Flame,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
      borderColor: 'border-red-200',
    },
    {
      label: 'Revision Streak',
      current: revisionStreaks.current,
      longest: revisionStreaks.longest,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <Card className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="pb-4 bg-white border-b border-gray-50">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <BookOpen className="h-5 w-5 text-orange-600" />
          </div>
          Study Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <div className="space-y-4">
          {/* Main Statistics */}
          {mainStats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bgColor} border ${item.borderColor}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{item.label}</span>
                </div>
                <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
              </div>
            );
          })}

          {/* Streak Statistics */}
          <div className="grid grid-cols-2 gap-3">
            {streakStats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${item.bgColor} border ${item.borderColor}`}>
                      <Icon className={`h-3 w-3 ${item.color}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{item.label}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Current:</span>
                      <span className={`text-sm font-bold ${item.color}`}>{item.current} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Longest:</span>
                      <span className={`text-sm font-bold ${item.color}`}>{item.longest} days</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudySummaryWidget;
