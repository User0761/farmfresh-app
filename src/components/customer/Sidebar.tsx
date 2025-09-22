import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Home, PackageCheck, Settings, ShoppingBasket, ShoppingCart, User } from 'lucide-react';

const CustomerSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-border h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden md:block">
      <div className="p-4">
        <nav className="space-y-1">
          <NavLink
            to="/customer/home"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <Home className="mr-3 h-5 w-5" />
            Home
          </NavLink>
          
          <NavLink
            to="/customer/products"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <ShoppingBasket className="mr-3 h-5 w-5" />
            Browse Products
          </NavLink>
          
          <NavLink
            to="/customer/cart"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <ShoppingCart className="mr-3 h-5 w-5" />
            Cart
          </NavLink>
          
          <NavLink
            to="/customer/orders"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <PackageCheck className="mr-3 h-5 w-5" />
            My Orders
          </NavLink>
          
          <NavLink
            to="/customer/favorites"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <Heart className="mr-3 h-5 w-5" />
            Favorites
          </NavLink>
          
          <NavLink
            to="/customer/profile"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <User className="mr-3 h-5 w-5" />
            Profile
          </NavLink>
          
          <NavLink
            to="/customer/settings"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default CustomerSidebar;