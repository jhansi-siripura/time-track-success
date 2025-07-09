
-- Add changelog entry for Learning Matrix enhancements
INSERT INTO public.app_changelog (version, title, description, change_type) 
VALUES (
  '1.2.0', 
  'Learning Matrix Enhancements', 
  'Major updates to the Learning Matrix feature: replaced "Technology" terminology with "Subject", added dynamic expertise level badges (Newbie to Master/Specialist) based on study hours, compact quadrant card design with topic chips, and total estimated hours display per quadrant. The Known Subjects section now shows subject/topic counts and calculated expertise levels.',
  'feature'
);
