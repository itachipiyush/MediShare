import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MedicinesGrid } from '../components/medicines/medicines-grid';
import { Medicine, useMedicinesStore } from '../store/medicines-store';
import { useAuthStore } from '../store/auth-store';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { getUserMedicines, getUserClaims } = useMedicinesStore();
  
  const [userMedicines, setUserMedicines] = useState<Medicine[]>([]);
  const [userClaims, setUserClaims] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const medicines = await getUserMedicines(user.id);
        setUserMedicines(medicines);
        
        if (user.role === 'claimer') {
          const claims = await getUserClaims(user.id);
          setUserClaims(claims);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!isAuthLoading && !user) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: '/dashboard' } });
    } else if (user) {
      fetchUserData();
    }
  }, [user, isAuthLoading, navigate, getUserMedicines, getUserClaims]);
  
  if (isAuthLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4 md:mb-0">
          My Dashboard
        </h1>
        
        {user.role === 'donor' && (
          <Button
            as={Link}
            to="/medicines/new"
            className="flex items-center"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Donate Medication
          </Button>
        )}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-slate-500 mb-1">Account Type</h2>
            <p className="text-2xl font-bold text-slate-800 capitalize">
              {user.role}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-slate-500 mb-1">
              {user.role === 'donor' ? 'Donations' : 'Claims'}
            </h2>
            <p className="text-2xl font-bold text-slate-800">
              {user.role === 'donor' ? userMedicines.length : userClaims.length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-slate-500 mb-1">Available</h2>
            <p className="text-2xl font-bold text-slate-800">
              {user.role === 'donor'
                ? userMedicines.filter(m => m.status === 'available').length
                : '-'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-slate-500 mb-1">
              {user.role === 'donor' ? 'Claimed' : 'Active Claims'}
            </h2>
            <p className="text-2xl font-bold text-slate-800">
              {user.role === 'donor'
                ? userMedicines.filter(m => m.status === 'claimed').length
                : userClaims.length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Donor: My Medications */}
      {user.role === 'donor' && (
        <Card className="mb-8">
          <CardHeader className="px-6 py-4">
            <h2 className="text-xl font-bold text-slate-800">
              My Medication Listings
            </h2>
          </CardHeader>
          <CardContent>
            <MedicinesGrid
              medicines={userMedicines}
              loading={isLoading}
              emptyMessage="You haven't listed any medications yet. Click 'Donate Medication' to get started."
            />
          </CardContent>
        </Card>
      )}
      
      {/* Claimer: My Claims */}
      {user.role === 'claimer' && (
        <Card className="mb-8">
          <CardHeader className="px-6 py-4">
            <h2 className="text-xl font-bold text-slate-800">
              My Claimed Medications
            </h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-96 bg-slate-200 rounded"></div>
              </div>
            ) : userClaims.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  You haven't claimed any medications yet. Browse available medications to make a claim.
                </p>
                <Button
                  as={Link}
                  to="/medicines"
                  variant="outline"
                  className="mt-4"
                >
                  Browse Medications
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userClaims.map((claim) => (
                  <MedicineCard
                    key={claim.id}
                    medicine={claim.medicines}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};