
-- Create Pomodoro settings table
CREATE TABLE public.pomodoro_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  focus_duration INTEGER NOT NULL DEFAULT 25, -- minutes
  short_break_duration INTEGER NOT NULL DEFAULT 5, -- minutes
  long_break_duration INTEGER NOT NULL DEFAULT 15, -- minutes
  cycles_until_long_break INTEGER NOT NULL DEFAULT 4,
  auto_start_breaks BOOLEAN NOT NULL DEFAULT false,
  auto_start_pomodoros BOOLEAN NOT NULL DEFAULT false,
  sound_focus TEXT DEFAULT 'bell',
  sound_short_break TEXT DEFAULT 'chime',
  sound_long_break TEXT DEFAULT 'gong',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for pomodoro_settings
ALTER TABLE public.pomodoro_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pomodoro settings" 
  ON public.pomodoro_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pomodoro settings" 
  ON public.pomodoro_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pomodoro settings" 
  ON public.pomodoro_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create changelog table
CREATE TABLE public.app_changelog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  change_type TEXT NOT NULL DEFAULT 'feature', -- feature, bugfix, improvement
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for changelog (read-only for authenticated users)
ALTER TABLE public.app_changelog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published changelog" 
  ON public.app_changelog 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND is_published = true);

-- Add session_type and pomodoro_cycle to study_logs
ALTER TABLE public.study_logs 
ADD COLUMN session_type TEXT DEFAULT 'manual',
ADD COLUMN pomodoro_cycle INTEGER;

-- Insert initial changelog entry for Pomodoro feature
INSERT INTO public.app_changelog (version, title, description, change_type) 
VALUES (
  '1.1.0', 
  'Pomodoro Timer Feature', 
  'Introducing the new Pomodoro Timer feature! Focus on your studies with timed sessions, customizable breaks, and automatic study log integration. Access it from the sidebar to boost your productivity.',
  'feature'
);
