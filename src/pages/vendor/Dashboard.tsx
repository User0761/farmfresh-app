import React from 'react';
import { BarChart, Users, Package, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

const VendorDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vendor Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$28,650</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Products Listed</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">289</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Sales Growth</p>
              <p className="text-2xl font-bold text-gray-900">+18.2%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {[
              { id: '#ORD-001', customer: 'John Doe', amount: '$125.00', status: 'Processing' },
              { id: '#ORD-002', customer: 'Jane Smith', amount: '$89.50', status: 'Delivered' },
              { id: '#ORD-003', customer: 'Mike Johnson', amount: '$245.00', status: 'Pending' },
            ].map((order, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-gray-900 font-medium">{order.id}</p>
                  <p className="text-gray-500 text-sm">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">{order.amount}</p>
                  <p className="text-sm text-green-600">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-4">
            {[
              { name: 'Organic Carrots', sales: '245 units', revenue: '$735.00' },
              { name: 'Fresh Tomatoes', sales: '189 units', revenue: '$567.00' },
              { name: 'Green Apples', sales: '156 units', revenue: '$468.00' },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-gray-900 font-medium">{product.name}</p>
                  <p className="text-gray-500 text-sm">{product.sales}</p>
                </div>
                <span className="text-gray-700">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;