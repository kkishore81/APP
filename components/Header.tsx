import React from 'react';
// Fix: Corrected import path for useAuth to remove file extension.
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import Avatar from './Avatar';

const SplitEaseLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12 10.5c1.38 0 2.5-1.12 2.5-2.5S13.38 5.5 12 5.5 9.5 6.62 9.5 8s1.12 2.5 2.5 2.5z" />
    <path d="M17 16.5c0-1.67-3.33-2.5-5-2.5s-5 .83-5 2.5V18h10v-1.5z" />
  </svg>
);


const Header: React.FC = () => {
    const { user, signOut } = useAuth();
    
    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <SplitEaseLogo className="h-8 w-8 text-teal-500" />
                        <span className="font-bold text-2xl text-gray-800 tracking-tight">SplitEase</span>
                    </div>
                    {user && (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600 hidden sm:block">Hello, {user.name}</span>
                            <Avatar name={user.name} className="h-9 w-9" />
                            <Button onClick={signOut} variant="secondary" size="sm">
                                Sign Out
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;