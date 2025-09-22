import { supabase } from './supabase.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to authenticate Supabase JWT tokens
export const authenticateSupabaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify the Supabase JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Get user profile from our users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: profile.role,
      ...profile
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ error: 'Authentication failed' });
  }
};

// Fallback JWT authentication (for backward compatibility)
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Combined authentication middleware - tries Supabase first, falls back to JWT
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // Try Supabase Auth first
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (!error && user) {
      // Get user profile from our users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileError && profile) {
        req.user = {
          id: user.id,
          email: user.email,
          role: profile.role,
          ...profile
        };
        return next();
      }
    }
  } catch (supabaseError) {
    console.log('Supabase auth failed, trying JWT fallback');
  }

  // Fallback to JWT verification
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper function to create user profile after Supabase Auth signup
export const createUserProfile = async (userId, userData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        name: userData.name || '',
        email: userData.email,
        role: userData.role || 'customer',
        location: userData.location || '',
        phone: userData.phone || '',
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || userData.email}`
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Helper function to sign up user with Supabase Auth
export const signUpWithSupabase = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          location: userData.location || '',
          phone: userData.phone || ''
        }
      }
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Supabase signup error:', error);
    throw error;
  }
};

// Helper function to sign in user with Supabase Auth
export const signInWithSupabase = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Supabase signin error:', error);
    throw error;
  }
};
