import { supabase, supabaseDb } from './server/supabase.js';
import { randomUUID } from 'crypto';
import 'dotenv/config';

console.log('🧪 Testing Supabase Integration...\n');

async function testSupabaseConnection() {
  try {
    // Test 1: Basic connection
    console.log('1. Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    console.log('✅ Connection successful');

    // Test 2: Test user operations
    console.log('\n2. Testing user operations...');
    const testUser = {
      id: randomUUID(),
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      role: 'customer',
      location: 'Test Location',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test'
    };

    const createdUser = await supabaseDb.createUser(testUser);
    console.log('✅ User created:', createdUser.name);

    const foundUser = await supabaseDb.findUserById(createdUser.id);
    console.log('✅ User retrieved:', foundUser.name);

    // Test 3: Test product operations
    console.log('\n3. Testing product operations...');
    const testProduct = {
      name: 'Test Product',
      description: 'A test product for integration testing',
      price: 9.99,
      unit: 'piece',
      quantity: 10,
      imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
      category: 'Test',
      harvestDate: new Date(),
      location: 'Test Farm',
      organic: true,
      farmerId: createdUser.id
    };

    const createdProduct = await supabaseDb.createProduct(testProduct);
    console.log('✅ Product created:', createdProduct.name);

    const products = await supabaseDb.listProducts({ category: 'Test' });
    console.log('✅ Products retrieved:', products.length, 'products');

    // Test 4: Test order operations
    console.log('\n4. Testing order operations...');
    const testOrder = {
      customerId: createdUser.id,
      items: [{ productId: createdProduct.id, quantity: 2 }],
      totalPrice: 19.98,
      deliveryMethod: 'delivery',
      deliveryAddress: '123 Test St',
      paymentMethod: 'upi',
      paymentStatus: 'pending',
      status: 'pending'
    };

    const createdOrder = await supabaseDb.createOrder(testOrder);
    console.log('✅ Order created:', createdOrder.id);

    const orders = await supabaseDb.getOrdersForUser(createdUser.id, 'customer');
    console.log('✅ Orders retrieved:', orders.length, 'orders');

    // Test 5: Test farmer stats
    console.log('\n5. Testing farmer stats...');
    const stats = await supabaseDb.getFarmerStats(createdUser.id);
    console.log('✅ Farmer stats:', {
      products: stats.activeProducts,
      sales: stats.totalSales,
      customers: stats.totalCustomers
    });

    console.log('\n🎉 All tests passed! Supabase integration is working correctly.');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

// Run the test
testSupabaseConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Supabase integration test completed successfully!');
      console.log('You can now start your server with: npm run dev:server');
    } else {
      console.log('\n❌ Supabase integration test failed!');
      console.log('Please check your Supabase configuration and try again.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
