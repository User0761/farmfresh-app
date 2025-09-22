import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

// Create Supabase client for server-side operations
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error, operation) => {
  console.error(`Supabase ${operation} error:`, error);
  if (error.code === 'PGRST116') {
    return { error: 'No data found', status: 404 };
  }
  if (error.code === '23505') {
    return { error: 'Resource already exists', status: 409 };
  }
  if (error.code === '23503') {
    return { error: 'Invalid reference', status: 400 };
  }
  return { error: error.message || 'Database operation failed', status: 500 };
};

// Database helper functions
export const supabaseDb = {
  // Users
  async findUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data;
  },

  async findUserByEmailRole(email, role) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('role', role)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data;
  },

  async findUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data;
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    return data;
  },

  // Products
  async listProducts(filters = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        farmer:users!products_farmer_id_fkey(*)
      `)
      .order('created_at', { ascending: false });

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters.organic === true) {
      query = query.eq('organic', true);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    return data || [];
  },

  async getProductById(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        farmer:users!products_farmer_id_fkey(*)
      `)
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data;
  },

  async createProduct(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        description: productData.description,
        price: productData.price,
        unit: productData.unit,
        quantity: productData.quantity,
        image_url: productData.imageUrl,
        category: productData.category,
        harvest_date: productData.harvestDate,
        location: productData.location,
        organic: productData.organic,
        farmer_id: productData.farmerId
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    return data;
  },

  // Orders
  async createOrder(orderData) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_id: orderData.customerId,
        total_price: orderData.totalPrice,
        status: orderData.status || 'pending',
        delivery_method: orderData.deliveryMethod || 'delivery',
        delivery_address: orderData.deliveryAddress,
        pickup_location: orderData.pickupLocation,
        payment_method: orderData.paymentMethod || 'upi',
        payment_status: orderData.paymentStatus || 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity
    }));

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select(`
        *,
        product:products(*)
      `);

    if (itemsError) {
      throw itemsError;
    }

    return { ...order, items };
  },

  async getOrdersForUser(userId, userRole) {
    let query;
    
    if (userRole === 'customer') {
      query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(*)
          )
        `)
        .eq('customer_id', userId);
    } else if (userRole === 'farmer' || userRole === 'vendor') {
      // Get orders that contain products from this farmer
      query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products!inner(*)
          )
        `)
        .eq('items.product.farmer_id', userId);
    }

    if (query) {
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      return data || [];
    }
    
    return [];
  },

  async getFarmerStats(farmerId) {
    // Get product count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('farmer_id', farmerId);

    // Get orders with total sales
    const { data: orders } = await supabase
      .from('orders')
      .select(`
        total_price,
        customer_id,
        items:order_items!inner(
          product:products!inner(farmer_id)
        )
      `)
      .eq('items.product.farmer_id', farmerId);

    const totalSales = orders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;
    const totalCustomers = new Set(orders?.map(order => order.customer_id) || []).size;

    return {
      activeProducts: productCount || 0,
      totalSales,
      totalCustomers,
      ordersCount: orders?.length || 0
    };
  }
};
