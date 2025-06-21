
-- Step 1: Drop ALL existing RLS policies on study_logs table
DROP POLICY IF EXISTS "Users can view their own study logs" ON public.study_logs;
DROP POLICY IF EXISTS "Users can insert their own study logs" ON public.study_logs;
DROP POLICY IF EXISTS "Users can update their own study logs" ON public.study_logs;
DROP POLICY IF EXISTS "Users can delete their own study logs" ON public.study_logs;
DROP POLICY IF EXISTS "Users can create their own study logs" ON public.study_logs;

-- Step 2: Ensure all existing user_id values are valid UUIDs
UPDATE public.study_logs 
SET user_id = user_id::uuid::text 
WHERE user_id IS NOT NULL;

-- Step 3: Alter the column to UUID type and NOT NULL
ALTER TABLE public.study_logs 
ALTER COLUMN user_id TYPE uuid USING user_id::uuid,
ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Enable RLS (if not already enabled)
ALTER TABLE public.study_logs ENABLE ROW LEVEL SECURITY;

-- Step 5: Recreate RLS policies with proper UUID type
CREATE POLICY "Users can view their own study logs" 
ON public.study_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study logs" 
ON public.study_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study logs" 
ON public.study_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study logs" 
ON public.study_logs 
FOR DELETE 
USING (auth.uid() = user_id);
