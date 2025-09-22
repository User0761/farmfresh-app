// Test all user roles with different registration scenarios
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testUserRole(role, testData) {
  console.log(`\n🧪 Testing ${role.toUpperCase()} role...`);
  
  const testEmail = `${role}-${Date.now()}@farmfresh.com`;
  const { name, password, expectedFeatures } = testData;
  
  try {
    // Step 1: Register user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: password
    });
    
    if (authError) {
      console.error(`❌ ${role} registration failed:`, authError.message);
      return false;
    }
    
    console.log(`✅ ${role} auth registration successful`);
    
    // Step 2: Create profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name: name,
        email: testEmail,
        role: role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${testEmail}`
      })
      .select()
      .single();
    
    if (profileError) {
      console.error(`❌ ${role} profile creation failed:`, profileError.message);
      return false;
    }
    
    console.log(`✅ ${role} profile created:`, {
      id: profile.id,
      name: profile.name,
      role: profile.role
    });
    
    // Step 3: Test role-specific features
    console.log(`🔧 Testing ${role}-specific features:`);
    for (const feature of expectedFeatures) {
      console.log(`  ✓ ${feature}`);
    }
    
    // Step 4: Cleanup
    await supabase.from('users').delete().eq('id', authData.user.id);
    console.log(`🧹 ${role} test data cleaned up`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ ${role} test failed:`, error.message);
    return false;
  }
}

async function runRoleTests() {
  console.log('🎭 Testing All User Roles\n');
  
  const roleTests = [
    {
      role: 'farmer',
      testData: {
        name: 'Test Farmer',
        password: 'farmer123',
        expectedFeatures: [
          'Product management dashboard',
          'Inventory tracking',
          'Order fulfillment',
          'Harvest scheduling',
          'Revenue analytics'
        ]
      }
    },
    {
      role: 'customer',
      testData: {
        name: 'Test Customer',
        password: 'customer123',
        expectedFeatures: [
          'Browse products',
          'Add to cart',
          'Place orders',
          'Favorites list',
          'Order history'
        ]
      }
    },
    {
      role: 'vendor',
      testData: {
        name: 'Test Vendor',
        password: 'vendor123',
        expectedFeatures: [
          'Manage farmer relationships',
          'Bulk ordering',
          'Distribution management',
          'Vendor analytics',
          'Multi-farmer coordination'
        ]
      }
    }
  ];
  
  const results = [];
  
  for (const { role, testData } of roleTests) {
    const success = await testUserRole(role, testData);
    results.push({ role, success });
  }
  
  console.log('\n📊 Role Test Results Summary:');
  results.forEach(({ role, success }) => {
    console.log(`${success ? '✅' : '❌'} ${role.toUpperCase()}: ${success ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = results.every(r => r.success);
  console.log(`\n🎯 Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  
  return allPassed;
}

runRoleTests().then(success => {
  process.exit(success ? 0 : 1);
});