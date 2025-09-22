import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Leaf, Mail, MapPin, Phone, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-primary-light" />
              <span className="ml-2 text-xl font-bold text-white">FarmFresh</span>
            </Link>
            <p className="mt-4 text-gray-300">
              Connecting farmers, vendors, and customers for fresher produce and a healthier community.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/customer/products" className="text-gray-300 hover:text-white">Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">For Users</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register?role=farmer" className="text-gray-300 hover:text-white">Become a Farmer</Link>
              </li>
              <li>
                <Link to="/register?role=vendor" className="text-gray-300 hover:text-white">Become a Vendor</Link>
              </li>
              <li>
                <Link to="/register?role=customer" className="text-gray-300 hover:text-white">Customer Sign Up</Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white">Help Center</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-light mr-2 mt-0.5" />
                <span className="text-gray-300">
                  123 Farm Street, Freshville, CA 90210
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary-light mr-2" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary-light mr-2" />
                <span className="text-gray-300">hello@farmfresh.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} FarmFresh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;