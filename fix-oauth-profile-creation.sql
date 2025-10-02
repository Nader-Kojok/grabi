-- Fix for OAuth profile creation issue
-- Run this SQL in your Supabase SQL Editor

-- 1. Add INSERT policy for profiles table
-- This allows the trigger to create profiles during OAuth registration
DROP POLICY IF EXISTS "Enable insert for authenticated users during registration" ON profiles;
CREATE POLICY "Enable insert for authenticated users during registration" ON profiles
  FOR INSERT WITH CHECK (true);

-- 2. Ensure the trigger function has proper security context
-- Recreate the trigger function with proper permissions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name, phone, bio, location)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(NEW.raw_user_meta_data->>'location', '')
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. Grant necessary permissions
GRANT INSERT ON profiles TO authenticated;
GRANT INSERT ON profiles TO service_role;

-- 5. Verify the setup
SELECT 'Profile RLS policies:' as info;
SELECT policyname, cmd, with_check 
FROM pg_policies 
WHERE tablename = 'profiles' AND cmd = 'INSERT';