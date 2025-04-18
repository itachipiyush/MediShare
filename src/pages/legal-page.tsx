import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Markdown } from '../components/ui/markdown';
import disclaimerContent from '../content/disclaimer.md?raw';

export const LegalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Disclaimer</h1>
          <p className="text-xl text-gray-600">Important information about using MediShare</p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <Markdown content={disclaimerContent} />
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <Button
            as={Link}
            to="/"
            className="bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            size="lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}; 