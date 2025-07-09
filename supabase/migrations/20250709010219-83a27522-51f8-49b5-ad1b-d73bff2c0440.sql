
-- Add changelog entry for Learning Matrix enhancements
INSERT INTO public.app_changelog (version, title, description, change_type) 
VALUES (
  '1.2.0', 
  'Learning Matrix Enhancements', 
  'Major updates to the Learning Matrix feature: replaced "Technology" terminology with "Subject", added dynamic expertise level badges (Newbie to Master/Specialist) based on study hours, compact quadrant card design with topic chips, and total estimated hours display per quadrant. The Known Subjects section now shows subject/topic counts and calculated expertise levels.',
  'feature'
);

-- Add changelog entry for code cleanup
INSERT INTO public.app_changelog (version, title, description, change_type) 
VALUES (
  '1.3.0', 
  'Codebase Cleanup', 
  'Removed orphaned study management features: Study Goals, Subjects, Courses, and To-Do systems that were built but not accessible through main navigation. Streamlined the application to focus on core learning features: Dashboard, Study Logs, Pomodoro Timer, and Learning Matrix.',
  'improvement'
);
