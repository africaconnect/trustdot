/*
  # Trustdot Database Schema

  1. New Tables
    - `vendor_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `business_name` (text)
      - `service_type` (text)
      - `contact_phone` (text)
      - `trust_score` (numeric, default 0)
      - `total_jobs` (integer, default 0)
      - `verified_jobs` (integer, default 0)
      - `avg_rating` (numeric, default 0)
      - `subscription_tier` (text, default 'free')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `jobs`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, foreign key)
      - `job_id` (text)
      - `client_name` (text)
      - `client_contact` (text)
      - `service_type` (text)
      - `description` (text)
      - `status` (text, default 'pending')
      - `verification_sent_at` (timestamp)
      - `verified_at` (timestamp)
      - `created_at` (timestamp)
    
    - `reviews`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, foreign key)
      - `job_id` (uuid, foreign key)
      - `rating` (integer)
      - `comment` (text)
      - `client_name` (text)
      - `created_at` (timestamp)
    
    - `verification_requests`
      - `id` (uuid, primary key)
      - `job_id` (uuid, foreign key)
      - `verification_token` (text)
      - `client_contact` (text)
      - `status` (text, default 'pending')
      - `expires_at` (timestamp)
      - `created_at` (timestamp)
    
    - `subscriptions`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, foreign key)
      - `tier` (text)
      - `stripe_subscription_id` (text)
      - `status` (text)
      - `current_period_start` (timestamp)
      - `current_period_end` (timestamp)
      - `jobs_limit` (integer)
      - `jobs_used` (integer, default 0)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public access to vendor profiles and reviews
*/

CREATE TABLE IF NOT EXISTS vendor_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  service_type text NOT NULL,
  contact_phone text,
  trust_score numeric DEFAULT 0,
  total_jobs integer DEFAULT 0,
  verified_jobs integer DEFAULT 0,
  avg_rating numeric DEFAULT 0,
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  job_id text NOT NULL,
  client_name text NOT NULL,
  client_contact text NOT NULL,
  service_type text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verification_sent_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  client_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  verification_token text NOT NULL UNIQUE,
  client_contact text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'premium')),
  stripe_subscription_id text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  jobs_limit integer DEFAULT 10,
  jobs_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Vendor profiles policies
CREATE POLICY "Vendors can read own profile"
  ON vendor_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Vendors can update own profile"
  ON vendor_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Vendors can insert own profile"
  ON vendor_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can read vendor profiles"
  ON vendor_profiles
  FOR SELECT
  TO anon
  USING (true);

-- Jobs policies
CREATE POLICY "Vendors can manage own jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (vendor_id = auth.uid());

-- Reviews policies
CREATE POLICY "Vendors can read own reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

CREATE POLICY "Public can read reviews"
  ON reviews
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert reviews"
  ON reviews
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Verification requests policies
CREATE POLICY "Vendors can read own verification requests"
  ON verification_requests
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM jobs WHERE jobs.id = verification_requests.job_id AND jobs.vendor_id = auth.uid()
  ));

CREATE POLICY "Anyone can read verification requests by token"
  ON verification_requests
  FOR SELECT
  TO anon
  USING (true);

-- Subscriptions policies
CREATE POLICY "Vendors can manage own subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (vendor_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_vendor_id ON jobs(vendor_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor_id ON reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_token ON verification_requests(verification_token);
CREATE INDEX IF NOT EXISTS idx_subscriptions_vendor_id ON subscriptions(vendor_id);