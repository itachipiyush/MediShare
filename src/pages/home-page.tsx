import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, CheckCircle, Users, Package, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { MedicinesGrid } from '../components/medicines/medicines-grid';
import { useMedicinesStore } from '../store/medicines-store';
import { useAuthStore } from '../store/auth-store';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { medicines, fetchMedicines } = useMedicinesStore();
  const [featuredMedicines, setFeaturedMedicines] = useState<
    {
      id: string;
      name: string;
      description: string;
      quantity: number;
      expiry_date: string;
      image_url?: string;
      location: string;
      posted_by: string;
      status: 'available' | 'claimed' | 'expired';
      created_at: string;
    }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadFeaturedMedicines = async () => {
      await fetchMedicines();
      setFeaturedMedicines(medicines.slice(0, 3));
    };

    loadFeaturedMedicines();
  }, [fetchMedicines, medicines]);

  const handleDonateClick = () => {
    if (!user) {
      navigate('/signup', { state: { role: 'donor' } });
    } else if (user.role === 'donor') {
      navigate('/medicines/new');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/medicines?search=${searchQuery}`);
  };

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-primary-700 to-primary-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-10"
            src="https://images.unsplash.com/photo-1579684385127-1ef6d44d2e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Healthcare professionals working together"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-700/90 to-primary-900/90" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Share Unused Medications, Save Lives
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-3xl">
              Connect with those in need by donating your unused, sealed medications. Together, we
              can reduce medical waste and improve access to healthcare.
            </p>
            <div className="mt-10 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
              <Button
                as={Link}
                to="/medicines"
                className="w-full sm:w-auto bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm sm:text-base lg:text-lg py-2 sm:py-3 px-4 sm:px-6"
              >
                Browse Medicines
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white/10 text-white border-white hover:bg-white/30 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm sm:text-base lg:text-lg py-2 sm:py-3 px-4 sm:px-6"
                onClick={handleDonateClick}
              >
                Donate Medicines
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for medicines..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <Button type="submit" className="bg-primary-600 text-white hover:bg-primary-700">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              How It Works
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A Better Way to Share Medications
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform makes it easy to donate and claim unused medications while ensuring
              safety and compliance.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <Card className="relative p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Package className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    List Your Medications
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Easily list your unused, sealed medications with details like expiry date,
                    quantity, and condition.
                  </p>
                </div>
              </Card>

              <Card className="relative p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Connect with Those in Need
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Verified users and NGOs can browse and claim medications they need.
                  </p>
                </div>
              </Card>

              <Card className="relative p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Prevent Waste</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Help reduce medical waste by ensuring unused medications reach those who need
                    them.
                  </p>
                </div>
              </Card>

              <Card className="relative p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Make a Difference</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Contribute to better healthcare access and make a positive impact in your
                    community.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <CheckCircle className="h-12 w-12 text-primary-600 mx-auto" />
              <h3 className="mt-4 text-2xl font-bold text-gray-900">10,000+</h3>
              <p className="mt-2 text-lg text-gray-500">Medications Donated</p>
            </div>
            <div>
              <Users className="h-12 w-12 text-primary-600 mx-auto" />
              <h3 className="mt-4 text-2xl font-bold text-gray-900">5,000+</h3>
              <p className="mt-2 text-lg text-gray-500">Registered Users</p>
            </div>
            <div>
              <Heart className="h-12 w-12 text-primary-600 mx-auto" />
              <h3 className="mt-4 text-2xl font-bold text-gray-900">2,000+</h3>
              <p className="mt-2 text-lg text-gray-500">Lives Impacted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Medicines */}
      {featuredMedicines.length > 0 && (
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
                Featured Medicines
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Recently Added Medications
              </p>
            </div>
            <div className="mt-10">
              <MedicinesGrid medicines={featuredMedicines} />
            </div>
          </div>
        </div>
      )}

      {/* CTA section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to make a difference?</span>
            <span className="block text-primary-100">Join MediShare today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
            <Button
              as={Link}
              to="/signup"
              className="bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              size="lg"
            >
              Get started
            </Button>
            <Button
              variant="outline"
              as={Link}
              to="/about"
              className="bg-white/10 text-white border-white hover:bg-white/30 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              size="lg"
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
