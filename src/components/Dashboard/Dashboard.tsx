import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import DailyTargetWidget from './DailyTargetWidget';
import StudySummaryWidget from './StudySummaryWidget';
import SubjectBarChartWidget from './SubjectBarChartWidget';
import WeeklyDistributionWidget from './WeeklyDistributionWidget';
import FourWeekConsistencyWidget from './FourWeekConsistencyWidget';
import TwelveMonthTrendWidget from './TwelveMonthTrendWidget';

interface StudyLog {
  date: string;
  subject: string;
  duration: number;
}

const Dashboard = () => {
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStudyLogs = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('study_logs')
          .select('date, subject, duration')
          .eq('user_id', user.id);

        if (error) throw error;

        const processedLogs = (data || []).map(log => ({
          date: log.date || '',
          subject: log.subject || 'Unknown',
          duration: log.duration || 0,
        }));

        setStudyLogs(processedLogs);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch study logs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudyLogs();
  }, [user]);

  // Calculate daily target data
  const calculateDailyTargets = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const last21Days = Array.from({ length: 21 }, (_, i) => {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      return date.toISOString().split('T')[0];
    });
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      return date.toISOString().split('T')[0];
    });

    const getDailyTotal = (date: string) => {
      return studyLogs
        .filter(log => log.date === date)
        .reduce((sum, log) => sum + log.duration, 0) / 60;
    };

    const avg21Days = last21Days.reduce((sum, date) => sum + getDailyTotal(date), 0) / 21;
    const avg7Days = last7Days.reduce((sum, date) => sum + getDailyTotal(date), 0) / 7;
    const yesterdayHours = getDailyTotal(yesterday);
    const todayHours = getDailyTotal(today);

    return { avg21Days, avg7Days, yesterdayHours, todayHours };
  };

  // Calculate study summary
  const calculateStudySummary = () => {
    const totalSessions = studyLogs.length;
    const totalHours = studyLogs.reduce((sum, log) => sum + log.duration, 0) / 60;
    const totalSubjects = new Set(studyLogs.map(log => log.subject)).size;

    return { totalSessions, totalHours, totalSubjects };
  };

  // Calculate subject data for bar chart
  const calculateSubjectData = () => {
    const subjectMap = new Map();
    
    studyLogs.forEach(log => {
      const subject = log.subject || 'Unknown';
      const hours = log.duration / 60;
      
      if (subjectMap.has(subject)) {
        subjectMap.set(subject, subjectMap.get(subject) + hours);
      } else {
        subjectMap.set(subject, hours);
      }
    });

    return Array.from(subjectMap.entries())
      .map(([subject, hours]) => ({ subject, hours }))
      .sort((a, b) => b.hours - a.hours);
  };

  // Calculate weekly distribution - updated to show full week
  const calculateWeeklyDistribution = () => {
    const startOfWeek = new Date();
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        fullDate: date
      };
    });

    const subjects = Array.from(new Set(studyLogs.map(log => log.subject)));
    
    return weekDays.map(({ day, date }) => {
      const dayData: any = { 
        day: day,
        date 
      };
      
      subjects.forEach(subject => {
        const hours = studyLogs
          .filter(log => log.date === date && log.subject === subject)
          .reduce((sum, log) => sum + log.duration, 0) / 60;
        dayData[subject] = hours;
      });
      
      return dayData;
    });
  };

  // Calculate 4-week consistency
  const calculateFourWeekConsistency = () => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - now.getDay() + 1);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekLabel = i === 0 ? 'W4' : `W${4 - i}`;
      
      const weekHours = studyLogs
        .filter(log => {
          const logDate = new Date(log.date);
          return logDate >= weekStart && logDate <= weekEnd;
        })
        .reduce((sum, log) => sum + log.duration, 0) / 60;
      
      weeks.push({ week: weekLabel, hours: weekHours });
    }
    
    return weeks;
  };

  // Calculate 12-month trend - fixed to include current month properly
  const calculateTwelveMonthTrend = () => {
    if (studyLogs.length === 0) return [];
    
    const sortedLogs = studyLogs.sort((a, b) => a.date.localeCompare(b.date));
    const firstLogDate = new Date(sortedLogs[0].date);
    const currentDate = new Date();
    
    const months = [];
    const startDate = new Date(firstLogDate.getFullYear(), firstLogDate.getMonth(), 1);
    
    // Calculate months from first log until current month (inclusive)
    let monthIterator = new Date(startDate);
    while (monthIterator <= currentDate) {
      const monthKey = monthIterator.toISOString().slice(0, 7); // YYYY-MM format
      const monthLabel = monthIterator.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      const monthHours = studyLogs
        .filter(log => log.date.startsWith(monthKey))
        .reduce((sum, log) => sum + log.duration, 0) / 60;
      
      months.push({ month: monthLabel, hours: monthHours });
      
      // Move to next month
      monthIterator.setMonth(monthIterator.getMonth() + 1);
      
      // Limit to 12 months maximum
      if (months.length >= 12) break;
    }
    
    // If we have more than 12 months, take the last 12
    return months.slice(-12);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading dashboard...</div>
      </div>
    );
  }

  const dailyTargets = calculateDailyTargets();
  const studySummary = calculateStudySummary();
  const subjectData = calculateSubjectData();
  const weeklyData = calculateWeeklyDistribution();
  const fourWeekData = calculateFourWeekConsistency();
  const twelveMonthData = calculateTwelveMonthTrend();
  const subjects = Array.from(new Set(studyLogs.map(log => log.subject)));

  return (
    <div className="space-y-6">
      {/* Top Row - Two widgets side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyTargetWidget {...dailyTargets} />
        <StudySummaryWidget {...studySummary} />
      </div>

      {/* Second Section - Full width */}
      <SubjectBarChartWidget data={subjectData} />

      {/* Third Row - Three equal widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeeklyDistributionWidget data={weeklyData} subjects={subjects} />
        <FourWeekConsistencyWidget data={fourWeekData} />
        <TwelveMonthTrendWidget data={twelveMonthData} />
      </div>
    </div>
  );
};

export default Dashboard;
