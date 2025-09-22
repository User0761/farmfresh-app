export type UserRole = 'farmer' | 'vendor' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  phone?: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string; // kg, bunch, etc.
  quantity: number;
  imageUrl: string;
  category: string;
  harvestDate: string;
  farmerId: string;
  farmerName: string;
  location: string;
  organic: boolean;
  vendorId?: string;
  vendorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'upi' | 'wallet' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  farmerId?: string;
  farmerName?: string;
  vendorId?: string;
  vendorName?: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  pickupLocation?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}