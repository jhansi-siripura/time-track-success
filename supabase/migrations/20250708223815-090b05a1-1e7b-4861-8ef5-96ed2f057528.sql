
-- Create enum for priority categories
CREATE TYPE public.learning_priority AS ENUM (
  'job-critical',
  'important-not-urgent', 
  'curious-emerging',
  'nice-to-know'
);

-- Create enum for urgency levels
CREATE TYPE public.urgency_level AS ENUM (
  'high',
  'medium',
  'low'
);

-- Create enum for ROI levels
CREATE TYPE public.roi_level AS ENUM (
  'high',
  'medium',
  'low',
  'unknown'
);

-- Create table for unknown technologies that users want to learn
CREATE TABLE public.learning_matrix_unknown (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  technology_name TEXT NOT NULL,
  description TEXT,
  priority_category learning_priority NOT NULL,
  urgency_level urgency_level DEFAULT 'medium',
  estimated_hours NUMERIC,
  expected_roi roi_level DEFAULT 'unknown',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.learning_matrix_unknown ENABLE ROW LEVEL SECURITY;

-- Create policies for learning_matrix_unknown
CREATE POLICY "Users can view their own unknown technologies" 
  ON public.learning_matrix_unknown 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own unknown technologies" 
  ON public.learning_matrix_unknown 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own unknown technologies" 
  ON public.learning_matrix_unknown 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own unknown technologies" 
  ON public.learning_matrix_unknown 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to automatically remove unknown technologies when they're studied
CREATE OR REPLACE FUNCTION public.auto_update_learning_matrix()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new study log is created, check if the subject/topic exists in unknown technologies
  -- and remove it since it's now been studied
  DELETE FROM public.learning_matrix_unknown 
  WHERE user_id = NEW.user_id 
    AND (
      LOWER(technology_name) = LOWER(NEW.subject) 
      OR LOWER(technology_name) = LOWER(NEW.topic)
      OR LOWER(technology_name) = LOWER(CONCAT(NEW.subject, ' - ', NEW.topic))
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update learning matrix when study logs are added
CREATE TRIGGER auto_update_learning_matrix_trigger
  AFTER INSERT ON public.study_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_update_learning_matrix();
