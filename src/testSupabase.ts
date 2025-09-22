// This file tests the Supabase connection

import { supabase } from './lib/supabase';

export const testSupabaseConnection = async () => {
  try {
    // A simple query to test the connection
    const { data, error } = await supabase.from('users').select('count', { count: 'exact' });
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection test successful!');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};

export const checkUsersTable = async () => {
  try {
    // Check if users table exists and has the expected structure
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .limit(1);
    
    if (error) {
      console.error('Error checking users table:', error.message);
      return false;
    }
    
    console.log('Users table exists and is accessible');
    console.log('Sample data:', data);
    return true;
  } catch (error) {
    console.error('Failed to check users table:', error);
    return false;
  }
};

export const testUserRegistration = async () => {
  try {
    // Test the auth.signUp functionality
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Test123456!';
    
    console.log(`Testing registration with email: ${testEmail}`);
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (error) {
      console.error('Registration test failed:', error.message);
      return false;
    }
    
    console.log('Registration test successful!', data);
    return true;
  } catch (error) {
    console.error('Registration test error:', error);
    return false;
  }
};