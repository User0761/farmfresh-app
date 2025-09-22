import React from 'react';

const About = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">About FarmFresh</h1>
      <p className="text-muted-foreground">We connect farmers, vendors, and customers to make fresh, local produce accessible.</p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-2">For Farmers</h3>
          <p className="text-sm text-muted-foreground">List produce, manage orders, and grow your business.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-2">For Vendors</h3>
          <p className="text-sm text-muted-foreground">Source directly and offer transparency to your customers.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-2">For Customers</h3>
          <p className="text-sm text-muted-foreground">Browse fresh products and choose delivery or pickup.</p>
        </div>
      </div>
    </div>
  );
};

export default About;


