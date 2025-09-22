import React from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Help Center</h1>
      <p className="text-muted-foreground">Find answers to common questions below.</p>
      <div className="card p-6 space-y-4">
        <details>
          <summary className="font-medium cursor-pointer">How do I register as a farmer?</summary>
          <p className="text-sm text-muted-foreground mt-2">Go to <Link to="/register?role=farmer" className="text-primary underline">Register</Link> and choose Farmer.</p>
        </details>
        <details>
          <summary className="font-medium cursor-pointer">How do I place an order?</summary>
          <p className="text-sm text-muted-foreground mt-2">Browse <Link to="/customer/products" className="text-primary underline">Products</Link>, add to cart, and checkout.</p>
        </details>
        <details>
          <summary className="font-medium cursor-pointer">How do I contact support?</summary>
          <p className="text-sm text-muted-foreground mt-2">Use the form on our <Link to="/contact" className="text-primary underline">Contact</Link> page.</p>
        </details>
      </div>
    </div>
  );
};

export default Help;




