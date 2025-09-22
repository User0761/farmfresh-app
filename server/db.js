import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'db.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    const initial = { users: [], products: [], orders: [], orderItems: [] };
    fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2), 'utf-8');
  }
}

function readDb() {
  ensureDataFile();
  const raw = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(db) {
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2), 'utf-8');
}

function cuid() {
  // Lightweight id generator
  return 'c' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const db = {
  async seedIfEmpty(createHashedPassword) {
    const state = readDb();
    if (state.products.length === 0) {
      const farmerId = cuid();
      state.users.push({
        id: farmerId,
        name: 'Green Valley Farm',
        email: `farmer_demo_${Date.now()}@example.com`,
        password: await createHashedPassword('password123'),
        role: 'farmer',
        location: 'Sonoma, CA',
        phone: '',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Green%20Valley%20Farm',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      const products = [
        {
          id: cuid(),
          name: 'Organic Carrots',
          description: 'Freshly harvested organic carrots, perfect for salads, juicing, or cooking.',
          price: 2.99,
          unit: 'bunch',
          quantity: 50,
          imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
          category: 'Vegetables',
          harvestDate: new Date('2025-02-15T00:00:00Z').toISOString(),
          farmerId,
          location: 'Sonoma, CA',
          organic: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: cuid(),
          name: 'Fresh Strawberries',
          description: 'Sweet and juicy strawberries, perfect for desserts or enjoying fresh.',
          price: 4.99,
          unit: 'lb',
          quantity: 30,
          imageUrl: 'https://images.pexels.com/photos/59945/strawberry-fruit-delicious-red-59945.jpeg',
          category: 'Fruits',
          harvestDate: new Date('2025-02-16T00:00:00Z').toISOString(),
          farmerId,
          location: 'Sonoma, CA',
          organic: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      state.products.push(...products);
      writeDb(state);
    }
  },

  // Users
  async findUserByEmailRole(email, role) {
    const state = readDb();
    return state.users.find(u => u.email === email && u.role === role) || null;
  },
  async findUserByEmail(email) {
    const state = readDb();
    return state.users.find(u => u.email === email) || null;
  },
  async findUserById(id) {
    const state = readDb();
    return state.users.find(u => u.id === id) || null;
  },
  async createUser(data) {
    const state = readDb();
    const now = new Date().toISOString();
    const user = { id: cuid(), createdAt: now, updatedAt: now, ...data };
    state.users.push(user);
    writeDb(state);
    return user;
  },

  // Products
  async listProducts(filter) {
    const state = readDb();
    let list = [...state.products];
    if (filter.category && filter.category !== 'all') {
      list = list.filter(p => (p.category || '').toLowerCase() === String(filter.category).toLowerCase());
    }
    if (filter.search) {
      const s = String(filter.search).toLowerCase();
      list = list.filter(p => (p.name || '').toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s));
    }
    if (filter.organic === true) {
      list = list.filter(p => !!p.organic);
    }
    // Include farmer object
    return list.map(p => ({ ...p, farmer: state.users.find(u => u.id === p.farmerId) || null }));
  },
  async getProductById(id) {
    const state = readDb();
    const p = state.products.find(p => p.id === id);
    if (!p) return null;
    return { ...p, farmer: state.users.find(u => u.id === p.farmerId) || null };
  },
  async createProduct(data) {
    const state = readDb();
    const now = new Date().toISOString();
    const product = { id: cuid(), createdAt: now, updatedAt: now, ...data };
    state.products.push(product);
    writeDb(state);
    return product;
  },

  // Orders
  async createOrder(data) {
    const state = readDb();
    const now = new Date().toISOString();
    const orderId = cuid();
    const order = {
      id: orderId,
      customerId: data.customerId,
      totalPrice: data.totalPrice,
      status: data.status || 'pending',
      deliveryMethod: data.deliveryMethod || 'delivery',
      deliveryAddress: data.deliveryAddress,
      pickupLocation: data.pickupLocation,
      paymentMethod: data.paymentMethod || 'upi',
      paymentStatus: data.paymentStatus || 'pending',
      createdAt: now,
      updatedAt: now
    };
    state.orders.push(order);
    for (const item of data.items || []) {
      state.orderItems.push({ id: cuid(), orderId, productId: item.productId, quantity: item.quantity });
    }
    writeDb(state);
    return {
      ...order,
      items: state.orderItems.filter(oi => oi.orderId === orderId).map(oi => ({
        ...oi,
        product: state.products.find(p => p.id === oi.productId) || null
      }))
    };
  },
  async listOrdersForUser(user) {
    const state = readDb();
    let orders = [];
    if (user.role === 'customer') {
      orders = state.orders.filter(o => o.customerId === user.id);
    } else if (user.role === 'farmer') {
      const myProductIds = new Set(state.products.filter(p => p.farmerId === user.id).map(p => p.id));
      orders = state.orders.filter(o => state.orderItems.some(oi => oi.orderId === o.id && myProductIds.has(oi.productId)));
    } else if (user.role === 'vendor') {
      // no vendor concept in data yet; reuse farmer logic
      const myProductIds = new Set(state.products.filter(p => p.farmerId === user.id).map(p => p.id));
      orders = state.orders.filter(o => state.orderItems.some(oi => oi.orderId === o.id && myProductIds.has(oi.productId)));
    }
    return orders
      .map(o => ({
        ...o,
        items: state.orderItems.filter(oi => oi.orderId === o.id).map(oi => ({
          ...oi,
          product: state.products.find(p => p.id === oi.productId) || null
        }))
      }))
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  },

  async countsForFarmer(farmerId) {
    const state = readDb();
    const myProducts = state.products.filter(p => p.farmerId === farmerId);
    const myProductIds = new Set(myProducts.map(p => p.id));
    const myOrders = state.orders.filter(o => state.orderItems.some(oi => oi.orderId === o.id && myProductIds.has(oi.productId)));
    const totalSales = myOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalCustomers = new Set(myOrders.map(o => o.customerId)).size;
    return { activeProducts: myProducts.length, totalSales, totalCustomers, ordersCount: myOrders.length };
  }
};



