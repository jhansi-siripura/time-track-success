import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getTodayDate } from '@/lib/dateUtils';
import RecapFilters from './RecapFilters';
import RecapCard from './RecapCard';
import { validateAuthState, rateLimiter } from '@/lib/security';
import { useNavigate } from 'react-router-dom';

interface StudyLog {
  id: number;
  date: string;
  time: string;
  duration: number;
  subject: string;
  topic?: string;
  source?: string;
  comments: string;
  achievements: string;
}

const RecapContainer = () => {
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(getTodayDate());
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchStudyLogs = async () => {
    if (!user) return;

    // Validate authentication before fetching data
    const authValidation = await validateAuthState();
    if (!authValidation.isValid) {
      toast({
        title: "Authentication Error",
        description: "Please log in again to view your study logs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('study_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;

      setStudyLogs(data || []);
    } catch (error: any) {
      console.error('Fetch study logs error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch study logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyLogs();
  }, [user]);

  const { filteredLogs, subjects, topics } = useMemo(() => {
    if (!studyLogs) return { filteredLogs: [], subjects: [], topics: [] };

    // Filter logs based on selected filters
    let filtered = studyLogs.filter(log => {
      const isDateMatch = dateFilter === '' || log.date === dateFilter;
      const isSubjectMatch = subjectFilter === 'all' || log.subject === subjectFilter;
      const isTopicMatch = topicFilter === 'all' || log.topic === topicFilter;
      
      return isDateMatch && isSubjectMatch && isTopicMatch;
    });

    // Extract unique subjects and topics for filter options
    const uniqueSubjects = Array.from(new Set(studyLogs.map(log => log.subject).filter(Boolean)));
    const uniqueTopics = Array.from(new Set(studyLogs.map(log => log.topic).filter(Boolean)));

    return {
      filteredLogs: filtered,
      subjects: uniqueSubjects,
      topics: uniqueTopics
    };
  }, [studyLogs, dateFilter, subjectFilter, topicFilter]);

  const handleLogUpdate = async (logId: number, updatedData: Partial<StudyLog>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update study logs",
        variant: "destructive",
      });
      return;
    }

    // Rate limiting check
    if (!rateLimiter.canMakeRequest(user.id + '_update')) {
      toast({
        title: "Too Many Requests",
        description: "Please wait before updating another study log",
        variant: "destructive",
      });
      return;
    }

    // Validate authentication
    const authValidation = await validateAuthState();
    if (!authValidation.isValid) {
      toast({
        title: "Authentication Error",
        description: "Please log in again to update study logs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('study_logs')
        .update(updatedData)
        .eq('id', logId)
        .eq('user_id', user.id); // Additional security check

      if (error) throw error;

      toast({
        title: "Success",
        description: "Study log updated successfully! Redirecting to dashboard...",
      });

      // Redirect to dashboard after successful update
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('Update study log error:', error);
      toast({
        title: "Error",
        description: "Failed to update study log",
        variant: "destructive",
      });
    }
  };

  const handleLogDelete = async (logId: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete study logs",
        variant: "destructive",
      });
      return;
    }

    if (!confirm('Are you sure you want to delete this study log?')) return;

    // Rate limiting check
    if (!rateLimiter.canMakeRequest(user.id + '_delete')) {
      toast({
        title: "Too Many Requests",
        description: "Please wait before deleting another study log",
        variant: "destructive",
      });
      return;
    }

    // Validate authentication
    const authValidation = await validateAuthState();
    if (!authValidation.isValid) {
      toast({
        title: "Authentication Error",
        description: "Please log in again to delete study logs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('study_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', user.id); // Additional security check

      if (error) throw error;

      toast({
        title: "Success",
        description: "Study log deleted successfully!",
      });

      fetchStudyLogs();
    } catch (error: any) {
      console.error('Delete study log error:', error);
      toast({
        title: "Error",
        description: "Failed to delete study log",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading study logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RecapFilters
        dateFilter={dateFilter}
        subjectFilter={subjectFilter}
        topicFilter={topicFilter}
        subjects={subjects}
        topics={topics}
        onDateFilterChange={setDateFilter}
        onSubjectFilterChange={setSubjectFilter}
        onTopicFilterChange={setTopicFilter}
      />

      {filteredLogs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No study logs found for the selected filters.</p>
          <p className="text-sm mt-2">Try adjusting your filters or add a new study session.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <RecapCard
              key={log.id}
              log={log}
              onUpdate={handleLogUpdate}
              onDelete={handleLogDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecapContainer;
