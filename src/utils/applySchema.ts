import { supabase } from '../lib/supabase';
import { createSqlFunctions } from './schemaSql';

/**
 * Utility to apply the Supabase schema to the database
 * This is a simplified version that creates the necessary tables if they don't exist
 */
export const applySchema = async () => {
  console.log('Applying Supabase schema...');
  const results: Record<string, boolean> = {};
  
  try {
    // First, create the SQL functions
    const functionsResult = await createSqlFunctions();
    if (!functionsResult.success) {
      console.error('Failed to create SQL functions');
      return functionsResult;
    }
    
    // Execute SQL directly to create the users table
    const createUsersSql = `
      DO $$
      BEGIN
        -- Create user_role enum if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('farmer', 'vendor', 'customer');
        END IF;
        
        -- Create users table if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
          CREATE TABLE users (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role user_role NOT NULL,
            location TEXT DEFAULT '',
            phone TEXT DEFAULT '',
            avatar TEXT DEFAULT '',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        END IF;
      END;
      $$;
    `;
    
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createUsersSql });
    results.createTables = !sqlError;
    console.log('Create tables:', results.createTables ? 'Success' : 'Failed', sqlError?.message || '');
    
    return {
      success: Object.values(results).every(result => result),
      results
    };
  } catch (error) {
    console.error('Schema application failed:', error);
    return {
      success: false,
      error
    };
  }
};

/**
 * Run the schema application and log results
 */
export const runSchemaApplication = async () => {
  console.log('Starting schema application...');
  console.log('Note: This requires appropriate database permissions');
  console.log('If you encounter errors, please run the SQL script manually in the Supabase SQL Editor');
  
  const result = await applySchema();
  console.log('Schema application complete:', result.success ? 'Success' : 'Failed');
  console.log('Detailed results:', result);
  return result;
};