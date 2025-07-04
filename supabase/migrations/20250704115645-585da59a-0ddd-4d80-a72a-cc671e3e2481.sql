
-- Create table to track which changelog entries users have seen
CREATE TABLE public.user_changelog_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  changelog_id UUID REFERENCES public.app_changelog(id) NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, changelog_id)
);

-- Add RLS policies for user_changelog_views
ALTER TABLE public.user_changelog_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own changelog views" 
  ON public.user_changelog_views 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own changelog views" 
  ON public.user_changelog_views 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own changelog views" 
  ON public.user_changelog_views 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add function to mark changelog as viewed
CREATE OR REPLACE FUNCTION public.mark_changelog_viewed(changelog_entry_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_changelog_views (user_id, changelog_id)
  VALUES (auth.uid(), changelog_entry_id)
  ON CONFLICT (user_id, changelog_id) DO NOTHING;
END;
$$;
