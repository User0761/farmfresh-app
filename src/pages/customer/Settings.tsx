import React, { useState } from 'react';

const Settings = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="card p-6 space-y-4 max-w-xl">
        <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="input" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <input className="input" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <button className="btn btn-primary">Save</button>
      </div>
    </div>
  );
};

export default Settings;




