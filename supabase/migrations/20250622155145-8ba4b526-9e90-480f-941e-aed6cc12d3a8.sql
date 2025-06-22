
-- Rename comments column to notes in study_logs table
ALTER TABLE public.study_logs RENAME COLUMN comments TO notes;

-- Add a new column to store image URLs as an array
ALTER TABLE public.study_logs ADD COLUMN IF NOT EXISTS images text[];

-- Create storage bucket for study session images
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-images', 'study-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow authenticated users to upload images
CREATE POLICY "Users can upload study images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'study-images' AND 
  auth.role() = 'authenticated'
);

-- Create storage policy to allow users to view study images
CREATE POLICY "Users can view study images" ON storage.objects
FOR SELECT USING (bucket_id = 'study-images');

-- Create storage policy to allow users to delete their own study images
CREATE POLICY "Users can delete their own study images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'study-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
