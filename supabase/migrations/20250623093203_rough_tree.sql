/*
  # Add social media links to vendor profiles

  1. Changes
    - Add social media URL columns to vendor_profiles table
    - instagram_url (text)
    - facebook_url (text) 
    - twitter_url (text)
    - website_url (text)

  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendor_profiles' AND column_name = 'instagram_url'
  ) THEN
    ALTER TABLE vendor_profiles ADD COLUMN instagram_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendor_profiles' AND column_name = 'facebook_url'
  ) THEN
    ALTER TABLE vendor_profiles ADD COLUMN facebook_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendor_profiles' AND column_name = 'twitter_url'
  ) THEN
    ALTER TABLE vendor_profiles ADD COLUMN twitter_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendor_profiles' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE vendor_profiles ADD COLUMN website_url text;
  END IF;
END $$;