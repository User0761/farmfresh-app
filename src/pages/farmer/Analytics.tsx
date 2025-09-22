import React from 'react';

const FarmerAnalytics = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-6"><p>Total Sales</p><h2 className="text-2xl font-bold">$0.00</h2></div>
        <div className="card p-6"><p>Active Products</p><h2 className="text-2xl font-bold">0</h2></div>
        <div className="card p-6"><p>Total Customers</p><h2 className="text-2xl font-bold">0</h2></div>
      </div>
    </div>
  );
};

export default FarmerAnalytics;




