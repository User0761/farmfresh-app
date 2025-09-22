import { supabase } from '../lib/supabase';

/**
 * SQL functions to create database objects
 */
export const createSqlFunctions = async () => {
  console.log('Creating SQL functions for schema management...');
  
  try {
    // Create function to create user_role enum
    const createEnumFunctionSql = `
      CREATE OR REPLACE FUNCTION create_user_role_enum()
      RETURNS void AS $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('farmer', 'vendor', 'customer');
        END IF;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Create function to create users table
    const createUsersTableFunctionSql = `
      CREATE OR REPLACE FUNCTION create_users_table()
      RETURNS void AS $$
      BEGIN
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
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Execute SQL to create functions
    const { error: enumFunctionError } = await supabase.rpc('exec_sql', { sql: createEnumFunctionSql });
    if (enumFunctionError) {
      console.error('Error creating enum function:', enumFunctionError);
      return { success: false, error: enumFunctionError };
    }
    
    const { error: tableFunctionError } = await supabase.rpc('exec_sql', { sql: createUsersTableFunctionSql });
    if (tableFunctionError) {
      console.error('Error creating table function:', tableFunctionError);
      return { success: false, error: tableFunctionError };
    }
    
    console.log('SQL functions created successfully');
    return { success: true };
  } catch (error) {
    console.error('Error creating SQL functions:', error);
    return { success: false, error };
  }
};