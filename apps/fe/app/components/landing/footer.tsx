'use client';

import { PenTool, Twitter, Github } from 'lucide-react';

export const Footer = () => (
  <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
            <PenTool className="w-3 h-3 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Collab-draw</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-500 text-sm">
          © 2025 Collab-draw. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;