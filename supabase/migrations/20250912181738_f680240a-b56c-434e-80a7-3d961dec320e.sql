-- Add lesson column to study_logs table
ALTER TABLE public.study_logs 
ADD COLUMN lesson text;