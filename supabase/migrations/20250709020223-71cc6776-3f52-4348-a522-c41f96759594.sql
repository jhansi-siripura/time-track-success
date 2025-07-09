
-- Drop database functions that depend on the tables we're removing
DROP FUNCTION IF EXISTS public.get_user_subject_stats(uuid);
DROP FUNCTION IF EXISTS public.create_spaced_revision_tasks();
DROP FUNCTION IF EXISTS public.update_course_watched_status();
DROP FUNCTION IF EXISTS public.auto_update_learning_matrix();

-- Drop the tables in correct order (respecting foreign key dependencies)
-- todos references courses, so drop todos first
DROP TABLE IF EXISTS public.todos CASCADE;

-- courses references subjects, so drop courses next
DROP TABLE IF EXISTS public.courses CASCADE;

-- subjects references study_goals, so drop subjects next
DROP TABLE IF EXISTS public.subjects CASCADE;

-- study_goals can be dropped last
DROP TABLE IF EXISTS public.study_goals CASCADE;

-- Drop the view that depends on these tables
DROP VIEW IF EXISTS public.subject_stats CASCADE;
