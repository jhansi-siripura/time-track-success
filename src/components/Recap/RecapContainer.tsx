import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getTodayDate } from '@/lib/dateUtils';
import StudySessionGrouper from './StudySessionGrouper';
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
  notes: string;
  achievements: string;
  images?: string[];
}

interface RecapContainerProps {
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  subjectFilter: string;
  topicFilter: string;
}

const RecapContainer = ({ dateFilter, onDateFilterChange, subjectFilter, topicFilter }: RecapContainerProps) => {
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchStudyLogs = async () => {
    if (!user) return;

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
        .order('date', { ascending: false })
        .order('time', { ascending: false });

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

  const filteredLogs = useMemo(() => {
    if (!studyLogs) return [];

    return studyLogs.filter(log => {
      // Date filter - if empty, show all dates
      const isDateMatch = !dateFilter || dateFilter === '' || log.date === dateFilter;
      
      // Subject filter
      const isSubjectMatch = subjectFilter === 'all' || log.subject === subjectFilter;
      
      // Topic filter
      const isTopicMatch = topicFilter === 'all' || log.topic === topicFilter;
      
      return isDateMatch && isSubjectMatch && isTopicMatch;
    });
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

    if (!rateLimiter.canMakeRequest(user.id + '_update')) {
      toast({
        title: "Too Many Requests",
        description: "Please wait before updating another study log",
        variant: "destructive",
      });
      return;
    }

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
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Study log updated successfully!",
      });

      fetchStudyLogs();
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

    if (!rateLimiter.canMakeRequest(user.id + '_delete')) {
      toast({
        title: "Too Many Requests",
        description: "Please wait before deleting another study log",
        variant: "destructive",
      });
      return;
    }

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
        .eq('user_id', user.id);

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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your study sessions...</p>
        </div>
      </div>
    );
  }

  if (filteredLogs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No study logs found</h3>
            <p className="text-gray-600">
              {dateFilter || subjectFilter !== 'all' || topicFilter !== 'all' 
                ? "Try adjusting your filters to see more results." 
                : "You haven't logged any study sessions yet."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudySessionGrouper
        logs={filteredLogs}
        onUpdate={handleLogUpdate}
        onDelete={handleLogDelete}
      />
    </div>
  );
};

export default RecapContainer;
