import { supabase } from '../lib/supabase';
import { Product, Order, CartItem } from '../types';

class SupabaseApiService {
  // Auth methods
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile with role-specific data
    const { data: profile } = await supabase
      .from('users')
      .select(`
        *,
        farmer_profile:farmer_profiles(*),
        customer_profile:customer_profiles(*),
        vendor_profile:vendor_profiles(*)
      `)
      .eq('id', data.user.id)
      .single();

    // Update last login
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', data.user.id);

    return {
      user: profile,
      session: data.session,
    };
  }

  async register(name: string, email: string, password: string, role: 'farmer' | 'vendor' | 'customer') {
    try {
      console.log('SupabaseApi: Starting registration process for:', email, 'with role:', role);
      
      // Step 1: Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        console.error('SupabaseApi: Auth signup error:', error);
        throw new Error(error.message || 'Failed to create account');
      }
      
      if (!data.user || !data.user.id) {
        console.error('SupabaseApi: Auth signup succeeded but no user ID was returned');
        throw new Error('Failed to create user account - no user ID returned');
      }
      
      console.log('SupabaseApi: Auth signup successful, user ID:', data.user.id);
      console.log('SupabaseApi: Email confirmed?', data.user.email_confirmed_at ? 'Yes' : 'No');

      // Step 2: Create user profile using service role approach or session
      console.log('SupabaseApi: Creating user profile with role:', role);
      
      let profile;
      let session = data.session;
      
      // If email is confirmed and we have a session, use it
      if (data.session && data.user.email_confirmed_at) {
        console.log('SupabaseApi: Using authenticated session for profile creation');
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name,
            email,
            role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
          })
          .select()
          .single();
        
        if (profileError) {
          console.error('SupabaseApi: Profile creation with session failed:', profileError);
          throw new Error(profileError.message || 'Failed to create user profile');
        }
        
        profile = profileData;
      } else {
        // For unconfirmed emails, we'll create the profile when they confirm
        // For now, return a basic user object
        console.log('SupabaseApi: Email not confirmed, creating basic profile');
        profile = {
          id: data.user.id,
          name,
          email,
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          location: '',
          phone: ''
        };
        
        // Store profile data for later creation
        if (typeof window !== 'undefined') {
          localStorage.setItem('pending_user_profile', JSON.stringify({
            id: data.user.id,
            name,
            email,
            role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
          }));
        }
      }
      
      console.log('SupabaseApi: Registration completed');
      
      return {
        user: profile,
        session: session,
        needsEmailConfirmation: !data.user.email_confirmed_at
      };
      
    } catch (error: any) {
      console.error('SupabaseApi: Registration process failed:', error);
      
      // Provide more specific error messages
      if (error.message.includes('duplicate') || error.message.includes('already exists')) {
        throw new Error('An account with this email already exists');
      }
      
      if (error.message.includes('invalid email')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (error.message.includes('password')) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      throw error;
    }
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select(`
        *,
        farmer_profile:farmer_profiles(*),
        customer_profile:customer_profiles(*),
        vendor_profile:vendor_profiles(*)
      `)
      .eq('id', user.id)
      .single();

    return profile;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Enhanced Profile Management
  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateRoleProfile(userId: string, role: string, updates: any) {
    let table = '';
    switch (role) {
      case 'farmer':
        table = 'farmer_profiles';
        break;
      case 'customer':
        table = 'customer_profiles';
        break;
      case 'vendor':
        table = 'vendor_profiles';
        break;
      default:
        throw new Error('Invalid role');
    }

    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    // Update user profile with new avatar URL
    await this.updateUserProfile(userId, { 
      profile_image_url: data.publicUrl 
    });

    return data.publicUrl;
  }

  // Product methods
  async getProducts(filters?: { category?: string; search?: string; organic?: boolean }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        farmer:users!farmer_id(name, location)
      `);

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters?.organic !== undefined) {
      query = query.eq('organic', filters.organic);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(this.transformProduct) || [];
  }

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        farmer:users!farmer_id(name, location)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return this.transformProduct(data);
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('products')
      .insert({
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
        farmer_id: productData.farmerId,
      })
      .select(`
        *,
        farmer:users!farmer_id(name, location)
      `)
      .single();

    if (error) throw error;

    return this.transformProduct(data);
  }

  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        description: updates.description,
        price: updates.price,
        unit: updates.unit,
        quantity: updates.quantity,
        image_url: updates.imageUrl,
        category: updates.category,
        harvest_date: updates.harvestDate,
        location: updates.location,
        organic: updates.organic,
      })
      .eq('id', id)
      .select(`
        *,
        farmer:users!farmer_id(name, location)
      `)
      .single();

    if (error) throw error;

    return this.transformProduct(data);
  }

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Order methods
  async createOrder(orderData: {
    customerId: string;
    items: CartItem[];
    totalPrice: number;
    deliveryMethod: 'delivery' | 'pickup';
    deliveryAddress?: string;
    pickupLocation?: string;
    paymentMethod: 'upi' | 'wallet' | 'cash';
  }) {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: orderData.customerId,
        total_price: orderData.totalPrice,
        delivery_method: orderData.deliveryMethod,
        delivery_address: orderData.deliveryAddress,
        pickup_location: orderData.pickupLocation,
        payment_method: orderData.paymentMethod,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return this.transformOrder(order);
  }

  async getOrders(userId?: string) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        customer:users!customer_id(name),
        order_items(
          quantity,
          product:products(
            id,
            name,
            description,
            price,
            unit,
            image_url,
            category,
            harvest_date,
            location,
            organic,
            farmer:users!farmer_id(name, location)
          )
        )
      `);

    if (userId) {
      query = query.eq('customer_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(this.transformOrder) || [];
  }

  async updateOrderStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return this.transformOrder(data);
  }

  // Analytics methods
  async getDashboardAnalytics(userId: string, role: string) {
    const analytics: any = {};

    if (role === 'farmer') {
      // Get farmer's products and orders
      const { data: products } = await supabase
        .from('products')
        .select('id, quantity, price')
        .eq('farmer_id', userId);

      const { data: orders } = await supabase
        .from('orders')
        .select(`
          total_price,
          created_at,
          order_items(
            quantity,
            product:products(farmer_id)
          )
        `)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      analytics.totalProducts = products?.length || 0;
      analytics.totalRevenue = orders?.reduce((sum: number, order: any) => {
        const farmerOrders = order.order_items?.filter((item: any) => 
          item.product?.farmer_id === userId
        );
        return sum + (farmerOrders?.reduce((itemSum: number, item: any) => 
          itemSum + (item.quantity * (item.product?.price || 0)), 0) || 0);
      }, 0) || 0;
    }

    return analytics;
  }

  // Real-time subscriptions
  subscribeToOrders(callback: (payload: any) => void) {
    return supabase
      .channel('orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        callback
      )
      .subscribe();
  }

  subscribeToProducts(callback: (payload: any) => void) {
    return supabase
      .channel('products')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        callback
      )
      .subscribe();
  }

  // Enhanced real-time subscriptions for specific user roles
  subscribeToFarmerOrders(farmerId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`farmer-orders-${farmerId}`)
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `farmer_id=eq.${farmerId}`
        },
        callback
      )
      .subscribe();
  }

  subscribeToCustomerOrders(customerId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`customer-orders-${customerId}`)
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `customer_id=eq.${customerId}`
        },
        callback
      )
      .subscribe();
  }

  subscribeToInventoryChanges(farmerId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`inventory-${farmerId}`)
      .on('postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'products',
          filter: `farmer_id=eq.${farmerId}`
        },
        callback
      )
      .subscribe();
  }

  subscribeToUserStatus(callback: (payload: any) => void) {
    return supabase
      .channel('user-status')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users' },
        callback
      )
      .subscribe();
  }

  // Helper methods
  private transformProduct(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      unit: data.unit,
      quantity: data.quantity,
      imageUrl: data.image_url,
      category: data.category,
      harvestDate: data.harvest_date,
      farmerId: data.farmer_id,
      farmerName: data.farmer?.name || '',
      location: data.location,
      organic: data.organic,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private transformOrder(data: any): Order {
    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.customer?.name || '',
      items: data.order_items?.map((item: any) => ({
        productId: item.product.id,
        product: this.transformProduct(item.product),
        quantity: item.quantity,
      })) || [],
      totalPrice: data.total_price,
      status: data.status,
      deliveryMethod: data.delivery_method,
      deliveryAddress: data.delivery_address,
      pickupLocation: data.pickup_location,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export const supabaseApiService = new SupabaseApiService();
