import React, { useState } from 'react';

const VendorSettings = () => {
  const [shopName, setShopName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Vendor Settings</h1>
      <div className="card p-6 space-y-4 max-w-xl">
        <input className="input" placeholder="Shop Name" value={shopName} onChange={e => setShopName(e.target.value)} />
        <input className="input" placeholder="Contact Email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
        <button className="btn btn-primary">Save</button>
      </div>
    </div>
  );
};

export default VendorSettings;




