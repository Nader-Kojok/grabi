-- Create missing profile for OAuth user
-- Run this in Supabase SQL Editor

-- Create the missing profile based on auth.users data
INSERT INTO profiles (
  id, 
  email, 
  first_name, 
  last_name, 
  avatar_url,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'given_name',
    u.raw_user_meta_data->>'first_name', 
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
  ) as first_name,
  COALESCE(
    u.raw_user_meta_data->>'family_name',
    u.raw_user_meta_data->>'last_name',
    ''
  ) as last_name,
  COALESCE(
    u.raw_user_meta_data->>'avatar_url',
    u.raw_user_meta_data->>'picture'
  ) as avatar_url,
  u.created_at,
  NOW()
FROM auth.users u
WHERE u.id = 'f6e0b5c3-f0a2-46f5-bfbd-a942f1440a90'
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id);

-- Verify the profile was created successfully
SELECT 
  'Profile created successfully!' as status,
  id,
  email,
  first_name,
  last_name,
  avatar_url,
  created_at
FROM profiles 
WHERE id = 'f6e0b5c3-f0a2-46f5-bfbd-a942f1440a90';