//dashboard-page.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MedicinesGrid } from '../components/medicines/medicines-grid';
import { Medicine, useMedicinesStore } from '../store/medicines-store';
import { useAuthStore } from '../store/auth-store';
// Removed unused imports for Edit and Trash

interface MedicineCardProps {
  medicine: {
    id: string;
    name: string;
    description: string;
    image_url: string | null;
  };
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const navigate = useNavigate();
  const { deleteMedicine } = useMedicinesStore();
  const { user } = useAuthStore(); // Get the current user

  const handleEdit = () => {
    navigate(`/medicines/edit/${medicine.id}`); // Redirect to the edit page
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await deleteMedicine(medicine.id); // Call the delete function
        alert('Medicine deleted successfully.');
        window.location.reload(); // Reload the page to reflect changes
      } catch (error) {
        console.error('Error deleting medicine:', error);
        alert('Failed to delete medicine.');
      }
    }
  };

  return (
    <div className="border rounded shadow-sm overflow-hidden">
      <img
        src={medicine.image_url || '/placeholder-image.jpg'} // Use the image_url directly
        alt={medicine.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{medicine.name}</h3>
        <p className="text-sm text-gray-600">{medicine.description}</p>
        {user?.role === 'donor' && (
          <div className="flex justify-between mt-4">
            <Button variant="primary" size="sm" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { getUserMedicines, getUserClaims, deleteMedicine } = useMedicinesStore();

  const [userMedicines, setUserMedicines] = useState<Medicine[]>([]);
  interface UserClaim {
    id: string;
    medicines: {
      id: string;
      name: string;
      description: string;
      image_url: string | null;
    };
  }

  const [userClaims, setUserClaims] = useState<UserClaim[]>([]);
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
          setUserClaims(
            claims.map(claim => ({
              ...claim,
              medicines: {
                ...claim.medicines,
                image_url: claim.medicines.image_url ?? null, // Convert undefined to null
              },
            }))
          );
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

  const handleEdit = (medicine: Medicine) => {
    navigate(`/medicines/${medicine.id}/edit`); // Ensure the URL matches the route
  };

  const handleDelete = async (medicine: Medicine) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${medicine.name}"? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        const result = await deleteMedicine(medicine.id, medicine.image_url);

        if (result.success) {
          setUserMedicines(prev => prev.filter(m => m.id !== medicine.id));
          alert('Medicine deleted successfully.');
        } else {
          alert('Failed to delete medicine.');
        }
      } catch (error) {
        console.error('Error deleting medicine:', error);
        alert('Failed to delete medicine.');
      }
    }
  };

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
        <h1 className="text-3xl font-bold text-slate-800 mb-4 md:mb-0">My Dashboard</h1>

        {user.role === 'donor' && (
          <Button as={Link} to="/medicines/new" className="flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" />
            Donate Medication
          </Button>
        )}
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Account Type */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-slate-800">Account Type</h3>
            <p className="text-sm text-slate-600 mt-2 capitalize">{user.role}</p>
          </CardContent>
        </Card>

        {/* Donations */}
        {user.role === 'donor' && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-800">Donations</h3>
              <p className="text-sm text-slate-600 mt-2">{userMedicines.length}</p>
            </CardContent>
          </Card>
        )}

        {/* Available Medications */}
        {user.role === 'donor' && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-800">Available</h3>
              <p className="text-sm text-slate-600 mt-2">
                {userMedicines.filter(medicine => medicine.status === 'available').length}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Claimed Medications */}
        {user.role === 'claimer' && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-800">Claimed</h3>
              <p className="text-sm text-slate-600 mt-2">{userClaims.length}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Donor: My Medications */}
      {user.role === 'donor' && (
        <Card className="mb-8">
          <CardHeader className="px-6 py-4">
            <h2 className="text-xl font-bold text-slate-800">My Medication Listings</h2>
          </CardHeader>
          <CardContent>
            <MedicinesGrid
              medicines={userMedicines}
              loading={isLoading}
              emptyMessage="You haven't listed any medications yet. Click 'Donate Medication' to get started."
              onEditClick={handleEdit}
              onDeleteClick={handleDelete}
            />
          </CardContent>
        </Card>
      )}

      {/* Claimer: My Claims */}
      {user.role === 'claimer' && (
        <Card className="mb-8">
          <CardHeader className="px-6 py-4">
            <h2 className="text-xl font-bold text-slate-800">My Claimed Medications</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-96 bg-slate-200 rounded"></div>
              </div>
            ) : userClaims.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">
                  You haven't claimed any medications yet. Browse available medications to make a
                  claim.
                </p>
                <Button as={Link} to="/medicines" variant="outline" className="mt-4">
                  Browse Medications
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userClaims.map(claim => (
                  <MedicineCard key={claim.id} medicine={claim.medicines} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
