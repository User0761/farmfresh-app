// Test manual registration (without trigger)
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testManualRegistration() {
  console.log('🧪 Testing Manual Registration (without trigger)...\n');
  
  // Generate a unique test email
  const testEmail = `manual-${Date.now()}@farmfresh.com`;
  const testPassword = 'testpassword123';
  const testName = 'Manual Test User';
  const testRole = 'customer';
  
  try {
    console.log('Step 1: Basic auth signup...');
    console.log(`Email: ${testEmail}`);
    
    // Step 1: Basic auth signup without metadata
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
    
    console.log('\nStep 2: Manual profile creation...');
    
    // Wait a moment for auth to settle
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 2: Manually create profile
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
      console.error('Error details:', JSON.stringify(profileError, null, 2));
      return false;
    }
    
    console.log('✅ Profile created successfully');
    console.log('Profile:', profile);
    
    console.log('\nStep 3: Testing login...');
    
    // Step 3: Test login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      return false;
    }
    
    console.log('✅ Login successful');
    
    console.log('\nStep 4: Fetching user profile after login...');
    
    // Step 4: Fetch profile to verify everything works
    const { data: fetchedProfile, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (fetchError) {
      console.error('❌ Profile fetch failed:', fetchError.message);
      return false;
    }
    
    console.log('✅ Profile fetched successfully');
    console.log('Fetched profile:', fetchedProfile);
    
    console.log('\n🧹 Cleaning up...');
    
    // Cleanup
    await supabase.from('users').delete().eq('id', authData.user.id);
    await supabase.auth.signOut();
    
    console.log('\n🎉 Manual registration test passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

testManualRegistration().then(success => {
  if (success) {
    console.log('\n✅ Manual registration approach works!');
    console.log('You can now disable the trigger and use manual profile creation.');
  } else {
    console.log('\n❌ Manual registration approach failed.');
  }
  process.exit(success ? 0 : 1);
});