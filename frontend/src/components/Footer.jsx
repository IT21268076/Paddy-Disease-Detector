import React from 'react';
import { Facebook, Instagram, Github, Youtube, Twitter, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <div className=' bg-gray-900'>
    <footer className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Company Description */}
        <div className="md:col-span-1">
        <Leaf className="text-green-600 mb-4" size={24} />
          <p className="text-gray-300 mb-6">
            Making the world a better place through constructing elegant hierarchies.
          </p>
          <div className="flex space-x-4">
            <Facebook className="text-gray-300 hover:text-gray-900 w-6 h-6" />
            <Instagram className="text-gray-300 hover:text-gray-900 w-6 h-6" />
            <Twitter className="text-gray-300 hover:text-gray-900 w-6 h-6" />
            <Github className="text-gray-300 hover:text-gray-900 w-6 h-6" />
            <Youtube className="text-gray-300 hover:text-gray-900 w-6 h-6" />
          </div>
        </div>

        {/* Solutions */}
        <div>
          <h3 className="font-semibold text-gray-100 mb-3">Solutions</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Marketing</a></li>
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Analytics</a></li>
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Automation</a></li>
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Commerce</a></li>
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Insights</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-gray-100 mb-3">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Submit ticket</a></li>
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Documentation</a></li>
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Guides</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-gray-100 mb-3">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-gray-900">About</a></li>
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Blog</a></li>
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Jobs</a></li>
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Press</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-gray-100 mb-3">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Terms of service</a></li>
            <li><a href="#" className="text-gray-300 hover:text-gray-900">Privacy policy</a></li>
            <li><a href="#" className="text-gray-300 hover:text-gray-900">License</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-400">© 2024 Your Company, Inc. All rights reserved.</p>
      </div>
    </footer>
    </div>
  );
};

export default Footer;