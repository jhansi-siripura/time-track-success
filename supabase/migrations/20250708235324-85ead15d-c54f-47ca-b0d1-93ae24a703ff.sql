
-- Add new columns and modify existing ones
ALTER TABLE public.learning_matrix_unknown 
  RENAME COLUMN technology_name TO subject_name;

ALTER TABLE public.learning_matrix_unknown 
  ADD COLUMN topic_name TEXT;

-- Remove unnecessary columns
ALTER TABLE public.learning_matrix_unknown 
  DROP COLUMN IF EXISTS description;

ALTER TABLE public.learning_matrix_unknown 
  DROP COLUMN IF EXISTS urgency_level;

ALTER TABLE public.learning_matrix_unknown 
  DROP COLUMN IF EXISTS expected_roi;

-- Update the auto-update function to work with subject and topic
CREATE OR REPLACE FUNCTION public.auto_update_learning_matrix()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- When a new study log is created, check if the subject/topic exists in unknown subjects
  -- and remove it since it's now been studied
  DELETE FROM public.learning_matrix_unknown 
  WHERE user_id = NEW.user_id 
    AND (
      (LOWER(subject_name) = LOWER(NEW.subject) AND topic_name IS NULL)
      OR (LOWER(subject_name) = LOWER(NEW.subject) AND LOWER(topic_name) = LOWER(NEW.topic))
      OR (LOWER(subject_name) = LOWER(NEW.subject) AND NEW.topic IS NULL)
    );
  
  RETURN NEW;
END;
$function$;
