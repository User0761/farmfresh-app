import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { RealtimeProvider } from './context/RealtimeContext';
import Layout from './layouts/Layout';
import HomePage from './pages/HomePage';
import FarmerDashboard from './pages/farmer/Dashboard';
import FarmerProducts from './pages/farmer/Products';
import FarmerOrders from './pages/farmer/Orders';
import FarmerCustomers from './pages/farmer/Customers';
import FarmerAnalytics from './pages/farmer/Analytics';
import FarmerSettings from './pages/farmer/Settings';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/Products';
import VendorOrders from './pages/vendor/Orders';
import VendorCustomers from './pages/vendor/Customers';
import VendorAnalytics from './pages/vendor/Analytics';
import VendorSettings from './pages/vendor/Settings';
import VendorInventory from './pages/vendor/Inventory';
import VendorPurchases from './pages/vendor/Purchases';
import CustomerHome from './pages/customer/Home';
import CustomerProducts from './pages/customer/Products';
import CustomerCart from './pages/customer/Cart';
import CustomerOrders from './pages/customer/Orders';
import CustomerFavorites from './pages/customer/Favorites';
import CustomerProfile from './pages/customer/Profile';
import CustomerSettings from './pages/customer/Settings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <RealtimeProvider>
          <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              {/* Convenience indexes for section roots */}
              <Route path="customer" element={<CustomerHome />} />
              <Route path="farmer" element={<FarmerDashboard />} />
              <Route path="vendor" element={<VendorDashboard />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="product/:id" element={<ProductDetail />} />
              
              {/* Farmer Routes */}
              <Route path="farmer/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
              <Route path="farmer/products" element={<ProtectedRoute><FarmerProducts /></ProtectedRoute>} />
              <Route path="farmer/orders" element={<ProtectedRoute><FarmerOrders /></ProtectedRoute>} />
              <Route path="farmer/customers" element={<ProtectedRoute><FarmerCustomers /></ProtectedRoute>} />
              <Route path="farmer/analytics" element={<ProtectedRoute><FarmerAnalytics /></ProtectedRoute>} />
              <Route path="farmer/settings" element={<ProtectedRoute><FarmerSettings /></ProtectedRoute>} />
              
              {/* Vendor Routes */}
              <Route path="vendor/dashboard" element={<ProtectedRoute><VendorDashboard /></ProtectedRoute>} />
              <Route path="vendor/products" element={<ProtectedRoute><VendorProducts /></ProtectedRoute>} />
              <Route path="vendor/orders" element={<ProtectedRoute><VendorOrders /></ProtectedRoute>} />
              <Route path="vendor/customers" element={<ProtectedRoute><VendorCustomers /></ProtectedRoute>} />
              <Route path="vendor/analytics" element={<ProtectedRoute><VendorAnalytics /></ProtectedRoute>} />
              <Route path="vendor/settings" element={<ProtectedRoute><VendorSettings /></ProtectedRoute>} />
              <Route path="vendor/inventory" element={<ProtectedRoute><VendorInventory /></ProtectedRoute>} />
              <Route path="vendor/purchases" element={<ProtectedRoute><VendorPurchases /></ProtectedRoute>} />
              
              {/* Customer Routes */}
              <Route path="customer/home" element={<ProtectedRoute><CustomerHome /></ProtectedRoute>} />
              {/* Alias to prevent 404s from old links */}
              <Route path="customer/dashboard" element={<ProtectedRoute><CustomerHome /></ProtectedRoute>} />
              <Route path="customer/products" element={<ProtectedRoute><CustomerProducts /></ProtectedRoute>} />
              <Route path="customer/cart" element={<ProtectedRoute><CustomerCart /></ProtectedRoute>} />
              <Route path="customer/orders" element={<ProtectedRoute><CustomerOrders /></ProtectedRoute>} />
              <Route path="customer/favorites" element={<ProtectedRoute><CustomerFavorites /></ProtectedRoute>} />
              <Route path="customer/profile" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
              <Route path="customer/settings" element={<ProtectedRoute><CustomerSettings /></ProtectedRoute>} />

              {/* Static pages */}
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="help" element={<Help />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          </Router>
        </RealtimeProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;