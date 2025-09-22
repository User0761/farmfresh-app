import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { apiService } from '../../services/api';
import { formatCurrency } from '../../utils/format';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'wallet' | 'cash'>('upi');
  
  const deliveryFee = deliveryMethod === 'delivery' ? 4.99 : 0;
  const tax = cart.totalPrice * 0.05;
  const totalAmount = cart.totalPrice + deliveryFee + tax;
  
  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
        pickupLocation: deliveryMethod === 'pickup' ? 'Vendor Location' : undefined,
        paymentMethod
      };
      
      await apiService.createOrder(orderData);
      alert('Order placed successfully!');
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };
  
  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center p-6 bg-muted rounded-full mb-4">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Link to="/customer/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Shopping Cart</h1>
        <button 
          onClick={() => clearCart()}
          className="text-muted-foreground hover:text-error text-sm flex items-center"
        >
          <Trash2 size={16} className="mr-1" />
          Clear Cart
        </button>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="divide-y">
              {cart.items.map((item) => (
                <div key={item.productId} className="p-4 flex">
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.product.farmerName} • {item.product.organic ? 'Organic' : 'Non-organic'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)}/{item.product.unit}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="btn btn-sm btn-outline p-1 h-8 w-8"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="mx-3 min-w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="btn btn-sm btn-outline p-1 h-8 w-8"
                          disabled={item.quantity >= item.product.quantity}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-muted-foreground hover:text-error"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-muted">
              <Link to="/customer/products" className="inline-flex items-center text-primary hover:text-primary-dark">
                <ArrowLeft size={16} className="mr-1" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(cart.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{deliveryMethod === 'delivery' ? formatCurrency(deliveryFee) : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Delivery Method</h3>
                <div className="flex gap-3">
                  <label className="flex-1">
                    <input 
                      type="radio"
                      name="deliveryMethod"
                      value="delivery"
                      checked={deliveryMethod === 'delivery'}
                      onChange={() => setDeliveryMethod('delivery')}
                      className="sr-only"
                    />
                    <div className={`border rounded-md p-3 cursor-pointer ${deliveryMethod === 'delivery' ? 'border-primary bg-primary bg-opacity-5' : 'border-border'}`}>
                      <div className="font-medium">Delivery</div>
                      <div className="text-sm text-muted-foreground">2-3 business days</div>
                    </div>
                  </label>
                  
                  <label className="flex-1">
                    <input 
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={deliveryMethod === 'pickup'}
                      onChange={() => setDeliveryMethod('pickup')}
                      className="sr-only"
                    />
                    <div className={`border rounded-md p-3 cursor-pointer ${deliveryMethod === 'pickup' ? 'border-primary bg-primary bg-opacity-5' : 'border-border'}`}>
                      <div className="font-medium">Pickup</div>
                      <div className="text-sm text-muted-foreground">From vendor location</div>
                    </div>
                  </label>
                </div>
              </div>
              
              {deliveryMethod === 'delivery' && (
                <div>
                  <label htmlFor="deliveryAddress" className="block text-sm font-medium text-foreground mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    id="deliveryAddress"
                    className="input min-h-20"
                    placeholder="Enter your full address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-2">UPI Payment</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={() => setPaymentMethod('wallet')}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-2">Wallet</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-2">Cash on Delivery</span>
                  </label>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="btn btn-primary w-full"
                disabled={deliveryMethod === 'delivery' && !deliveryAddress}
              >
                <span>Place Order</span>
                <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;