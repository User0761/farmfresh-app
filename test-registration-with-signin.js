// Test registration with sign-in before profile creation
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRegistrationWithSignIn() {
  console.log('🧪 Testing Registration with Sign-In...\n');
  
  // Generate a unique test email
  const testEmail = `signin-${Date.now()}@farmfresh.com`;
  const testPassword = 'testpassword123';
  const testName = 'SignIn Test User';
  const testRole = 'customer';
  
  try {
    console.log('Step 1: Auth signup...');
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
    
    console.log('\nStep 2: Sign in to establish session...');
    
    // Step 2: Sign in immediately to establish session
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message);
      return false;
    }
    
    console.log('✅ Sign in successful');
    console.log('Session established for user:', signInData.user.id);
    
    console.log('\nStep 3: Create profile with active session...');
    
    // Step 3: Create profile with active session
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
    
    console.log('\nStep 4: Verify profile can be read...');
    
    // Step 4: Verify profile can be read
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
    
    console.log('\n🎉 Registration with sign-in test passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

testRegistrationWithSignIn().then(success => {
  if (success) {
    console.log('\n✅ Registration with sign-in works!');
    console.log('Your Supabase registration is now properly configured.');
  } else {
    console.log('\n❌ Registration with sign-in failed.');
  }
  process.exit(success ? 0 : 1);
});