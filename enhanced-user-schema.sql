-- Enhanced User Profile Schema
-- Run this in your Supabase SQL Editor

-- Add additional columns to users table for enhanced profiles
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS state TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS postal_code TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS profile_image_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create role-specific profile tables

-- Farmer-specific profile data
CREATE TABLE IF NOT EXISTS farmer_profiles (
  id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  farm_name TEXT DEFAULT '',
  farm_size_acres DECIMAL(10,2),
  farming_experience_years INTEGER,
  organic_certified BOOLEAN DEFAULT FALSE,
  certifications TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  farming_methods TEXT[] DEFAULT '{}',
  seasonal_availability JSONB DEFAULT '{}',
  delivery_radius_km INTEGER DEFAULT 50,
  minimum_order_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer-specific profile data
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  dietary_preferences TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  favorite_categories TEXT[] DEFAULT '{}',
  preferred_delivery_time TEXT DEFAULT 'anytime',
  delivery_instructions TEXT DEFAULT '',
  loyalty_points INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor-specific profile data
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT DEFAULT '',
  business_type TEXT DEFAULT '',
  license_number TEXT DEFAULT '',
  tax_id TEXT DEFAULT '',
  distribution_areas TEXT[] DEFAULT '{}',
  partner_farmers UUID[] DEFAULT '{}',
  commission_rate DECIMAL(5,2) DEFAULT 0,
  minimum_volume_requirements JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_organic ON farmer_profiles(organic_certified);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_delivery_radius ON farmer_profiles(delivery_radius_km);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_loyalty ON customer_profiles(loyalty_points);

-- Add triggers for role-specific profile creation
CREATE OR REPLACE FUNCTION create_role_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'farmer' THEN
    INSERT INTO farmer_profiles (id) VALUES (NEW.id);
  ELSIF NEW.role = 'customer' THEN
    INSERT INTO customer_profiles (id) VALUES (NEW.id);
  ELSIF NEW.role = 'vendor' THEN
    INSERT INTO vendor_profiles (id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic role profile creation
DROP TRIGGER IF EXISTS create_role_profile_trigger ON users;
CREATE TRIGGER create_role_profile_trigger
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_role_profile();

-- Update RLS policies for role-specific tables
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;

-- Farmer profiles policies
CREATE POLICY "Farmers can manage their own profile" ON farmer_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Anyone can view farmer profiles" ON farmer_profiles
  FOR SELECT USING (true);

-- Customer profiles policies  
CREATE POLICY "Customers can manage their own profile" ON customer_profiles
  FOR ALL USING (auth.uid() = id);

-- Vendor profiles policies
CREATE POLICY "Vendors can manage their own profile" ON vendor_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Anyone can view vendor profiles" ON vendor_profiles
  FOR SELECT USING (true);

-- Add updated_at triggers for role-specific tables
CREATE TRIGGER update_farmer_profiles_updated_at BEFORE UPDATE ON farmer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON customer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_profiles_updated_at BEFORE UPDATE ON vendor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

SELECT 'Enhanced user profiles schema created successfully' AS status;