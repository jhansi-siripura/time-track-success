
-- Insert new changelog entry for YouTube NoteTaker feature
INSERT INTO public.app_changelog (version, title, description, change_type) 
VALUES (
  '1.3.0', 
  'YouTube NoteTaker Feature', 
  'Transform any YouTube video into structured, AI-powered summary cards! Load videos, generate intelligent summaries using your preferred AI provider (OpenAI, Anthropic, or Perplexity), and save cards for future reference. Features include video preview, transcript processing, customizable AI settings, and a dedicated saved cards library with expandable views.',
  'feature'
);
