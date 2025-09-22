import React from 'react';

const Contact = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="text-muted-foreground">We'd love to hear from you. Send us a message.</p>
      <form className="grid md:grid-cols-2 gap-4 card p-6">
        <input className="input" placeholder="Your Name" />
        <input className="input" placeholder="Email" type="email" />
        <input className="input md:col-span-2" placeholder="Subject" />
        <textarea className="textarea md:col-span-2" placeholder="Message" rows={6} />
        <div className="md:col-span-2">
          <button className="btn btn-primary">Send</button>
        </div>
      </form>
    </div>
  );
};

export default Contact;


