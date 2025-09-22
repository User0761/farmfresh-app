import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart2, Box, Home, PackageCheck, Settings, ShoppingBag, Store, Users } from 'lucide-react';

const VendorSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-border h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden md:block">
      <div className="p-4">
        <nav className="space-y-1">
          <NavLink
            to="/vendor/dashboard"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-secondary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/vendor/products"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-secondary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <Box className="mr-3 h-5 w-5" />
            Products
          </NavLink>
          
          <NavLink
            to="/vendor/inventory"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-secondary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <Store className="mr-3 h-5 w-5" />
            Inventory
          </NavLink>
          
          <NavLink
            to="/vendor/orders"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-secondary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <PackageCheck className="mr-3 h-5 w-5" />
            Orders
          </NavLink>
          
          <NavLink
            to="/vendor/purchases"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-secondary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <ShoppingBag className="mr-3 h-5 w-5" />
            Purchases
          </NavLink>
          
          <NavLink
            to="/vendor/customers"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-secondary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <Users className="mr-3 h-5 w-5" />
            Customers
          </NavLink>
          
          <NavLink
            to="/vendor/analytics"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-secondary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <BarChart2 className="mr-3 h-5 w-5" />
            Analytics
          </NavLink>
          
          <NavLink
            to="/vendor/settings"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-secondary text-white'
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

export default VendorSidebar;