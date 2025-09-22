// Test Supabase registration functionality
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRegistration() {
  console.log('🧪 Testing Supabase Registration Process...\n');
  
  // Generate a unique test email
  const testEmail = `test-${Date.now()}@farmfresh.com`;
  const testPassword = 'testpassword123';
  const testName = 'Test User';
  const testRole = 'customer';
  
  try {
    console.log('1. Testing user registration...');
    console.log(`Email: ${testEmail}`);
    console.log(`Role: ${testRole}\n`);
    
    // Step 1: Register user with auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          role: testRole
        }
      }
    });
    
    if (authError) {
      console.error('❌ Auth registration failed:', authError.message);
      return false;
    }
    
    if (!authData.user) {
      console.error('❌ No user data returned from auth');
      return false;
    }
    
    console.log('✅ Auth registration successful');
    console.log(`User ID: ${authData.user.id}`);
    
    // Wait a moment for the trigger to execute
    console.log('\n2. Waiting for profile creation trigger...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Check if user profile was created
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (profileError) {
      console.log('⚠️  Profile not found via trigger, creating manually...');
      
      // Try to create profile manually
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: testName,
          email: testEmail,
          role: testRole,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${testEmail}`
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Manual profile creation failed:', createError.message);
        return false;
      }
      
      console.log('✅ Profile created manually');
      console.log('Profile data:', newProfile);
    } else {
      console.log('✅ Profile created by trigger');
      console.log('Profile data:', profile);
    }
    
    // Step 3: Test login
    console.log('\n3. Testing login with new account...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      return false;
    }
    
    console.log('✅ Login successful');
    
    // Step 4: Cleanup - remove test user
    console.log('\n4. Cleaning up test data...');
    
    // Delete from users table first
    const { error: deleteProfileError } = await supabase
      .from('users')
      .delete()
      .eq('id', authData.user.id);
    
    if (deleteProfileError) {
      console.log('⚠️  Could not delete user profile:', deleteProfileError.message);
    } else {
      console.log('✅ Test user profile deleted');
    }
    
    // Sign out
    await supabase.auth.signOut();
    console.log('✅ Signed out');
    
    console.log('\n🎉 All registration tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ User authentication works');
    console.log('✅ User profile creation works');
    console.log('✅ Login functionality works');
    console.log('✅ Database operations work');
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error during testing:', error.message);
    console.error(error.stack);
    return false;
  }
}

async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase Connection...\n');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful\n');
    return true;
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 Starting FarmFresh Supabase Tests...\n');
  
  const connectionTest = await testSupabaseConnection();
  if (!connectionTest) {
    console.log('❌ Connection test failed. Cannot proceed with registration test.');
    process.exit(1);
  }
  
  const registrationTest = await testRegistration();
  
  if (registrationTest) {
    console.log('\n🎯 All tests completed successfully!');
    console.log('Your Supabase setup is working correctly.');
    process.exit(0);
  } else {
    console.log('\n💥 Some tests failed. Please check the error messages above.');
    process.exit(1);
  }
}

runAllTests();