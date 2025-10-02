-- Debug script for OAuth profile creation issue
-- Run this in Supabase SQL Editor to investigate and fix the missing profile

-- 1. Check if the user exists in auth.users
SELECT 
  id, 
  email, 
  raw_user_meta_data,
  created_at
FROM auth.users 
WHERE id = 'f6e0b5c3-f0a2-46f5-bfbd-a942f1440a90';

-- 2. Check if profile exists
SELECT * FROM profiles WHERE id = 'f6e0b5c3-f0a2-46f5-bfbd-a942f1440a90';

-- 3. Manually create the missing profile based on auth.users data
-- (Run this only if the profile doesn't exist)
INSERT INTO profiles (
  id, 
  email, 
  first_name, 
  last_name, 
  avatar_url,
  created_at
)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'name', u.raw_user_meta_data->>'first_name', split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'last_name', ''),
  COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
  u.created_at
FROM auth.users u
WHERE u.id = 'f6e0b5c3-f0a2-46f5-bfbd-a942f1440a90'
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id);

-- 4. Verify the profile was created
SELECT 
  id,
  email,
  first_name,
  last_name,
  avatar_url,
  created_at
FROM profiles 
WHERE id = 'f6e0b5c3-f0a2-46f5-bfbd-a942f1440a90';