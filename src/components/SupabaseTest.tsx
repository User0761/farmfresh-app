import React, { useState, useEffect } from 'react';
import { migrateMockDataToSupabase, clearSupabaseData } from '../utils/migrateData';
import { createTestUsers } from '../utils/createTestUsers';
import { apiService } from '../services/api';
import { runSchemaCheck } from '../utils/checkSchema';
import { runSchemaApplication } from '../utils/applySchema';
import { runRegistrationTest } from '../utils/testRegistration';

const SupabaseTest: React.FC = () => {
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const configured = !!(
      import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    setIsSupabaseConfigured(configured);
  }, []);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing Supabase connection...');
      
      // First, test the direct Supabase connection
      addResult('Testing direct Supabase connection...');
      const { testSupabaseConnection, checkUsersTable, testUserRegistration } = await import('../testSupabase');
      const connectionSuccess = await testSupabaseConnection();
      
      if (connectionSuccess) {
        addResult('✅ Direct Supabase connection successful!');
        
        // Check database schema
        addResult('Checking database schema...');
        const schemaResult = await runSchemaCheck();
        if (schemaResult.success) {
          addResult('✅ Database schema check passed');
        } else {
          addResult('❌ Database schema check failed');
          addResult(`Schema details: ${JSON.stringify(schemaResult.results || {})}`); 
        }
        
        // Check users table structure
        addResult('Checking users table structure...');
        const usersTableExists = await checkUsersTable();
        if (usersTableExists) {
          addResult('✅ Users table exists and is accessible');
        } else {
          addResult('❌ Users table check failed');
        }
        
        // Test user registration
        addResult('Testing user registration...');
        const registrationSuccess = await testUserRegistration();
        if (registrationSuccess) {
          addResult('✅ User registration test passed');
        } else {
          addResult('❌ User registration test failed');
        }
        
        // Test getting current user
        const user = await apiService.getCurrentUser();
        addResult(`Current user: ${user ? user.name : 'Not logged in'}`);
        
        // Test getting products
        const products = await apiService.getProducts();
        addResult(`Found ${products.length} products`);
        
        // Test getting orders
        const orders = await apiService.getOrders();
        addResult(`Found ${orders.length} orders`);
        
        addResult('✅ All tests completed!');
      } else {
        addResult('❌ Direct Supabase connection failed!');
      }
    } catch (error) {
      addResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createUsers = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Creating test users...');
      await createTestUsers();
      addResult('✅ Test users created!');
    } catch (error) {
      addResult(`❌ User creation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const migrateData = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Starting data migration...');
      await migrateMockDataToSupabase();
      addResult('✅ Data migration completed!');
    } catch (error) {
      addResult(`❌ Migration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Clearing data...');
      await clearSupabaseData();
      addResult('✅ Data cleared!');
    } catch (error) {
      addResult(`❌ Clear error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Supabase Not Configured
        </h3>
        <p className="text-yellow-700 mb-4">
          Please set up your Supabase environment variables in the .env file.
        </p>
        <div className="text-sm text-yellow-600">
          <p>Required variables:</p>
          <ul className="list-disc list-inside ml-4">
            <li>VITE_SUPABASE_URL</li>
            <li>VITE_SUPABASE_ANON_KEY</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Supabase Integration Test
      </h3>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Connection
          </button>
          
          <button
            onClick={async () => {
              setIsLoading(true);
              setTestResults([]);
              addResult('Applying database schema...');
              try {
                const result = await runSchemaApplication();
                if (result.success) {
                  addResult('✅ Schema applied successfully');
                } else {
                  addResult('❌ Failed to apply schema');
                  addResult(`Error details: ${JSON.stringify(result)}`);
                }
              } catch (error) {
                addResult(`❌ Error applying schema: ${error instanceof Error ? error.message : String(error)}`);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            Apply Schema
          </button>
          
          <button
            onClick={async () => {
              setIsLoading(true);
              setTestResults([]);
              addResult('Testing user registration...');
              try {
                const result = await runRegistrationTest();
                if (result.success) {
                  addResult('✅ User registration test passed');
                } else {
                  addResult('❌ User registration test failed');
                  addResult(`Error details: ${JSON.stringify(result)}`);
                }
              } catch (error) {
                addResult(`❌ Error testing registration: ${error instanceof Error ? error.message : String(error)}`);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            Test Registration
          </button>
          
          <button
            onClick={createUsers}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Create Test Users
          </button>
          
          <button
            onClick={migrateData}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Migrate Data
          </button>
          
          <button
            onClick={clearData}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Clear Data
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-gray-50 p-4 rounded border">
            <h4 className="font-medium text-gray-700 mb-2">Test Results:</h4>
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono text-gray-600">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Processing...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseTest;
