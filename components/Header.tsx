import React from 'react';
import { LogoIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-teal-500" />
            <span className="text-2xl font-bold text-gray-800 tracking-tight">SplitEase</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;