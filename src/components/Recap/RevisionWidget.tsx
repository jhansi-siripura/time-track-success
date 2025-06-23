
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getTodayDate, getDaysAgoDate } from '@/lib/dateUtils';

interface RevisionWidgetProps {
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  onRevisionStatusChange?: () => void;
}

const RevisionWidget = ({ dateFilter, onDateFilterChange, onRevisionStatusChange }: RevisionWidgetProps) => {
  const [selectedRevision, setSelectedRevision] = useState('');
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const revisionOptions = [
    { value: '1', label: '1 Day ago', days: 1 },
    { value: '3', label: '3 Days ago', days: 3 },
    { value: '7', label: '7 Days ago', days: 7 },
    { value: '15', label: '15 Days ago', days: 15 },
    { value: '30', label: '30 Days ago', days: 30 }
  ];

  // Helper function to format date as (DD-MMM-YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `(${day}-${month}-${year})`;
  };

  useEffect(() => {
    fetchTodayRevisionStatus();
  }, [user]);

  const fetchTodayRevisionStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('revision_streaks')
        .select('completed')
        .eq('user_id', user.id)
        .eq('date', getTodayDate())
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setTodayCompleted(data?.completed || false);
    } catch (error) {
      console.error('Error fetching revision status:', error);
    }
  };

  const handleRevisionSelect = (value: string) => {
    if (todayCompleted) return;
    
    setSelectedRevision(value);
    const option = revisionOptions.find(opt => opt.value === value);
    if (option) {
      const targetDate = getDaysAgoDate(option.days);
      onDateFilterChange(targetDate);
    }
  };

  const handleTodayRevisionToggle = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const newCompleted = !todayCompleted;
      
      if (newCompleted) {
        await supabase
          .from('revision_streaks')
          .upsert({
            user_id: user.id,
            date: getTodayDate(),
            completed: true
          });

        toast({
          title: "Great job!",
          description: "Today's revisions marked as complete! 🎉",
        });
      } else {
        await supabase
          .from('revision_streaks')
          .upsert({
            user_id: user.id,
            date: getTodayDate(),
            completed: false
          });

        toast({
          title: "Revisions reset",
          description: "Today's revisions marked as incomplete.",
        });
      }

      setTodayCompleted(newCompleted);
      
      if (newCompleted) {
        setSelectedRevision('');
        onDateFilterChange(getTodayDate());
      }

      // Notify parent component about revision status change
      if (onRevisionStatusChange) {
        onRevisionStatusChange();
      }
    } catch (error) {
      console.error('Error updating revision status:', error);
      toast({
        title: "Error",
        description: "Failed to update revision status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedRevision('');
    onDateFilterChange(getTodayDate());
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="space-y-5">
        {/* Today's Revisions Checkbox */}
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={todayCompleted}
            onCheckedChange={handleTodayRevisionToggle}
            disabled={loading}
            className="h-4 w-4"
          />
          <span className="text-sm font-semibold text-gray-900">
          <h3 className="text-lg font-semibold text-gray-900">Revision Streak</h3>
            Today's Revisions
          </span>
        </div>

        {/* Radio Group for revision options */}
        <RadioGroup
          value={selectedRevision}
          onValueChange={handleRevisionSelect}
          disabled={todayCompleted}
          className="space-y-3"
        >
          {revisionOptions.map((option) => {
            const targetDate = getDaysAgoDate(option.days);
            const formattedDate = formatDate(targetDate);
            
            return (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`revision-${option.value}`}
                  disabled={todayCompleted}
                  className={`h-4 w-4 ${todayCompleted ? 'opacity-50' : ''}`}
                />
                <label
                  htmlFor={`revision-${option.value}`}
                  className={`text-sm cursor-pointer flex items-center space-x-1 ${
                    todayCompleted ? 'text-gray-400 opacity-50' : 'text-gray-900'
                  }`}
                >
                  <span>{option.label}</span>
                  <span className="text-xs text-gray-600">{formattedDate}</span>
                </label>
              </div>
            );
          })}
        </RadioGroup>

        {/* Clear Button */}
        <Button
          variant="outline"
          onClick={handleClear}
          className="w-full py-2 text-sm font-medium text-gray-600 border rounded-lg hover:bg-gray-50"
          disabled={todayCompleted}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default RevisionWidget;
