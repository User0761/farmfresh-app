import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart2, Box, Home, PackageCheck, Settings, Users } from 'lucide-react';

const FarmerSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-border h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto hidden md:block">
      <div className="p-4">
        <nav className="space-y-1">
          <NavLink
            to="/farmer/dashboard"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/farmer/products"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <Box className="mr-3 h-5 w-5" />
            My Products
          </NavLink>
          
          <NavLink
            to="/farmer/orders"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <PackageCheck className="mr-3 h-5 w-5" />
            Orders
          </NavLink>
          
          <NavLink
            to="/farmer/customers"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <Users className="mr-3 h-5 w-5" />
            Customers
          </NavLink>
          
          <NavLink
            to="/farmer/analytics"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-muted'
              }`
            }
          >
            <BarChart2 className="mr-3 h-5 w-5" />
            Analytics
          </NavLink>
          
          <NavLink
            to="/farmer/settings"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary text-white'
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

export default FarmerSidebar;