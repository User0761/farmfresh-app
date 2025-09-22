import { Product, Order } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Carrots',
    description: 'Freshly harvested organic carrots, perfect for salads, juicing, or cooking.',
    price: 2.99,
    unit: 'bunch',
    quantity: 50,
    imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
    category: 'Vegetables',
    harvestDate: '2025-02-15T00:00:00Z',
    farmerId: 'f1',
    farmerName: 'Green Valley Farm',
    location: 'Sonoma, CA',
    organic: true,
    createdAt: '2025-02-16T00:00:00Z',
    updatedAt: '2025-02-16T00:00:00Z'
  },
  {
    id: '2',
    name: 'Fresh Strawberries',
    description: 'Sweet and juicy strawberries, perfect for desserts or enjoying fresh.',
    price: 4.99,
    unit: 'lb',
    quantity: 30,
    imageUrl: 'https://images.pexels.com/photos/59945/strawberry-fruit-delicious-red-59945.jpeg',
    category: 'Fruits',
    harvestDate: '2025-02-16T00:00:00Z',
    farmerId: 'f1',
    farmerName: 'Green Valley Farm',
    location: 'Sonoma, CA',
    organic: true,
    createdAt: '2025-02-17T00:00:00Z',
    updatedAt: '2025-02-17T00:00:00Z'
  },
  {
    id: '3',
    name: 'Farm Fresh Eggs',
    description: 'Free-range eggs from happy chickens. Rich in flavor and nutrients.',
    price: 5.99,
    unit: 'dozen',
    quantity: 40,
    imageUrl: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg',
    category: 'Dairy & Eggs',
    harvestDate: '2025-02-17T00:00:00Z',
    farmerId: 'f2',
    farmerName: 'Sunny Side Farm',
    location: 'Napa, CA',
    organic: true,
    createdAt: '2025-02-17T00:00:00Z',
    updatedAt: '2025-02-17T00:00:00Z'
  },
  {
    id: '4',
    name: 'Organic Kale',
    description: 'Nutrient-dense kale, perfect for salads, smoothies, or cooking.',
    price: 3.49,
    unit: 'bunch',
    quantity: 35,
    imageUrl: 'https://images.pexels.com/photos/51372/kale-vegetables-brassica-oleracea-var-sabellica-51372.jpeg',
    category: 'Vegetables',
    harvestDate: '2025-02-16T00:00:00Z',
    farmerId: 'f2',
    farmerName: 'Sunny Side Farm',
    location: 'Napa, CA',
    organic: true,
    createdAt: '2025-02-17T00:00:00Z',
    updatedAt: '2025-02-17T00:00:00Z'
  },
  {
    id: '5',
    name: 'Heirloom Tomatoes',
    description: 'Colorful and flavorful heirloom tomatoes, perfect for salads or cooking.',
    price: 4.79,
    unit: 'lb',
    quantity: 25,
    imageUrl: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
    category: 'Vegetables',
    harvestDate: '2025-02-15T00:00:00Z',
    farmerId: 'f3',
    farmerName: 'Heritage Farms',
    location: 'Petaluma, CA',
    organic: false,
    createdAt: '2025-02-16T00:00:00Z',
    updatedAt: '2025-02-16T00:00:00Z'
  },
  {
    id: '6',
    name: 'Fresh Honey',
    description: 'Raw, unfiltered honey produced locally by happy bees.',
    price: 8.99,
    unit: 'jar',
    quantity: 20,
    imageUrl: 'https://images.pexels.com/photos/14869996/pexels-photo-14869996.jpeg',
    category: 'Other',
    harvestDate: '2025-02-10T00:00:00Z',
    farmerId: 'f3',
    farmerName: 'Heritage Farms',
    location: 'Petaluma, CA',
    organic: true,
    createdAt: '2025-02-12T00:00:00Z',
    updatedAt: '2025-02-12T00:00:00Z'
  },
  {
    id: '7',
    name: 'Organic Apples',
    description: 'Crisp and sweet organic apples, perfect for snacking or baking.',
    price: 3.99,
    unit: 'lb',
    quantity: 45,
    imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
    category: 'Fruits',
    harvestDate: '2025-02-14T00:00:00Z',
    farmerId: 'f4',
    farmerName: 'Apple Grove Orchard',
    location: 'Sebastopol, CA',
    organic: true,
    createdAt: '2025-02-15T00:00:00Z',
    updatedAt: '2025-02-15T00:00:00Z'
  },
  {
    id: '8',
    name: 'Fresh Basil',
    description: 'Aromatic fresh basil, perfect for Italian dishes, pesto, or garnish.',
    price: 2.49,
    unit: 'bunch',
    quantity: 30,
    imageUrl: 'https://images.pexels.com/photos/5699734/pexels-photo-5699734.jpeg',
    category: 'Herbs',
    harvestDate: '2025-02-17T00:00:00Z',
    farmerId: 'f4',
    farmerName: 'Apple Grove Orchard',
    location: 'Sebastopol, CA',
    organic: true,
    createdAt: '2025-02-17T00:00:00Z',
    updatedAt: '2025-02-17T00:00:00Z'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    customerId: 'c1',
    customerName: 'John Doe',
    farmerId: 'f1',
    farmerName: 'Green Valley Farm',
    items: [
      {
        productId: '1',
        product: mockProducts[0],
        quantity: 2
      },
      {
        productId: '2',
        product: mockProducts[1],
        quantity: 1
      }
    ],
    totalPrice: 10.97,
    status: 'delivered',
    deliveryMethod: 'delivery',
    deliveryAddress: '123 Main St, San Francisco, CA',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2025-02-18T10:30:00Z',
    updatedAt: '2025-02-20T14:15:00Z'
  },
  {
    id: '2',
    customerId: 'c1',
    customerName: 'John Doe',
    vendorId: 'v1',
    vendorName: 'Fresh Marketplace',
    items: [
      {
        productId: '3',
        product: mockProducts[2],
        quantity: 1
      },
      {
        productId: '5',
        product: mockProducts[4],
        quantity: 2
      }
    ],
    totalPrice: 15.57,
    status: 'processing',
    deliveryMethod: 'pickup',
    pickupLocation: 'Fresh Marketplace, 456 Market St, San Francisco, CA',
    paymentMethod: 'wallet',
    paymentStatus: 'paid',
    createdAt: '2025-02-19T09:45:00Z',
    updatedAt: '2025-02-19T11:20:00Z'
  },
  {
    id: '3',
    customerId: 'c2',
    customerName: 'Jane Smith',
    farmerId: 'f2',
    farmerName: 'Sunny Side Farm',
    items: [
      {
        productId: '4',
        product: mockProducts[3],
        quantity: 3
      }
    ],
    totalPrice: 10.47,
    status: 'shipped',
    deliveryMethod: 'delivery',
    deliveryAddress: '789 Oak St, San Francisco, CA',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    createdAt: '2025-02-19T15:20:00Z',
    updatedAt: '2025-02-20T09:10:00Z'
  }
];