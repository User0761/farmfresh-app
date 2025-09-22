// Debug registration process step by step
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugRegistration() {
  console.log('🐛 Debug: Step-by-step registration process...\n');
  
  // Generate a unique test email
  const testEmail = `debug-${Date.now()}@farmfresh.com`;
  const testPassword = 'testpassword123';
  const testName = 'Debug User';
  const testRole = 'customer';
  
  console.log(`Testing with email: ${testEmail}\n`);
  
  try {
    console.log('Step 1: Testing basic auth signup (without metadata)...');
    
    // First, try a basic signup without metadata
    const { data: basicAuth, error: basicError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    });
    
    if (basicError) {
      console.log(`❌ Basic auth signup failed: ${basicError.message}`);
      console.log('Error details:', JSON.stringify(basicError, null, 2));
      
      // Check if it's an email already exists error
      if (basicError.message.includes('already') || basicError.message.includes('exists')) {
        console.log('\n🔄 Email might already exist, trying with new email...');
        const newEmail = `debug-new-${Date.now()}@farmfresh.com`;
        console.log(`New email: ${newEmail}`);
        
        const { data: retryAuth, error: retryError } = await supabase.auth.signUp({
          email: newEmail,
          password: testPassword
        });
        
        if (retryError) {
          console.log(`❌ Retry also failed: ${retryError.message}`);
          return false;
        } else {
          console.log('✅ Retry successful with new email');
          console.log('Auth data:', JSON.stringify({
            user_id: retryAuth.user?.id,
            email: retryAuth.user?.email,
            confirmed_at: retryAuth.user?.confirmed_at
          }, null, 2));
        }
      }
      return false;
    }
    
    console.log('✅ Basic auth signup successful');
    console.log('Auth response:', JSON.stringify({
      user_id: basicAuth.user?.id,
      email: basicAuth.user?.email,
      confirmed_at: basicAuth.user?.confirmed_at,
      session: basicAuth.session ? 'present' : 'null'
    }, null, 2));
    
    if (!basicAuth.user?.id) {
      console.log('❌ No user ID returned');
      return false;
    }
    
    console.log('\nStep 2: Manually creating user profile...');
    
    // Try to manually insert the user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: basicAuth.user.id,
        name: testName,
        email: testEmail,
        role: testRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${testEmail}`
      })
      .select()
      .single();
    
    if (profileError) {
      console.log(`❌ Manual profile creation failed: ${profileError.message}`);
      console.log('Profile error details:', JSON.stringify(profileError, null, 2));
    } else {
      console.log('✅ Manual profile creation successful');
      console.log('Profile data:', profile);
    }
    
    console.log('\nStep 3: Testing with metadata...');
    
    // Try signup with metadata (new email)
    const metadataEmail = `metadata-${Date.now()}@farmfresh.com`;
    const { data: metaAuth, error: metaError } = await supabase.auth.signUp({
      email: metadataEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          role: testRole
        }
      }
    });
    
    if (metaError) {
      console.log(`❌ Metadata signup failed: ${metaError.message}`);
      console.log('Metadata error details:', JSON.stringify(metaError, null, 2));
    } else {
      console.log('✅ Metadata signup successful');
      console.log('Metadata auth response:', JSON.stringify({
        user_id: metaAuth.user?.id,
        email: metaAuth.user?.email,
        user_metadata: metaAuth.user?.user_metadata
      }, null, 2));
      
      // Wait for trigger to execute
      console.log('\nWaiting 3 seconds for trigger...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if profile was created by trigger
      const { data: triggerProfile, error: triggerError } = await supabase
        .from('users')
        .select('*')
        .eq('id', metaAuth.user.id)
        .single();
      
      if (triggerError) {
        console.log(`❌ Trigger profile not found: ${triggerError.message}`);
      } else {
        console.log('✅ Trigger profile created successfully');
        console.log('Trigger profile data:', triggerProfile);
      }
    }
    
    console.log('\n🧹 Cleaning up test data...');
    
    // Clean up
    if (basicAuth.user?.id) {
      await supabase.from('users').delete().eq('id', basicAuth.user.id);
    }
    if (metaAuth?.user?.id) {
      await supabase.from('users').delete().eq('id', metaAuth.user.id);
    }
    
    await supabase.auth.signOut();
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

debugRegistration();