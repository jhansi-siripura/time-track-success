
-- Drop the existing view first
DROP VIEW IF EXISTS public.subject_stats;

-- Create a security definer function to get user's subject stats
CREATE OR REPLACE FUNCTION public.get_user_subject_stats(requesting_user_id uuid DEFAULT auth.uid())
RETURNS TABLE (
  id uuid,
  subject_name text,
  goal_id uuid,
  created_at timestamp with time zone,
  planned_hours numeric,
  actual_hours numeric,
  expertise_level text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    s.id,
    s.subject_name,
    s.goal_id,
    s.created_at,
    -- Calculate planned hours (placeholder logic - adjust as needed)
    COALESCE(SUM(c.duration_hours), 0) as planned_hours,
    -- Calculate actual hours from study logs
    COALESCE(
      (SELECT SUM(sl.duration) / 60.0 
       FROM public.study_logs sl 
       WHERE sl.subject = s.subject_name 
       AND sl.user_id = requesting_user_id), 
      0
    ) as actual_hours,
    -- Calculate expertise level based on study hours
    CASE 
      WHEN COALESCE(
        (SELECT SUM(sl.duration) / 60.0 
         FROM public.study_logs sl 
         WHERE sl.subject = s.subject_name 
         AND sl.user_id = requesting_user_id), 
        0
      ) >= 100 THEN 'Expert'
      WHEN COALESCE(
        (SELECT SUM(sl.duration) / 60.0 
         FROM public.study_logs sl 
         WHERE sl.subject = s.subject_name 
         AND sl.user_id = requesting_user_id), 
        0
      ) >= 50 THEN 'Advanced'
      WHEN COALESCE(
        (SELECT SUM(sl.duration) / 60.0 
         FROM public.study_logs sl 
         WHERE sl.subject = s.subject_name 
         AND sl.user_id = requesting_user_id), 
        0
      ) >= 20 THEN 'Intermediate'
      ELSE 'Beginner'
    END as expertise_level
  FROM public.subjects s
  LEFT JOIN public.courses c ON c.subject_id = s.id
  WHERE s.goal_id IN (
    SELECT id FROM public.study_goals WHERE user_id = requesting_user_id
  )
  GROUP BY s.id, s.subject_name, s.goal_id, s.created_at;
$$;

-- Create a view that calls the secure function for the current user
CREATE VIEW public.subject_stats AS
SELECT * FROM public.get_user_subject_stats();

-- Grant access to the function and view
GRANT EXECUTE ON FUNCTION public.get_user_subject_stats(uuid) TO authenticated;
GRANT SELECT ON public.subject_stats TO authenticated;
