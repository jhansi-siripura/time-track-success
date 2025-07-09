
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getTodayDate } from '@/lib/dateUtils';
import RevisionWidget from './RevisionWidget';
import CalendarWidget from './CalendarWidget';
import RecapFilters from './RecapFilters';

interface RecapSidebarProps {
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  subjectFilter: string;
  onSubjectFilterChange: (subject: string) => void;
  topicFilter: string;
  onTopicFilterChange: (topic: string) => void;
}

const RecapSidebar = ({ 
  dateFilter, 
  onDateFilterChange,
  subjectFilter,
  onSubjectFilterChange,
  topicFilter,
  onTopicFilterChange
}: RecapSidebarProps) => {
  const [calendarReloadTrigger, setCalendarReloadTrigger] = useState(0);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchFilterData();
  }, [user]);

  const fetchFilterData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('study_logs')
        .select('subject, topic')
        .eq('user_id', user.id)
        .not('subject', 'is', null)
        .not('subject', 'eq', '');

      if (error) throw error;

      // Extract unique subjects and topics
      const uniqueSubjects = [...new Set(
        data
          .map(log => log.subject)
          .filter(subject => subject && subject.trim() !== '')
      )].sort();

      const uniqueTopics = [...new Set(
        data
          .map(log => log.topic)
          .filter(topic => topic && topic.trim() !== '')
      )].sort();

      setSubjects(uniqueSubjects);
      setTopics(uniqueTopics);
    } catch (error: any) {
      console.error('Error fetching filter data:', error);
      toast({
        title: "Error",
        description: "Failed to load filter options",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevisionStatusChange = () => {
    setCalendarReloadTrigger(prev => prev + 1);
  };

  const handleClearAllFilters = () => {
    onDateFilterChange('');
    onSubjectFilterChange('all');
    onTopicFilterChange('all');
  };

  return (
    <div className="space-y-4">
      <RecapFilters
        dateFilter={dateFilter}
        subjectFilter={subjectFilter}
        topicFilter={topicFilter}
        subjects={subjects}
        topics={topics}
        onDateFilterChange={onDateFilterChange}
        onSubjectFilterChange={onSubjectFilterChange}
        onTopicFilterChange={onTopicFilterChange}
        onClearAllFilters={handleClearAllFilters}
      />
      <RevisionWidget 
        dateFilter={dateFilter}
        onDateFilterChange={onDateFilterChange}
        onRevisionStatusChange={handleRevisionStatusChange}
      />
      <CalendarWidget 
        onRevisionStatusChange={calendarReloadTrigger}
      />
    </div>
  );
};

export default RecapSidebar;
