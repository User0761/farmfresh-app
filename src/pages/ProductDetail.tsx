import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Leaf, MapPin, Minus, Plus, ShoppingCart, Truck, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { mockProducts } from '../data/mockData';
import { formatDate } from '../utils/format';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = mockProducts.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/customer/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }
  
  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  return (
    <div className="animate-fade-in">
      <Link to="/customer/products" className="inline-flex items-center text-primary hover:text-primary-dark mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to Products
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden shadow-md">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="space-y-6">
          <div>
            {product.organic && (
              <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-medium inline-block mb-2">
                Organic
              </span>
            )}
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
              <span className="text-muted-foreground ml-1">per {product.unit}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <User size={16} className="mr-2" />
              <span>Sold by: {product.farmerName}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin size={16} className="mr-2" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar size={16} className="mr-2" />
              <span>Harvested: {formatDate(product.harvestDate)}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Leaf size={16} className="mr-2" />
              <span>Category: {product.category}</span>
            </div>
          </div>
          
          <div className="border-t border-b py-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <button 
                onClick={decreaseQuantity}
                className="btn btn-outline p-1 h-10 w-10"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="mx-4 min-w-10 text-center font-medium">{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className="btn btn-outline p-1 h-10 w-10"
                disabled={quantity >= product.quantity}
              >
                <Plus size={16} />
              </button>
              <span className="ml-4 text-sm text-muted-foreground">
                {product.quantity} {product.unit}s available
              </span>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary w-full"
            >
              <ShoppingCart size={18} className="mr-2" />
              Add to Cart
            </button>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-start">
                <Truck className="text-primary mt-1 mr-3 flex-shrink-0" size={18} />
                <div>
                  <h4 className="font-medium">Delivery Information</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Available for delivery or pickup. Delivery fees apply based on location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {mockProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4).map((relatedProduct) => (
            <Link 
              key={relatedProduct.id} 
              to={`/product/${relatedProduct.id}`}
              className="card overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="h-40 overflow-hidden">
                <img 
                  src={relatedProduct.imageUrl} 
                  alt={relatedProduct.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-foreground line-clamp-1">{relatedProduct.name}</h3>
                <p className="text-primary font-semibold mt-1">${relatedProduct.price.toFixed(2)}/{relatedProduct.unit}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;