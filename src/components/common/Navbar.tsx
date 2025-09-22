import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useUser();
  const { cart } = useCart();
  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">FarmFresh</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const params = new URLSearchParams({ search: query });
                window.location.href = `/customer/products?${params.toString()}`;
              }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input pl-9 w-64"
                placeholder="Search products..."
              />
            </form>
            
            {user?.role === 'customer' && (
              <>
                <Link to="/customer/products" className="text-foreground hover:text-primary transition-colors">
                  Browse Products
                </Link>
                <Link to="/customer/orders" className="text-foreground hover:text-primary transition-colors">
                  My Orders
                </Link>
              </>
            )}
            
            {user?.role === 'farmer' && (
              <>
                <Link to="/farmer/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/farmer/products" className="text-foreground hover:text-primary transition-colors">
                  My Products
                </Link>
                <Link to="/farmer/orders" className="text-foreground hover:text-primary transition-colors">
                  Orders
                </Link>
              </>
            )}
            
            {user?.role === 'vendor' && (
              <>
                <Link to="/vendor/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/vendor/products" className="text-foreground hover:text-primary transition-colors">
                  Products
                </Link>
                <Link to="/vendor/orders" className="text-foreground hover:text-primary transition-colors">
                  Orders
                </Link>
              </>
            )}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user?.role === 'customer' && (
              <Link to="/customer/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cart.items.length > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </Link>
            )}
            
            {user ? (
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-1.5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="hidden md:inline-block">{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link 
                      to={`/${user.role}/dashboard`} 
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => { setUserMenuOpen(false); logout(); }} 
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Join Now
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md text-foreground hover:text-primary"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white fixed inset-0 z-50">
          <div className="flex justify-between items-center p-4 border-b">
            <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <Leaf className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">FarmFresh</span>
            </Link>
            <button 
              className="p-2 rounded-md text-foreground hover:text-primary"
              onClick={toggleMobileMenu}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="p-4 space-y-4">
            <Link 
              to="/" 
              className="block py-2 text-lg text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {user?.role === 'customer' && (
              <>
                <Link 
                  to="/customer/products" 
                  className="block py-2 text-lg text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Products
                </Link>
                <Link 
                  to="/customer/orders" 
                  className="block py-2 text-lg text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link 
                  to="/customer/cart" 
                  className="block py-2 text-lg text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart ({cart.items.length})
                </Link>
              </>
            )}
            
            {user?.role === 'farmer' && (
              <>
                <Link 
                  to="/farmer/dashboard" 
                  className="block py-2 text-lg text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/farmer/products" 
                  className="block py-2 text-lg text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Products
                </Link>
                <Link 
                  to="/farmer/orders" 
                  className="block py-2 text-lg text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
              </>
            )}
            
            {user?.role === 'vendor' && (
              <>
                <Link 
                  to="/vendor/dashboard" 
                  className="block py-2 text-lg text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/vendor/products" 
                  className="block py-2 text-lg text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link 
                  to="/vendor/orders" 
                  className="block py-2 text-lg text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
              </>
            )}
            
            {user ? (
              <button 
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }} 
                className="block w-full text-left py-2 text-lg text-foreground hover:text-primary"
              >
                Sign Out
              </button>
            ) : (
              <div className="space-y-4 pt-4 border-t">
                <Link 
                  to="/login" 
                  className="block py-2 text-lg text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Now
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;