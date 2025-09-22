import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatDate } from '../../utils/format';

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

const ProductCard = ({ product, className = '', style }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  return (
    <Link 
      to={`/product/${product.id}`} 
      className={`card group overflow-hidden hover:shadow-md transition-shadow ${className}`}
      style={style}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.organic && (
          <span className="absolute top-2 left-2 bg-success px-2 py-1 rounded-full text-xs text-white font-medium">
            Organic
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-foreground">{product.name}</h3>
          <span className="text-primary font-semibold">${product.price.toFixed(2)}/{product.unit}</span>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mb-1">
          <MapPin size={12} className="mr-1" />
          <span>{product.location}</span>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <Calendar size={12} className="mr-1" />
          <span>Harvested: {formatDate(product.harvestDate)}</span>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">By {product.farmerName}</span>
          <button 
            onClick={handleAddToCart}
            className="btn btn-sm btn-primary"
          >
            <ShoppingCart size={16} className="mr-1" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;