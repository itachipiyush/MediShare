/*
  # Initial Schema for MediShare

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (enum: 'donor' or 'claimer')
      - `created_at` (timestamp)
    - `medicines`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `quantity` (integer)
      - `expiry_date` (date)
      - `image_url` (text, optional)
      - `location` (text)
      - `posted_by` (uuid, foreign key to users)
      - `status` (enum: 'available', 'claimed', 'expired')
      - `created_at` (timestamp)
    - `claims`
      - `id` (uuid, primary key)
      - `medicine_id` (uuid, foreign key to medicines)
      - `claimer_id` (uuid, foreign key to users)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('donor', 'claimer');
CREATE TYPE medicine_status AS ENUM ('available', 'claimed', 'expired');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  quantity integer NOT NULL,
  expiry_date date NOT NULL,
  image_url text,
  location text NOT NULL,
  posted_by uuid REFERENCES users(id) NOT NULL,
  status medicine_status DEFAULT 'available',
  created_at timestamptz DEFAULT now()
);

-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id uuid REFERENCES medicines(id) NOT NULL,
  claimer_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(medicine_id, claimer_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for medicines table
CREATE POLICY "Anyone can view available medicines"
  ON medicines
  FOR SELECT
  USING (status = 'available' OR posted_by = auth.uid());

CREATE POLICY "Donors can insert their own medicines"
  ON medicines
  FOR INSERT
  WITH CHECK (auth.uid() = posted_by AND EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'donor'
  ));

CREATE POLICY "Donors can update their own medicines"
  ON medicines
  FOR UPDATE
  USING (auth.uid() = posted_by AND status = 'available');

CREATE POLICY "Donors can delete their own medicines"
  ON medicines
  FOR DELETE
  USING (auth.uid() = posted_by AND status = 'available');

-- RLS Policies for claims table
CREATE POLICY "Claimers can insert claims"
  ON claims
  FOR INSERT
  WITH CHECK (auth.uid() = claimer_id AND EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'claimer'
  ));

CREATE POLICY "Users can view their own claims"
  ON claims
  FOR SELECT
  USING (auth.uid() = claimer_id OR auth.uid() IN (
    SELECT posted_by FROM medicines WHERE id = medicine_id
  ));

-- Trigger to update medicine status when claimed
CREATE OR REPLACE FUNCTION update_medicine_status_on_claim()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE medicines
  SET status = 'claimed'
  WHERE id = NEW.medicine_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_medicine_status
AFTER INSERT ON claims
FOR EACH ROW
EXECUTE FUNCTION update_medicine_status_on_claim();

-- Trigger to automatically set medicines as expired
CREATE OR REPLACE FUNCTION update_expired_medicines()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE medicines
  SET status = 'expired'
  WHERE expiry_date < CURRENT_DATE
  AND status = 'available';
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_expired_medicines
AFTER INSERT OR UPDATE ON medicines
FOR EACH STATEMENT
EXECUTE FUNCTION update_expired_medicines();