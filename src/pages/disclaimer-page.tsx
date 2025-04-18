import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Disclaimer</h1>
          <p className="text-xl text-gray-600">Important information about using MediShare</p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Medical Disclaimer</h1>
              
              <p className="text-gray-700 mb-6">
                The information provided on MediShare is for general informational purposes only and is not intended as medical advice. Always consult with a qualified healthcare professional before making any decisions regarding your health or medication.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Important Points to Consider</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li className="mb-2">MediShare is a platform for sharing unused medications and does not provide medical advice</li>
                <li className="mb-2">All medications shared through our platform should be verified by a healthcare professional</li>
                <li className="mb-2">Users are responsible for ensuring the safety and suitability of any medication they receive</li>
                <li className="mb-2">We do not guarantee the accuracy or completeness of information provided by users</li>
                <li className="mb-2">Always check medication expiration dates and storage conditions</li>
                <li className="mb-2">Report any adverse effects or concerns to your healthcare provider immediately</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                MediShare and its operators are not responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li className="mb-2">Any adverse effects or complications resulting from medication use</li>
                <li className="mb-2">Inaccuracies in medication information provided by users</li>
                <li className="mb-2">Improper storage or handling of medications</li>
                <li className="mb-2">Any decisions made based on information found on our platform</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">User Responsibility</h2>
              <p className="text-gray-700 mb-4">
                By using MediShare, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li className="mb-2">You will consult with healthcare professionals before using any medication</li>
                <li className="mb-2">You will verify all medication information independently</li>
                <li className="mb-2">You understand the risks associated with medication sharing</li>
                <li className="mb-2">You will report any safety concerns immediately</li>
              </ul>

              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  This disclaimer is not a substitute for professional medical advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or medication.
                </p>
              </div>
            </div>
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