-- Migration: Add banner_url field to profiles table
-- Description: Add banner_url field for profile banners

-- Add banner_url column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.banner_url IS 'User profile banner image URL';

-- Update storage bucket for banners (if not exists)
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for banners bucket
CREATE POLICY "Banner images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Users can upload their own banner" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'banners' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own banner" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'banners' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own banner" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'banners' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );