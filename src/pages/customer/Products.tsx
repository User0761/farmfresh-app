import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import { mockProducts } from '../../data/mockData';

const CustomerProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [searchTerm, setSearchTerm] = useState(params.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(params.get('category') || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [showOrganic, setShowOrganic] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = ['all', ...new Set(mockProducts.map(p => p.category))];

  useEffect(() => {
    const next = new URLSearchParams();
    if (searchTerm) next.set('search', searchTerm);
    if (selectedCategory && selectedCategory !== 'all') next.set('category', selectedCategory);
    navigate({ pathname: '/customer/products', search: next.toString() }, { replace: true });
  }, [searchTerm, selectedCategory]);
  
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesOrganic = !showOrganic || product.organic;
    return matchesSearch && matchesCategory && matchesPrice && matchesOrganic;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Filters Sidebar */}
      <div className={`lg:w-64 bg-white p-6 rounded-lg shadow-sm ${showFilters ? 'fixed inset-0 z-50 lg:relative' : 'hidden lg:block'}`}>
        <div className="flex justify-between items-center lg:hidden mb-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <button onClick={() => setShowFilters(false)} className="text-gray-500">
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="ml-2 text-sm">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Price Range</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showOrganic}
                onChange={(e) => setShowOrganic(e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="ml-2 text-sm">Organic Only</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <select
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
            
            <button
              onClick={() => setShowFilters(true)}
              className="btn btn-outline lg:hidden"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerProducts;