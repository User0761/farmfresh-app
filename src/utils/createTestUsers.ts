import { supabase } from '../lib/supabase';

// Test users data
const testUsers = [
  {
    email: 'farmer1@example.com',
    password: 'password123',
    name: 'Green Valley Farm',
    role: 'farmer' as const,
    location: 'Sonoma, CA',
    phone: '+1-555-0001'
  },
  {
    email: 'farmer2@example.com',
    password: 'password123',
    name: 'Sunny Side Farm',
    role: 'farmer' as const,
    location: 'Napa, CA',
    phone: '+1-555-0002'
  },
  {
    email: 'vendor1@example.com',
    password: 'password123',
    name: 'Fresh Marketplace',
    role: 'vendor' as const,
    location: 'San Francisco, CA',
    phone: '+1-555-0005'
  },
  {
    email: 'customer1@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'customer' as const,
    location: 'San Francisco, CA',
    phone: '+1-555-0006'
  },
  {
    email: 'customer2@example.com',
    password: 'password123',
    name: 'Jane Smith',
    role: 'customer' as const,
    location: 'San Francisco, CA',
    phone: '+1-555-0007'
  }
];

export async function createTestUsers() {
  console.log('Creating test users...');
  
  for (const userData of testUsers) {
    try {
      console.log(`Creating user: ${userData.email}`);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`User ${userData.email} already exists, skipping...`);
          continue;
        }
        throw authError;
      }

      // The user profile will be created automatically by the trigger
      // But let's update it with additional data
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .update({
            location: userData.location,
            phone: userData.phone
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error(`Error updating profile for ${userData.email}:`, profileError);
        } else {
          console.log(`✅ User ${userData.email} created successfully`);
        }
      }
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error);
    }
  }
  
  console.log('Test user creation completed!');
}

// Function to sign in as a test user (useful for testing)
export async function signInAsTestUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    console.log(`Signed in as: ${data.user?.email}`);
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

