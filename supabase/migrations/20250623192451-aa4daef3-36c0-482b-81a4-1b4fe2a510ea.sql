
-- Create a table for revision streaks
CREATE TABLE public.revision_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own revision streaks
ALTER TABLE public.revision_streaks ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own revision streaks
CREATE POLICY "Users can view their own revision streaks" 
  ON public.revision_streaks 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own revision streaks
CREATE POLICY "Users can create their own revision streaks" 
  ON public.revision_streaks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own revision streaks
CREATE POLICY "Users can update their own revision streaks" 
  ON public.revision_streaks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own revision streaks
CREATE POLICY "Users can delete their own revision streaks" 
  ON public.revision_streaks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate entries for same user and date
ALTER TABLE public.revision_streaks 
ADD CONSTRAINT unique_user_date UNIQUE (user_id, date);
