import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FarmerSidebar from '../components/farmer/Sidebar';
import VendorSidebar from '../components/vendor/Sidebar';
import CustomerSidebar from '../components/customer/Sidebar';

const Layout = () => {
  const { user } = useUser();

  const renderSidebar = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'farmer':
        return <FarmerSidebar />;
      case 'vendor':
        return <VendorSidebar />;
      case 'customer':
        return <CustomerSidebar />;
      default:
        return null;
    }
  };

  const isAuthPage = window.location.pathname.includes('/login') || 
                     window.location.pathname.includes('/register');
  
  const isDashboardPage = user && (
    window.location.pathname.includes('/farmer') ||
    window.location.pathname.includes('/vendor') ||
    window.location.pathname.includes('/customer')
  );
  
  const isHomePage = window.location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        {isDashboardPage && renderSidebar()}
        
        <main className={`flex-1 ${isAuthPage ? 'bg-muted' : ''} ${isHomePage ? 'p-0' : ''}`}>
          <div className={`${isHomePage ? '' : 'container mx-auto px-4 py-6'}`}>
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;