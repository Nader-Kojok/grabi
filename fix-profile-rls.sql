-- Fix for profile creation RLS policy
-- This adds the missing INSERT policy for the profiles table

-- Add INSERT policy for profiles (allows the trigger to create profiles)
CREATE POLICY "Enable insert for authenticated users during registration" ON profiles
  FOR INSERT WITH CHECK (true);

-- Alternative: If the above doesn't work, we can make the trigger function run with elevated privileges
-- by ensuring it's marked as SECURITY DEFINER (which it already is)

-- Let's also check if we need to grant specific permissions
GRANT INSERT ON profiles TO authenticated;
GRANT INSERT ON profiles TO service_role;