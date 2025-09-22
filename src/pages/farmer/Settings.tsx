import React, { useState } from 'react';

const FarmerSettings = () => {
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Farmer Settings</h1>
      <div className="card p-6 space-y-4 max-w-xl">
        <input className="input" placeholder="Farm Name" value={farmName} onChange={e => setFarmName(e.target.value)} />
        <input className="input" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <button className="btn btn-primary">Save</button>
      </div>
    </div>
  );
};

export default FarmerSettings;




