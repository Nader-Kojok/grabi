-- Add verification fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_badges TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0;

-- Create index for verified users
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);

-- Update existing users to calculate their profile completion percentage
-- This is a one-time update for existing users
UPDATE profiles 
SET profile_completion_percentage = (
  CASE 
    WHEN first_name IS NOT NULL AND first_name != '' THEN 10 ELSE 0 END +
    CASE 
      WHEN last_name IS NOT NULL AND last_name != '' THEN 10 ELSE 0 END +
    CASE 
      WHEN email IS NOT NULL AND email != '' THEN 15 ELSE 0 END +
    CASE 
      WHEN phone IS NOT NULL AND phone != '' THEN 10 ELSE 0 END +
    CASE 
      WHEN bio IS NOT NULL AND bio != '' THEN 15 ELSE 0 END +
    CASE 
      WHEN location IS NOT NULL AND location != '' THEN 10 ELSE 0 END +
    CASE 
      WHEN date_of_birth IS NOT NULL THEN 10 ELSE 0 END +
    CASE 
      WHEN website IS NOT NULL AND website != '' THEN 10 ELSE 0 END +
    CASE 
      WHEN avatar_url IS NOT NULL AND avatar_url != '' THEN 5 ELSE 0 END +
    CASE 
      WHEN banner_url IS NOT NULL AND banner_url != '' THEN 5 ELSE 0 END
)
WHERE profile_completion_percentage = 0;

-- Create a function to automatically update profile completion percentage
CREATE OR REPLACE FUNCTION update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completion_percentage := (
    CASE 
      WHEN NEW.first_name IS NOT NULL AND NEW.first_name != '' THEN 10 ELSE 0 END +
    CASE 
      WHEN NEW.last_name IS NOT NULL AND NEW.last_name != '' THEN 10 ELSE 0 END +
    CASE 
      WHEN NEW.email IS NOT NULL AND NEW.email != '' THEN 15 ELSE 0 END +
    CASE 
      WHEN NEW.phone IS NOT NULL AND NEW.phone != '' THEN 10 ELSE 0 END +
    CASE 
      WHEN NEW.bio IS NOT NULL AND NEW.bio != '' THEN 15 ELSE 0 END +
    CASE 
      WHEN NEW.location IS NOT NULL AND NEW.location != '' THEN 10 ELSE 0 END +
    CASE 
      WHEN NEW.date_of_birth IS NOT NULL THEN 10 ELSE 0 END +
    CASE 
      WHEN NEW.website IS NOT NULL AND NEW.website != '' THEN 10 ELSE 0 END +
    CASE 
      WHEN NEW.avatar_url IS NOT NULL AND NEW.avatar_url != '' THEN 5 ELSE 0 END +
    CASE 
      WHEN NEW.banner_url IS NOT NULL AND NEW.banner_url != '' THEN 5 ELSE 0 END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update profile completion percentage
DROP TRIGGER IF EXISTS trigger_update_profile_completion ON profiles;
CREATE TRIGGER trigger_update_profile_completion
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completion();