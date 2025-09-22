import { supabase } from '../lib/supabase';
import { register } from '../services/supabaseApi';

/**
 * Test user registration with detailed logging
 * This function tests the registration process with improved error handling
 */
export async function testRegistration() {
  console.log('Starting registration test with improved error logging...');
  
  // Generate a unique test email
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User';
  
  console.log(`Testing registration with email: ${testEmail}`);
  
  try {
    // First check if schema is properly applied
    console.log('Checking if users table exists...');
    const { data: tableExists, error: tableError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
      
    if (tableError) {
      console.error('Error checking users table:', tableError.message);
      return {
        success: false,
        message: `Schema error: ${tableError.message}`,
        details: tableError
      };
    }
    
    console.log('Users table exists, proceeding with registration test...');
    
    // Test the registration function
    const result = await register({
      email: testEmail,
      password: testPassword,
      name: testName,
      role: 'customer'
    });
    
    console.log('Registration test completed with result:', result);
    
    return {
      success: result.success,
      message: result.message || 'Registration test completed',
      details: result
    };
  } catch (error) {
    console.error('Unexpected error during registration test:', error);
    return {
      success: false,
      message: 'Unexpected error during registration test',
      details: error
    };
  }
}

/**
 * Run the registration test and log results
 */
export async function runRegistrationTest() {
  console.log('=== RUNNING REGISTRATION TEST ===');
  const result = await testRegistration();
  
  if (result.success) {
    console.log('✅ Registration test PASSED:', result.message);
  } else {
    console.error('❌ Registration test FAILED:', result.message);
    console.error('Details:', JSON.stringify(result.details, null, 2));
  }
  
  return result;
}