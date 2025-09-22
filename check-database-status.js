// Check if the database schema was properly applied
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStatus() {
  console.log('🔍 Checking database status...\n');
  
  try {
    // Check if tables exist
    console.log('1. Checking tables...');
    const tables = ['users', 'products', 'orders', 'order_items'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ Table '${table}' error: ${error.message}`);
        } else {
          console.log(`✅ Table '${table}' exists and is accessible`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}' check failed: ${err.message}`);
      }
    }
    
    console.log('\n2. Checking auth system...');
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log(`❌ Auth system error: ${error.message}`);
      } else {
        console.log('✅ Auth system is accessible');
      }
    } catch (err) {
      console.log(`❌ Auth system check failed: ${err.message}`);
    }
    
    console.log('\n3. Testing a simple auth operation...');
    try {
      // Try to get the current user (should be null but shouldn't error)
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.log(`❌ Auth operation error: ${error.message}`);
      } else {
        console.log('✅ Auth operations working (current user: none)');
      }
    } catch (err) {
      console.log(`❌ Auth operation failed: ${err.message}`);
    }
    
    console.log('\n4. Checking database permissions...');
    try {
      // Try to read from users table
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role')
        .limit(5);
      
      if (error) {
        console.log(`❌ Users table read error: ${error.message}`);
        console.log('This might indicate RLS policy issues or missing permissions');
      } else {
        console.log(`✅ Users table readable (found ${data?.length || 0} users)`);
        if (data && data.length > 0) {
          console.log('Sample user data:', data[0]);
        }
      }
    } catch (err) {
      console.log(`❌ Users table permission check failed: ${err.message}`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error during database check:', error.message);
  }
}

checkDatabaseStatus();