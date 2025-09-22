-- Temporarily disable the trigger to test manual user creation
-- Run this in your Supabase SQL Editor

-- Drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function as well
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Add a simple test to verify tables are working
INSERT INTO public.users (
  id,
  name,
  email,
  role,
  avatar,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Test User',
  'test@example.com',
  'customer',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Clean up the test user
DELETE FROM public.users WHERE email = 'test@example.com';

SELECT 'Trigger disabled, manual user creation enabled' AS status;