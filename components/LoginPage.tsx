import React from 'react';
// Fix: Corrected import path for useAuth to remove file extension.
import { useAuth } from '../hooks/useAuth';
import Button from './Button';

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


const LoginPage: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg text-center">
        <SplitEaseLogo className="h-16 w-16 mx-auto text-teal-500" />
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          Welcome to SplitEase
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          The easiest way to split bills with friends and family.
        </p>
        <div className="mt-8">
          <Button
            onClick={signInWithGoogle}
            isLoading={loading}
            size="lg"
            className="w-full"
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;