// Final comprehensive test for Supabase registration
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFinalRegistration() {
  console.log('🎯 Final Registration Test...\n');
  
  // Generate a unique test email
  const testEmail = `final-${Date.now()}@farmfresh.com`;
  const testPassword = 'testpassword123';
  const testName = 'Final Test User';
  const testRole = 'customer';
  
  try {
    console.log('Step 1: Testing auth signup...');
    console.log(`Email: ${testEmail}`);
    
    // Step 1: Auth signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    });
    
    if (authError) {
      console.error('❌ Auth signup failed:', authError.message);
      return false;
    }
    
    if (!authData.user?.id) {
      console.error('❌ No user ID returned');
      return false;
    }
    
    console.log('✅ Auth signup successful');
    console.log(`User ID: ${authData.user.id}`);
    console.log(`Email confirmed: ${authData.user.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`Session available: ${authData.session ? 'Yes' : 'No'}`);
    
    if (authData.user.email_confirmed_at) {
      console.log('\nStep 2: Email is confirmed, testing profile creation...');
      
      const { data: profile, error: profileError } = await supabase
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
      
      if (profileError) {
        console.error('❌ Profile creation failed:', profileError.message);
        return false;
      }
      
      console.log('✅ Profile created successfully');
      console.log('Profile:', profile);
      
      // Cleanup
      await supabase.from('users').delete().eq('id', authData.user.id);
      
    } else {
      console.log('\n📧 Email confirmation required.');
      console.log('In a real app:');
      console.log('1. User would receive an email');
      console.log('2. User clicks confirmation link');
      console.log('3. User is redirected back to app');
      console.log('4. App creates user profile after confirmation');
    }
    
    await supabase.auth.signOut();
    
    console.log('\n🎉 Registration flow test completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Also test the supabaseApi service
import('../src/services/supabaseApi.js').then(({ supabaseApiService }) => {
  console.log('\n🧪 Testing supabaseApiService.register()...\n');
  
  const testEmail2 = `service-${Date.now()}@farmfresh.com`;
  
  supabaseApiService.register('Service Test', testEmail2, 'testpassword123', 'customer')
    .then(result => {
      console.log('✅ supabaseApiService.register() successful');
      console.log('Result:', result);
      
      if (result.needsEmailConfirmation) {
        console.log('📧 Email confirmation required (expected)');
      }
      
      console.log('\n🎯 All tests completed!');
      console.log('\n📋 Summary:');
      console.log('✅ Supabase connection works');
      console.log('✅ Auth signup works');
      console.log('✅ Registration service works');
      console.log('📧 Email confirmation flow identified');
      
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ supabaseApiService.register() failed:', error.message);
      process.exit(1);
    });
}).catch(error => {
  console.error('❌ Could not import supabaseApiService:', error.message);
  
  testFinalRegistration().then(success => {
    process.exit(success ? 0 : 1);
  });
});