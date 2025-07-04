
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PomodoroSettings {
  id: string;
  focus_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  cycles_until_long_break: number;
  auto_start_breaks: boolean;
  auto_start_pomodoros: boolean;
  sound_focus: string;
  sound_short_break: string;
  sound_long_break: string;
}

export const usePomodoroSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['pomodoro-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('pomodoro_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createSettings = useMutation({
    mutationFn: async (newSettings: Partial<PomodoroSettings>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('pomodoro_settings')
        .insert({
          user_id: user.id,
          ...newSettings,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomodoro-settings'] });
      toast.success('Pomodoro settings created successfully');
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (updatedSettings: Partial<PomodoroSettings>) => {
      if (!user || !settings?.id) throw new Error('Settings not found');

      const { data, error } = await supabase
        .from('pomodoro_settings')
        .update(updatedSettings)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pomodoro-settings'] });
      toast.success('Pomodoro settings updated successfully');
    },
  });

  return {
    settings,
    isLoading,
    createSettings,
    updateSettings,
  };
};
