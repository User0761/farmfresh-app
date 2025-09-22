import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import { mockProducts } from '../../data/mockData';

const CustomerHome = () => {
  const featuredProducts = mockProducts.slice(0, 4);
  const categories = [...new Set(mockProducts.map(p => p.category))];
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-white text-opacity-90">Discover fresh, local produce from farmers near you.</p>
      </div>
      
      {/* Featured Products */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured Products</h2>
          <Link to="/customer/products" className="text-primary hover:text-primary-dark flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {/* Categories */}
      <div>
        <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/customer/products?category=${category}`}
              className="card p-4 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium">{category}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {mockProducts.filter(p => p.category === category).length} products
              </p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent Orders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link to="/customer/orders" className="text-primary hover:text-primary-dark flex items-center">
            View All Orders <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="card divide-y">
          {mockProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="p-4 flex items-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">Ordered from {product.farmerName}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${product.price.toFixed(2)}</p>
                <span className="text-sm text-green-600">Delivered</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;