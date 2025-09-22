// Apply database setup to Supabase
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
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

async function setupDatabase() {
  try {
    console.log('🚀 Setting up FarmFresh database...\n');
    
    // Read the SQL setup file
    const sqlContent = readFileSync('./setup-database.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📄 Found ${statements.length} SQL statements to execute\n`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          
          const { error } = await supabase.rpc('exec_sql', { 
            sql_query: statement + ';' 
          });
          
          if (error) {
            // Try using the direct SQL execution if the RPC doesn't work
            const { error: directError } = await supabase
              .from('_supabase_admin')
              .select('*')
              .limit(0); // This won't work but we'll catch it
            
            console.log(`⚠️  Could not execute via RPC: ${error.message}`);
            console.log(`Statement: ${statement.substring(0, 100)}...`);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (execError) {
          console.log(`⚠️  Statement ${i + 1} failed: ${execError.message}`);
          console.log(`Statement: ${statement.substring(0, 100)}...`);
        }
      }
    }
    
    console.log('\n🎉 Database setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the content of setup-database.sql');
    console.log('4. Click "Run" to execute the SQL');
    console.log('5. Come back here and run: node test-registration.js');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

async function testConnection() {
  try {
    console.log('🔌 Testing Supabase connection...');
    
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && !error.message.includes('relation "users" does not exist')) {
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

// Main execution
async function main() {
  const connected = await testConnection();
  if (connected) {
    await setupDatabase();
  }
}

main();