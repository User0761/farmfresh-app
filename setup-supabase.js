// Simple setup script for Supabase integration
// Run this with: node setup-supabase.js

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Supabase integration for FarmFresh...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Creating .env file from template...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created!');
    console.log('⚠️  Please update the Supabase credentials in .env file\n');
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Check if Supabase client is installed
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hasSupabase = packageJson.dependencies && packageJson.dependencies['@supabase/supabase-js'];
  
  if (hasSupabase) {
    console.log('✅ Supabase client is installed');
  } else {
    console.log('⚠️  Supabase client not found in package.json');
    console.log('   Run: npm install @supabase/supabase-js');
  }
} else {
  console.log('❌ package.json not found');
}

console.log('\n📖 Next steps:');
console.log('1. Update your .env file with Supabase credentials');
console.log('2. Run the SQL schema in Supabase SQL Editor');
console.log('3. Start your dev server: npm run dev');
console.log('4. Add the SupabaseTest component to test the integration');
console.log('\n🎉 Setup complete! Happy coding!');

