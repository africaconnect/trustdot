-- Migration to add profile_image_url to vendor_profiles
alter table public.vendor_profiles add column if not exists profile_image_url text; 