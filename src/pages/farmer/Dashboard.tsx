import React from 'react';
import { BarChart, Users, Package, DollarSign } from 'lucide-react';

const FarmerDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Farmer Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">$12,450</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Monthly Growth</p>
              <p className="text-2xl font-bold text-gray-900">+12.5%</p>
            </div>
            <BarChart className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: "New order received", time: "2 minutes ago", amount: "$125.00" },
            { action: "Product stock updated", time: "1 hour ago", amount: "15 units" },
            { action: "Customer review", time: "3 hours ago", amount: "⭐⭐⭐⭐⭐" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-gray-900 font-medium">{activity.action}</p>
                <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
              <span className="text-gray-700">{activity.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;