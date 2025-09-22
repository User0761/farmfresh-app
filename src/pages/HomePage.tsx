import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShoppingBasket, Truck, Users } from 'lucide-react';
import { useUser } from '../context/UserContext';
import ProductCard from '../components/common/ProductCard';
import { mockProducts } from '../data/mockData';

const HomePage = () => {
  const { user } = useUser();
  const featuredProducts = mockProducts.slice(0, 4);
  const categories = Array.from(new Set(mockProducts.map(p => p.category)));
  
  return (
    <div className="space-y-16 animate-fade-in container mx-auto px-4 py-6">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-dark via-primary to-primary-light py-20 rounded-lg overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg" 
            alt="Farm background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative px-6 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-white space-y-6">
            <h1 className="text-5xl font-bold leading-tight">From Farm to Table, Fresh and Direct</h1>
            <p className="text-xl opacity-90">Connect with local farmers, vendors, and customers in a seamless marketplace for the freshest produce.</p>
            <div className="flex flex-wrap gap-4 pt-4">
              {!user && (
                <>
                  <Link to="/register" className="btn btn-lg bg-white text-primary hover:bg-opacity-90">
                    Join FarmFresh
                  </Link>
                  <Link to="/login" className="btn btn-lg border-2 border-white text-white hover:bg-white hover:bg-opacity-10">
                    Log In
                  </Link>
                </>
              )}
              {user && (
                <Link 
                  to={`/${user.role === 'farmer' ? 'farmer' : user.role === 'vendor' ? 'vendor' : 'customer'}/dashboard`} 
                  className="btn btn-lg bg-white text-primary hover:bg-opacity-90"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <img 
              src="https://images.pexels.com/photos/8092945/pexels-photo-8092945.jpeg" 
              alt="Fresh produce" 
              className="rounded-lg shadow-2xl transform -rotate-2 animate-slide-up"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">How FarmFresh Works</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Our platform connects farmers, vendors, and customers in a seamless ecosystem of fresh produce.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-6 hover:shadow-md transition-shadow animate-slide-up" style={{animationDelay: '100ms'}}>
            <div className="p-3 bg-primary-light bg-opacity-10 rounded-full w-fit mb-4">
              <Leaf className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Farmers</h3>
            <p className="text-muted-foreground mb-4">List your crops with details, set prices, and sell directly to vendors or customers.</p>
            <Link to="/register" className="text-primary flex items-center hover:underline">
              Start selling <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="card p-6 hover:shadow-md transition-shadow animate-slide-up" style={{animationDelay: '200ms'}}>
            <div className="p-3 bg-secondary-light bg-opacity-10 rounded-full w-fit mb-4">
              <ShoppingBasket className="text-secondary" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Vendors</h3>
            <p className="text-muted-foreground mb-4">Source fresh produce from farmers and sell to your customers with complete transparency.</p>
            <Link to="/register" className="text-secondary flex items-center hover:underline">
              Become a vendor <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="card p-6 hover:shadow-md transition-shadow animate-slide-up" style={{animationDelay: '300ms'}}>
            <div className="p-3 bg-accent bg-opacity-10 rounded-full w-fit mb-4">
              <Users className="text-accent" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Customers</h3>
            <p className="text-muted-foreground mb-4">Browse local produce, see freshness details, and choose delivery or pickup options.</p>
            <Link to="/register" className="text-accent flex items-center hover:underline">
              Shop now <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-foreground">Shop by Category</h2>
          <Link to="/customer/products" className="btn btn-outline">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat} to={`/customer/products?category=${encodeURIComponent(cat)}`} className="card p-5 hover:shadow-md text-center">
              <span className="font-semibold">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
          <Link to="/customer/products" className="btn btn-primary">Browse All</Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              className="animate-slide-up" 
              style={{animationDelay: `${index * 100}ms`}} 
            />
          ))}
        </div>
      </section>
      
      {/* Testimonials/Stats */}
      <section className="bg-muted py-16 rounded-lg">
        <div className="px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Why Choose FarmFresh?</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in" style={{animationDelay: '100ms'}}>
              <p className="text-4xl font-bold text-primary">100+</p>
              <p className="text-muted-foreground">Local Farmers</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '200ms'}}>
              <p className="text-4xl font-bold text-secondary">50+</p>
              <p className="text-muted-foreground">Trusted Vendors</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '300ms'}}>
              <p className="text-4xl font-bold text-accent">1000+</p>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '400ms'}}>
              <p className="text-4xl font-bold text-success">95%</p>
              <p className="text-muted-foreground">Delivery Success</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16">
        <div className="bg-gradient-to-r from-secondary-dark to-secondary rounded-lg overflow-hidden shadow-xl">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 px-8 py-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Experience Fresh?</h2>
              <p className="text-white text-opacity-90 mb-6">Join thousands of users connecting directly with local farmers for the freshest produce available.</p>
              <Link to="/register" className="btn bg-white text-secondary hover:bg-opacity-90">
                Get Started Today
              </Link>
            </div>
            <div className="lg:w-1/2 h-64 lg:h-auto">
              <img 
                src="https://images.pexels.com/photos/8092542/pexels-photo-8092542.jpeg" 
                alt="Farm fresh vegetables" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;