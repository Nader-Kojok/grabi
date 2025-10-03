# Privacy Settings Implementation Guide

## Overview
The privacy settings feature allows users to control the visibility of their profile and information. This document explains how to test and use the privacy settings.

## Database Migration Required
Before testing, you need to run the database migration to add privacy fields to the profiles table:

1. Open your Supabase SQL Editor
2. Run the SQL from `add-privacy-settings-migration.sql`

## Privacy Settings Available

### 1. Profile Public/Private
- **Public**: Profile is visible to all users via `/profile/:id` URL
- **Private**: Profile is only accessible by the owner, others see "Ce profil est privé" message

### 2. Show Email
- Controls whether email address is displayed on public profile
- When enabled, email appears in the "À propos du vendeur" sidebar section

### 3. Show Phone
- Controls whether phone number is displayed on public profile  
- When enabled, phone appears in the "À propos du vendeur" sidebar section

### 4. Allow Reviews
- **Enabled**: Other users can leave reviews and ratings
- **Disabled**: Review form is hidden and message shows "Les évaluations sont désactivées pour ce vendeur"

## How to Test

### Test Private Profile:
1. Go to Settings page (`/settings`)
2. Turn OFF "Profil public" toggle
3. Click "Enregistrer les paramètres"
4. Open your profile in incognito mode using `/profile/YOUR_USER_ID`
5. You should see "Ce profil est privé" message

### Test Reviews Disabled:
1. Go to Settings page (`/settings`)
2. Turn OFF "Autoriser les évaluations" toggle  
3. Click "Enregistrer les paramètres"
4. Visit your public profile
5. Reviews section should show "Les évaluations sont désactivées pour ce vendeur"

### Test Email/Phone Privacy:
1. Go to Settings page (`/settings`)
2. Toggle "Afficher l'email" and "Afficher le téléphone" settings
3. Click "Enregistrer les paramètres"
4. Visit your public profile
5. Email/phone should be hidden/shown in the "À propos du vendeur" sidebar based on settings

## Technical Implementation

### Database Schema
```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_profile_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS allow_reviews BOOLEAN DEFAULT true;
```

### RLS Policy
```sql
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_profile_public = true OR auth.uid() = id);
```

### Components Updated
1. **SettingsPage.tsx**: Now saves privacy settings to Supabase instead of localStorage
2. **PublicProfilePage.tsx**: Checks privacy settings before displaying profile and reviews
3. **ReviewForm.tsx**: Respects allowReviews setting (handled by parent component)

## Implementation Complete ✅

All privacy settings are now fully functional:
- ✅ Private/Public profile toggle with enforcement
- ✅ Allow/Disable reviews with UI updates  
- ✅ Show/Hide email in public profile sidebar
- ✅ Show/Hide phone in public profile sidebar
- ✅ Database integration with Supabase
- ✅ RLS policies for privacy enforcement

## Optional Future Enhancements
- Add privacy indicators to user profiles
- Add privacy settings to mobile app if applicable
- Add email/phone privacy to listing contact forms
