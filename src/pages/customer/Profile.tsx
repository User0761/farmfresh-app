import React from 'react';
import { useUser } from '../../context/UserContext';

const Profile = () => {
  const { user } = useUser();
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="card p-6 space-y-3">
        <div><span className="font-medium">Name:</span> {user?.name}</div>
        <div><span className="font-medium">Email:</span> {user?.email}</div>
        <div><span className="font-medium">Role:</span> {user?.role}</div>
      </div>
    </div>
  );
};

export default Profile;




