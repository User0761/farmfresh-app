import { supabase } from '../lib/supabase';
import { mockProducts, mockOrders } from '../data/mockData';

export async function migrateMockDataToSupabase() {
  try {
    console.log('Starting data migration to Supabase...');

    // First, check if we have any existing users
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id, email');

    if (existingUsers && existingUsers.length > 0) {
      console.log('Users already exist, skipping user creation');
    } else {
      console.log('No users found. Please create users through the registration process first.');
      console.log('You can register users at: /register');
      return;
    }

    // Create a mapping of emails to user IDs
    const userMap = new Map<string, string>();
    existingUsers?.forEach(user => {
      userMap.set(user.email, user.id);
    });

    // Get a farmer user ID for products (use the first farmer found)
    const farmerUser = existingUsers?.find(user => user.email.includes('farmer'));
    if (!farmerUser) {
      console.log('No farmer users found. Please register a farmer account first.');
      return;
    }

    // Transform and insert products
    const products = mockProducts.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      quantity: product.quantity,
      image_url: product.imageUrl,
      category: product.category,
      harvest_date: product.harvestDate,
      location: product.location,
      organic: product.organic,
      farmer_id: farmerUser.id, // Use the actual farmer user ID
      created_at: product.createdAt,
      updated_at: product.updatedAt
    }));

    const { error: productsError } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'id' });

    if (productsError) {
      console.error('Error inserting products:', productsError);
      return;
    }

    console.log('Products inserted successfully');

    // Get a customer user ID for orders (use the first customer found)
    const customerUser = existingUsers?.find(user => user.email.includes('customer'));
    if (!customerUser) {
      console.log('No customer users found. Please register a customer account first.');
      return;
    }

    // Transform and insert orders
    const orders = mockOrders.map(order => ({
      id: order.id,
      customer_id: customerUser.id, // Use the actual customer user ID
      total_price: order.totalPrice,
      status: order.status,
      delivery_method: order.deliveryMethod,
      delivery_address: order.deliveryAddress,
      pickup_location: order.pickupLocation,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      created_at: order.createdAt,
      updated_at: order.updatedAt
    }));

    const { error: ordersError } = await supabase
      .from('orders')
      .upsert(orders, { onConflict: 'id' });

    if (ordersError) {
      console.error('Error inserting orders:', ordersError);
      return;
    }

    console.log('Orders inserted successfully');

    // Insert order items
    const orderItems = mockOrders.flatMap(order => 
      order.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity
      }))
    );

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .upsert(orderItems, { onConflict: 'id' });

    if (orderItemsError) {
      console.error('Error inserting order items:', orderItemsError);
      return;
    }

    console.log('Order items inserted successfully');
    console.log('Data migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Function to clear all data (useful for testing)
export async function clearSupabaseData() {
  try {
    console.log('Clearing Supabase data...');

    // Delete in reverse order of dependencies
    await supabase.from('order_items').delete().neq('id', '');
    await supabase.from('orders').delete().neq('id', '');
    await supabase.from('products').delete().neq('id', '');
    await supabase.from('users').delete().neq('id', '');

    console.log('Data cleared successfully');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}
