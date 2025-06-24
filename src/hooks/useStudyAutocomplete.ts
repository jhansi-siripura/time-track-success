
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseStudyAutocompleteReturn {
  subjects: string[];
  topics: string[];
  sources: string[];
  loadingSubjects: boolean;
  loadingTopics: boolean;
  loadingSources: boolean;
  fetchTopicsForSubject: (subject: string) => void;
}

const DEFAULT_SOURCES = [
 
];

export function useStudyAutocomplete(): UseStudyAutocompleteReturn {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>(DEFAULT_SOURCES);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);
  const { user } = useAuth();

  // Fetch subjects on mount
  useEffect(() => {
    if (user) {
      fetchSubjects();
      fetchSources();
    }
  }, [user]);

  const fetchSubjects = async () => {
    if (!user) return;
    
    setLoadingSubjects(true);
    try {
      console.log('Fetching subjects for user:', user.id);
      const { data, error } = await supabase
        .from('study_logs')
        .select('subject')
        .eq('user_id', user.id)
        .not('subject', 'is', null)
        .order('subject');

      if (error) throw error;

      const uniqueSubjects = Array.from(
        new Set(data?.map(item => item.subject).filter(Boolean) || [])
      );
      console.log('Fetched subjects:', uniqueSubjects);
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const fetchTopicsForSubject = useCallback(async (subject: string) => {
    if (!user || !subject) {
      setTopics([]);
      return;
    }

    console.log('Fetching topics for subject:', subject);
    setLoadingTopics(true);
    try {
      const { data, error } = await supabase
        .from('study_logs')
        .select('topic')
        .eq('user_id', user.id)
        .eq('subject', subject)
        .not('topic', 'is', null)
        .order('topic');

      if (error) throw error;

      const uniqueTopics = Array.from(
        new Set(data?.map(item => item.topic).filter(Boolean) || [])
      );
      console.log('Fetched topics for', subject, ':', uniqueTopics);
      setTopics(uniqueTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopics([]);
    } finally {
      setLoadingTopics(false);
    }
  }, [user]);

  const fetchSources = async () => {
    if (!user) return;

    setLoadingSources(true);
    try {
      const { data, error } = await supabase
        .from('study_logs')
        .select('source')
        .eq('user_id', user.id)
        .not('source', 'is', null)
        .order('source');

      if (error) throw error;

      const uniqueSources = Array.from(
        new Set(data?.map(item => item.source).filter(Boolean) || [])
      );
      
      // Combine default sources with user's custom sources
      const allSources = Array.from(new Set([...DEFAULT_SOURCES, ...uniqueSources]));
      setSources(allSources);
    } catch (error) {
      console.error('Error fetching sources:', error);
    } finally {
      setLoadingSources(false);
    }
  };

  return {
    subjects,
    topics,
    sources,
    loadingSubjects,
    loadingTopics,
    loadingSources,
    fetchTopicsForSubject,
  };
}
