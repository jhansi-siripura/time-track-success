
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CalendarWidgetProps {
  onRevisionStatusChange?: number; // Trigger prop to force reload
}

const CalendarWidget = ({ onRevisionStatusChange }: CalendarWidgetProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchCompletedDates();
  }, [user, selectedDate, onRevisionStatusChange]);

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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Revision Streak</h3>
        </div>


      <div className="w-full overflow-hidden">
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
          className="rounded-md border-0 w-full"
          classNames={{
            months: "flex flex-col space-y-4",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex-1 text-center",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative flex-1 h-8",
            day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 mx-auto",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </div>
    </div>
  );
};

export default CalendarWidget;
