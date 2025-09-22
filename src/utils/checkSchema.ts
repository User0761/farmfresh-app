import { supabase } from '../lib/supabase';

/**
 * Utility to check if the Supabase schema has been properly applied
 */
export const checkSchema = async () => {
  console.log('Checking Supabase schema...');
  const results: Record<string, boolean> = {};
  
  try {
    // Check if users table exists
    const { error: usersError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    results.usersTable = !usersError;
    console.log('Users table check:', results.usersTable ? 'Passed' : 'Failed', usersError?.message || '');
    
    // Check if products table exists
    const { error: productsError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true });
    
    results.productsTable = !productsError;
    console.log('Products table check:', results.productsTable ? 'Passed' : 'Failed', productsError?.message || '');
    
    // Check if orders table exists
    const { error: ordersError } = await supabase
      .from('orders')
      .select('count', { count: 'exact', head: true });
    
    results.ordersTable = !ordersError;
    console.log('Orders table check:', results.ordersTable ? 'Passed' : 'Failed', ordersError?.message || '');
    
    // Check if user_role enum exists by trying to insert an invalid role
    const testEmail = `test-${Date.now()}@example.com`;
    const { error: enumError } = await supabase
      .from('users')
      .insert({
        id: '00000000-0000-0000-0000-000000000000', // This will fail anyway due to FK constraint
        name: 'Test User',
        email: testEmail,
        role: 'invalid_role' // This should fail if enum is properly set up
      })
      .select();
    
    // If we get a specific error about invalid role, the enum is working
    results.userRoleEnum = enumError?.message?.includes('invalid_role') || false;
    console.log('User role enum check:', results.userRoleEnum ? 'Passed' : 'Failed');
    
    return {
      success: Object.values(results).every(result => result),
      results
    };
  } catch (error) {
    console.error('Schema check failed:', error);
    return {
      success: false,
      error
    };
  }
};

/**
 * Run the schema check and log results
 */
export const runSchemaCheck = async () => {
  const result = await checkSchema();
  console.log('Schema check complete:', result.success ? 'All checks passed' : 'Some checks failed');
  console.log('Detailed results:', result);
  return result;
};