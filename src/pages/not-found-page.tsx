import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-slate-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Button as={Link} to="/">
            Go to Home
          </Button>
          <Button as={Link} to="/medicines" variant="outline">
            Browse Medications
          </Button>
        </div>
      </div>
    </div>
  );
};