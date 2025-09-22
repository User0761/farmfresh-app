// This file ensures environment variables are loaded before the application starts

// Check if Supabase environment variables are loaded
const checkSupabaseEnv = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing!');
    console.error('Please ensure you have the following in your .env file:');
    console.error('VITE_SUPABASE_URL=https://your-project-id.supabase.co');
    console.error('VITE_SUPABASE_ANON_KEY=your-anon-key');
  } else {
    console.log('Supabase environment variables loaded successfully!');
  }

  return { supabaseUrl, supabaseAnonKey };
};

export default checkSupabaseEnv;