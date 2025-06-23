
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
}

const RevisionWidget = ({ dateFilter, onDateFilterChange }: RevisionWidgetProps) => {
  const [selectedRevision, setSelectedRevision] = useState('');
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const revisionOptions = [
    { value: '1', label: '1 day ago', days: 1 },
    { value: '3', label: '3 days ago', days: 3 },
    { value: '7', label: '7 days ago', days: 7 },
    { value: '15', label: '15 days ago', days: 15 },
    { value: '30', label: '30 days ago', days: 30 }
  ];

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
        // Mark as completed
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
        // Mark as incomplete
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
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Today's Revisions</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={todayCompleted}
            onCheckedChange={handleTodayRevisionToggle}
            disabled={loading}
            className="h-5 w-5"
          />
          <span className={`text-sm font-medium ${todayCompleted ? 'text-green-600' : 'text-gray-700'}`}>
            {todayCompleted ? 'Today\'s Revisions Completed ✓' : 'Mark today\'s revisions as complete'}
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">Review materials from:</p>
          <RadioGroup
            value={selectedRevision}
            onValueChange={handleRevisionSelect}
            disabled={todayCompleted}
            className="space-y-2"
          >
            {revisionOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`revision-${option.value}`}
                  disabled={todayCompleted}
                  className={todayCompleted ? 'opacity-50' : ''}
                />
                <label
                  htmlFor={`revision-${option.value}`}
                  className={`text-sm cursor-pointer ${
                    todayCompleted ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {!todayCompleted && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="w-full"
          >
            Clear Selection
          </Button>
        )}
      </div>
    </div>
  );
};

export default RevisionWidget;
