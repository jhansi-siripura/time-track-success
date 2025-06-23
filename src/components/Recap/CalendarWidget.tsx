
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CalendarWidget = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchCompletedDates();
  }, [user, selectedDate]);

  const fetchCompletedDates = async () => {
    if (!user) return;

    try {
      // Get the start and end of the currently viewed month
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('revision_streaks')
        .select('date')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0]);

      if (error) throw error;

      const dates = new Set(data.map(item => item.date));
      setCompletedDates(dates);
    } catch (error) {
      console.error('Error fetching completed dates:', error);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const modifyDay = (day: Date) => {
    const dateString = day.toISOString().split('T')[0];
    const isCompleted = completedDates.has(dateString);
    const isToday = dateString === new Date().toISOString().split('T')[0];

    return {
      ...day,
      className: `
        ${isCompleted ? 'bg-green-500 text-white hover:bg-green-600' : ''}
        ${isToday && !isCompleted ? 'ring-2 ring-blue-500' : ''}
        ${isToday && isCompleted ? 'ring-2 ring-green-300' : ''}
      `
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Revision Streak</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[140px] text-center">
            {formatMonth(selectedDate)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        month={selectedDate}
        onMonthChange={setSelectedDate}
        modifiers={{
          completed: (date) => {
            const dateString = date.toISOString().split('T')[0];
            return completedDates.has(dateString);
          }
        }}
        modifiersStyles={{
          completed: {
            backgroundColor: '#10b981',
            color: 'white',
            fontWeight: 'bold'
          }
        }}
        className="rounded-md border-0"
      />

      <div className="mt-4 flex items-center space-x-4 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 border border-gray-300 rounded"></div>
          <span>Pending</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
