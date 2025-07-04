
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useChangelogNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get unread changelog entries
  const { data: unreadEntries, isLoading } = useQuery({
    queryKey: ['unread-changelog', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: changelog, error: changelogError } = await supabase
        .from('app_changelog')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (changelogError) throw changelogError;

      const { data: viewedEntries, error: viewedError } = await supabase
        .from('user_changelog_views')
        .select('changelog_id')
        .eq('user_id', user.id);

      if (viewedError) throw viewedError;

      const viewedIds = new Set(viewedEntries?.map(v => v.changelog_id) || []);
      const unread = changelog?.filter(entry => !viewedIds.has(entry.id)) || [];
      
      return unread;
    },
    enabled: !!user,
  });

  // Mark changelog entry as viewed
  const markAsViewedMutation = useMutation({
    mutationFn: async (changelogId: string) => {
      const { error } = await supabase.rpc('mark_changelog_viewed', {
        changelog_entry_id: changelogId
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread-changelog'] });
    },
  });

  const markAsViewed = (changelogId: string) => {
    markAsViewedMutation.mutate(changelogId);
  };

  const unreadCount = unreadEntries?.length || 0;
  const hasNewFeatures = unreadEntries?.some(entry => entry.change_type === 'feature') || false;

  return {
    unreadEntries,
    unreadCount,
    hasNewFeatures,
    isLoading,
    markAsViewed,
  };
};
