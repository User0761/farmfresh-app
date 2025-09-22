import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are properly defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'farmer' | 'vendor' | 'customer';
          location: string;
          phone: string;
          avatar: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: 'farmer' | 'vendor' | 'customer';
          location?: string;
          phone?: string;
          avatar?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'farmer' | 'vendor' | 'customer';
          location?: string;
          phone?: string;
          avatar?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          unit: string;
          quantity: number;
          image_url: string;
          category: string;
          harvest_date: string;
          location: string;
          organic: boolean;
          farmer_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          unit: string;
          quantity: number;
          image_url: string;
          category: string;
          harvest_date: string;
          location?: string;
          organic?: boolean;
          farmer_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          unit?: string;
          quantity?: number;
          image_url?: string;
          category?: string;
          harvest_date?: string;
          location?: string;
          organic?: boolean;
          farmer_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          total_price: number;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          delivery_method: 'delivery' | 'pickup';
          delivery_address: string | null;
          pickup_location: string | null;
          payment_method: 'upi' | 'wallet' | 'cash';
          payment_status: 'pending' | 'paid' | 'failed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          total_price: number;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          delivery_method?: 'delivery' | 'pickup';
          delivery_address?: string | null;
          pickup_location?: string | null;
          payment_method?: 'upi' | 'wallet' | 'cash';
          payment_status?: 'pending' | 'paid' | 'failed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          total_price?: number;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          delivery_method?: 'delivery' | 'pickup';
          delivery_address?: string | null;
          pickup_location?: string | null;
          payment_method?: 'upi' | 'wallet' | 'cash';
          payment_status?: 'pending' | 'paid' | 'failed';
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
        };
      };
    };
  };
}
