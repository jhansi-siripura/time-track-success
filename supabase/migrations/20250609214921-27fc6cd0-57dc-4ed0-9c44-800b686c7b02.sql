
-- Add new fields to study_logs table for enhanced functionality
ALTER TABLE public.study_logs 
ADD COLUMN IF NOT EXISTS topic text,
ADD COLUMN IF NOT EXISTS source text;

-- Update any existing records to have default values
UPDATE public.study_logs 
SET topic = NULL, source = NULL 
WHERE topic IS NULL OR source IS NULL;
