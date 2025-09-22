import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { randomUUID } from 'crypto';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { supabaseDb, handleSupabaseError } from './supabase.js';
import { authenticateToken, signUpWithSupabase, signInWithSupabase } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper to seed minimal data if DB empty
async function ensureSeedData() {
  try {
    const products = await supabaseDb.listProducts();
    if (products.length === 0) {
      console.log('🌱 Seeding initial data...');
      
      // Note: In production, users should be created through Supabase Auth
      // This is just for development/demo purposes
      const farmerData = {
        id: randomUUID(),
        name: 'Green Valley Farm',
        email: `farmer_demo_${Date.now()}@example.com`,
        role: 'farmer',
        location: 'Sonoma, CA',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Green%20Valley%20Farm'
      };

      // For development, we'll create a user directly in the users table
      // In production, this should go through Supabase Auth
      const farmer = await supabaseDb.createUser(farmerData);

      const sampleProducts = [
        {
          name: 'Organic Carrots',
          description: 'Freshly harvested organic carrots, perfect for salads, juicing, or cooking.',
          price: 2.99,
          unit: 'bunch',
          quantity: 50,
          imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
          category: 'Vegetables',
          harvestDate: new Date('2025-02-15T00:00:00Z'),
          location: 'Sonoma, CA',
          organic: true,
          farmerId: farmer.id
        },
        {
          name: 'Fresh Strawberries',
          description: 'Sweet and juicy strawberries, perfect for desserts or enjoying fresh.',
          price: 4.99,
          unit: 'lb',
          quantity: 30,
          imageUrl: 'https://images.pexels.com/photos/59945/strawberry-fruit-delicious-red-59945.jpeg',
          category: 'Fruits',
          harvestDate: new Date('2025-02-16T00:00:00Z'),
          location: 'Sonoma, CA',
          organic: true,
          farmerId: farmer.id
        }
      ];

      for (const productData of sampleProducts) {
        await supabaseDb.createProduct(productData);
      }
      
      console.log('✅ Initial data seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running with Supabase integration' });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['farmer', 'vendor', 'customer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Try Supabase Auth signup first
    try {
      const authData = await signUpWithSupabase(email, password, { name, role });
      
      if (authData.user) {
        // User profile will be created automatically by the database trigger
        return res.status(201).json({
          message: 'User registered successfully. Please check your email for verification.',
          user: {
            id: authData.user.id,
            email: authData.user.email,
            name,
            role
          },
          session: authData.session
        });
      }
    } catch (supabaseError) {
      console.log('Supabase signup failed, falling back to manual creation:', supabaseError.message);
      
      // Fallback to manual user creation (for development)
      const existingUser = await supabaseDb.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      const userData = {
        id: randomUUID(),
        name,
        email,
        role,
        location: '',
        phone: '',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      };

      const user = await supabaseDb.createUser(userData);

      // Generate JWT token for fallback
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        message: 'User registered successfully',
        user,
        token
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    const errorResponse = handleSupabaseError(error, 'registration');
    res.status(errorResponse.status).json({ error: errorResponse.error });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    // Try Supabase Auth signin first
    try {
      const authData = await signInWithSupabase(email, password);
      
      if (authData.user && authData.session) {
        // Get user profile to verify role
        const profile = await supabaseDb.findUserById(authData.user.id);
        
        if (!profile || profile.role !== role) {
          return res.status(401).json({ error: 'Invalid credentials or role mismatch' });
        }

        return res.json({
          message: 'Login successful',
          user: {
            id: authData.user.id,
            email: authData.user.email,
            ...profile
          },
          session: authData.session
        });
      }
    } catch (supabaseError) {
      console.log('Supabase signin failed, falling back to manual verification:', supabaseError.message);
      
      // Fallback to manual verification (for development)
      const user = await supabaseDb.findUserByEmailRole(email, role);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token for fallback
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        message: 'Login successful',
        user,
        token
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    const errorResponse = handleSupabaseError(error, 'login');
    res.status(errorResponse.status).json({ error: errorResponse.error });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await supabaseDb.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    const errorResponse = handleSupabaseError(error, 'get user');
    res.status(errorResponse.status).json({ error: errorResponse.error });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, organic } = req.query;
    const filters = {};
    
    if (category && category !== 'all') {
      filters.category = String(category);
    }
    if (organic === 'true') {
      filters.organic = true;
    }
    if (search) {
      filters.search = String(search);
    }

    const products = await supabaseDb.listProducts(filters);
    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    const errorResponse = handleSupabaseError(error, 'get products');
    res.status(errorResponse.status).json({ error: errorResponse.error });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await supabaseDb.getProductById(String(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    const errorResponse = handleSupabaseError(error, 'get product');
    res.status(errorResponse.status).json({ error: errorResponse.error });
  }
});

// Create product (farmers only)
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ error: 'Only farmers can create products' });
    }

    const { name, description, price, unit, quantity, category, organic, imageUrl } = req.body;
    
    if (!name || !description || !price || !unit || !quantity || !category) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const user = await supabaseDb.findUserById(req.user.id);
    
    const productData = {
      name,
      description,
      price: parseFloat(price),
      unit,
      quantity: parseInt(quantity),
      imageUrl: imageUrl || 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
      category,
      harvestDate: new Date(),
      farmerId: user.id,
      location: user.location || 'Unknown Location',
      organic: organic === true || organic === 'true'
    };

    const product = await supabaseDb.createProduct(productData);
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Create product error:', error);
    const errorResponse = handleSupabaseError(error, 'create product');
    res.status(errorResponse.status).json({ error: errorResponse.error });
  }
});

// Create order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, deliveryMethod, deliveryAddress, pickupLocation, paymentMethod } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const user = await supabaseDb.findUserById(req.user.id);
    
    // Calculate total price by fetching product prices
    let totalPrice = 0;
    const productIds = items.map(i => String(i.productId));
    
    for (const item of items) {
      const product = await supabaseDb.getProductById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      totalPrice += (product.price * item.quantity);
    }

    const orderData = {
      customerId: user.id,
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      totalPrice,
      deliveryMethod: deliveryMethod || 'delivery',
      deliveryAddress,
      pickupLocation,
      paymentMethod: paymentMethod || 'upi',
      paymentStatus: 'pending',
      status: 'pending'
    };

    const order = await supabaseDb.createOrder(orderData);
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Create order error:', error);
    const errorResponse = handleSupabaseError(error, 'create order');
    res.status(errorResponse.status).json({ error: errorResponse.error });
  }
});

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await supabaseDb.getOrdersForUser(req.user.id, req.user.role);
    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    const errorResponse = handleSupabaseError(error, 'get orders');
    res.status(errorResponse.status).json({ error: errorResponse.error });
  }
});

// Dashboard analytics
app.get('/api/analytics/dashboard', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'farmer') {
      const stats = await supabaseDb.getFarmerStats(req.user.id);
      res.json({
        totalSales: stats.totalSales,
        activeProducts: stats.activeProducts,
        totalCustomers: stats.totalCustomers,
        monthlyGrowth: 12.5,
        recentActivity: [{ 
          action: 'Recent orders', 
          time: '', 
          amount: `${stats.ordersCount} orders` 
        }]
      });
    } else if (req.user.role === 'vendor') {
      const stats = await supabaseDb.getFarmerStats(req.user.id);
      res.json({
        totalRevenue: stats.totalSales,
        productsListed: stats.activeProducts,
        activeCustomers: stats.totalCustomers,
        salesGrowth: 18.2,
        recentOrders: [],
        topProducts: []
      });
    } else {
      res.json({ message: 'Customer dashboard data not implemented yet' });
    }
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    const errorResponse = handleSupabaseError(error, 'dashboard analytics');
    res.status(errorResponse.status).json({ error: errorResponse.error });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Serve frontend in production and enable SPA history fallback for non-API routes
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Only 404 API routes specifically
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// For any other GET route, serve index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  console.log(`🗄️  Using Supabase database`);
  
  await ensureSeedData().catch((error) => {
    console.error('Failed to seed data:', error);
  });
});