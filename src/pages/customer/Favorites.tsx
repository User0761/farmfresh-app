import React from 'react';

const Favorites = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Favorites</h1>
      <p className="text-muted-foreground">Your saved products will appear here.</p>
      <div className="card p-6">
        <p className="text-sm text-muted-foreground">No favorites yet.</p>
      </div>
    </div>
  );
};

export default Favorites;




