import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <Leaf className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground text-lg mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <div className="space-x-4">
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
        <Link to="/customer/products" className="btn btn-outline">
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default NotFound;