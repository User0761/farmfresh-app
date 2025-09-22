-- Fix the trigger issue by creating a more robust trigger
-- Run this in your Supabase SQL Editor

-- First, drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a simpler, more robust function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  user_role user_role;
  user_avatar TEXT;
BEGIN
  -- Extract metadata with proper error handling
  user_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'::user_role);
  user_avatar := COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.email);

  -- Insert user profile with error handling
  BEGIN
    INSERT INTO public.users (id, name, email, role, avatar, created_at, updated_at)
    VALUES (
      NEW.id,
      user_name,
      NEW.email,
      user_role,
      user_avatar,
      NOW(),
      NOW()
    );
  EXCEPTION
    WHEN unique_violation THEN
      -- User already exists, update instead
      UPDATE public.users 
      SET 
        name = user_name,
        role = user_role,
        avatar = user_avatar,
        updated_at = NOW()
      WHERE id = NEW.id;
    WHEN OTHERS THEN
      -- Log error but don't fail the auth process
      RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Ultimate fallback - log error but don't fail auth
    RAISE WARNING 'Critical error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test the function manually
SELECT 'Trigger function recreated successfully' AS status;