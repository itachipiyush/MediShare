import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, AlertTriangle, Package, Clock, User, EditIcon, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth-store';
import { useMedicinesStore, Medicine } from '../store/medicines-store';
import { formatDate, isExpired } from '../lib/utils';
import { ClaimModal } from '../components/medicines/claim-modal';
import { BatchManager } from '../components/medicines/batch-manager';
import { InteractionChecker } from '../components/medicines/interaction-checker';
import { ReminderManager } from '../components/medicines/reminder-manager';
import { MedicineBatch, MedicineInteraction, MedicineReminder } from '../types/medicine';

export const MedicineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { claimMedicine, deleteMedicine } = useMedicinesStore();
  
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [donor, setDonor] = useState<any | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  
  useEffect(() => {
    const fetchMedicineDetails = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('medicines')
          .select(`
            *,
            batches:medicine_batches(*),
            interactions:medicine_interactions(*),
            reminders:medicine_reminders(*)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setMedicine(data);
        
        // Fetch donor details
        if (data.posted_by) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.posted_by)
            .single();
          
          if (!userError) {
            setDonor(userData);
          }
        }
      } catch (err) {
        console.error('Error fetching medicine:', err);
        setError('Failed to load medicine details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedicineDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-slate-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-24 bg-slate-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !medicine) {
    return (
      <div className="container mx-auto px-4 py-12 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          {error || 'Medication not found'}
        </h2>
        <p className="text-slate-600 mb-8">
          The medication you're looking for may have been removed or claimed.
        </p>
        <Button as={Link} to="/medicines">
          Browse Available Medications
        </Button>
      </div>
    );
  }
  
  const expired = isExpired(medicine.expiry_date);
  const canClaim = user && user.role === 'claimer' && medicine.status === 'available' && !expired;
  const canEdit = user && medicine.posted_by === user.id && medicine.status === 'available';

  // Placeholder image if no image or error loading
  const placeholderImage = 'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  
  const handleClaimClick = () => {
    setIsClaimModalOpen(true);
  };
  
  const handleClaimConfirm = async () => {
    if (!user || !medicine) return;
    
    setIsClaimLoading(true);
    
    try {
      const { error } = await claimMedicine(medicine.id, user.id);
      
      if (!error) {
        setIsClaimModalOpen(false);
        // Refetch the medicine details to update the status
        const { data } = await supabase
          .from('medicines')
          .select(`
            *,
            batches:medicine_batches(*),
            interactions:medicine_interactions(*),
            reminders:medicine_reminders(*)
          `)
          .eq('id', id)
          .single();
        
        setMedicine(data);
      } else {
        console.error('Error claiming medicine:', error);
      }
    } catch (err) {
      console.error('Error claiming medicine:', err);
    } finally {
      setIsClaimLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    setIsDeleteLoading(true);
    
    try {
      const { error } = await deleteMedicine(medicine.id);
      
      if (!error) {
        navigate('/dashboard');
      } else {
        console.error('Error deleting medicine:', error);
      }
    } catch (err) {
      console.error('Error deleting medicine:', err);
    } finally {
      setIsDeleteLoading(false);
    }
  };
  
  const handleClaim = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/medicines/${id}` } });
      return;
    }

    try {
      setIsClaiming(true);
      const { error } = await supabase.from('claims').insert([
        {
          medicine_id: id,
          claimer_id: user.id,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      // Update medicine status
      const { error: updateError } = await supabase
        .from('medicines')
        .update({ status: 'claimed' })
        .eq('id', id);

      if (updateError) throw updateError;

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to claim medicine');
      console.error('Error claiming medicine:', error);
    } finally {
      setIsClaiming(false);
    }
  };
  
  const handleAddBatch = async (batch: Omit<MedicineBatch, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('medicine_batches')
        .insert([{ ...batch, medicine_id: id }])
        .select()
        .single();

      if (error) throw error;

      setMedicine((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          batches: [...prev.batches, data],
          total_quantity: prev.total_quantity + data.quantity,
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add batch');
    }
  };

  const handleAddInteraction = async (interaction: Omit<MedicineInteraction, 'medicine_id'>) => {
    try {
      const { data, error } = await supabase
        .from('medicine_interactions')
        .insert([{ ...interaction, medicine_id: id }])
        .select()
        .single();

      if (error) throw error;

      setMedicine((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          interactions: [...prev.interactions, data],
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add interaction');
    }
  };

  const handleAddReminder = async (reminder: Omit<MedicineReminder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('medicine_reminders')
        .insert([{ ...reminder, medicine_id: id, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;

      setMedicine((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          reminders: [...prev.reminders, data],
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reminder');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="text-sm text-slate-500 mb-2">
            <Link to="/medicines" className="hover:text-teal-600">
              Medications
            </Link>{' '}
            / {medicine.name}
          </nav>
          <h1 className="text-3xl font-bold text-slate-800">{medicine.name}</h1>
        </div>
        
        {canEdit && (
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              as={Link}
              to={`/medicines/${medicine.id}/edit`}
              className="flex items-center"
            >
              <EditIcon className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleteLoading}
              className="flex items-center"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={imageError || !medicine.image_url ? placeholderImage : medicine.image_url}
            alt={medicine.name}
            className="w-full h-auto object-cover aspect-video"
            onError={() => setImageError(true)}
          />
        </div>
        
        {/* Details */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              {medicine.status !== 'available' && (
                <Badge
                  variant={medicine.status === 'claimed' ? 'danger' : 'warning'}
                  className="mb-4"
                >
                  {medicine.status === 'claimed' ? 'Claimed' : 'Expired'}
                </Badge>
              )}
              
              <div className="prose max-w-none mb-6">
                <p className="text-slate-600">
                  {medicine.description}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-slate-600">
                  <Package className="mr-2 h-5 w-5 text-teal-600" />
                  <span>Quantity: {medicine.quantity}</span>
                </div>
                
                <div className="flex items-center text-slate-600">
                  <MapPin className="mr-2 h-5 w-5 text-teal-600" />
                  <span>Location: {medicine.location}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-teal-600" />
                  <span className={expired ? 'text-red-600' : 'text-slate-600'}>
                    Expiry Date: {formatDate(medicine.expiry_date)}
                    {expired && (
                      <span className="ml-2 text-red-600 font-medium">
                        (Expired)
                      </span>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center text-slate-600">
                  <Clock className="mr-2 h-5 w-5 text-teal-600" />
                  <span>Posted: {formatDate(medicine.created_at)}</span>
                </div>
                
                <div className="flex items-center text-slate-600">
                  <User className="mr-2 h-5 w-5 text-teal-600" />
                  <span>Posted by: {donor?.full_name || 'Anonymous'}</span>
                </div>
              </div>
              
              {medicine.status === 'available' && !expired && (
                <div className="mt-8">
                  {canClaim ? (
                    <Button
                      onClick={handleClaimClick}
                      className="w-full sm:w-auto"
                    >
                      Claim This Medication
                    </Button>
                  ) : (
                    user ? (
                      <p className="text-amber-600 text-sm">
                        Only verified claimers can request this medication.
                      </p>
                    ) : (
                      <Button
                        as={Link}
                        to="/login"
                        className="w-full sm:w-auto"
                      >
                        Log In to Claim
                      </Button>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-slate-800 mb-2">Important Legal Notice</h3>
                  <p className="text-sm text-slate-600">
                    MediShare does not verify the quality, safety, or efficacy of medications listed on our platform. 
                    Always check expiry dates, packaging integrity, and consult with a healthcare professional before using any medication.
                    <br /><br />
                    <Link to="/disclaimer" className="text-teal-600 hover:underline">
                      Read our full legal disclaimer →
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {medicine && (
        <ClaimModal
          medicine={medicine}
          isOpen={isClaimModalOpen}
          onClose={() => setIsClaimModalOpen(false)}
          onConfirm={handleClaimConfirm}
          loading={isClaimLoading}
        />
      )}

      <div className="mt-8">
        <BatchManager
          batches={medicine.batches}
          onAddBatch={handleAddBatch}
          onUpdateBatch={() => {}}
          onDeleteBatch={() => {}}
        />
      </div>

      <div className="mt-8">
        <InteractionChecker
          medicineId={medicine.id}
          interactions={medicine.interactions}
          onAddInteraction={handleAddInteraction}
        />
      </div>

      <div className="mt-8">
        <ReminderManager
          reminders={medicine.reminders}
          onAddReminder={handleAddReminder}
          onUpdateReminder={() => {}}
          onDeleteReminder={() => {}}
        />
      </div>
    </div>
  );
};