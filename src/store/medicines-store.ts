import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

export type Medicine = Database['public']['Tables']['medicines']['Row'];
export type MedicineInsert = Database['public']['Tables']['medicines']['Insert'];
export type MedicineUpdate = Database['public']['Tables']['medicines']['Update'];

type MedicinesState = {
  medicines: Medicine[];
  isLoading: boolean;
  error: string | null;
  fetchMedicines: (filters?: { name?: string; location?: string }) => Promise<void>;
  createMedicine: (
    medicine: MedicineInsert
  ) => Promise<{ data: Medicine | null; error: Error | null }>;
  updateMedicine: (id: string, medicine: MedicineUpdate) => Promise<{ error: Error | null }>;
  deleteMedicine: (id: string, imageUrl?: string) => Promise<{ success: boolean; error?: Error }>; // Updated type
  claimMedicine: (medicineId: string, claimerId: string) => Promise<{ error: Error | null }>;
  getUserMedicines: (userId: string) => Promise<Medicine[]>;
  getUserClaims: (
    userId: string
  ) => Promise<(Database['public']['Tables']['claims']['Row'] & { medicines: Medicine })[]>;
  getMedicineById: (id: string) => Promise<Medicine | null>; // Added this function
};

export const useMedicinesStore = create<MedicinesState>(set => ({
  medicines: [],
  isLoading: false,
  error: null,

  // Fetch all medicines with optional filters
  fetchMedicines: async (filters = {}) => {
    set({ isLoading: true, error: null });

    let query = supabase.from('medicines').select('*').eq('status', 'available');

    if (filters.name) {
      query = query.ilike('name', `%${filters.name}%`);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      set({ error: error.message, isLoading: false });
      return;
    }

    set({ medicines: data || [], isLoading: false });
  },

  // Create a new medicine
  createMedicine: async medicine => {
    const { data, error } = await supabase.from('medicines').insert(medicine).select().single();

    if (!error && data) {
      set(state => ({ medicines: [data, ...state.medicines] }));
    }

    return { data, error };
  },

  // Update an existing medicine
  updateMedicine: async (id, medicine) => {
    const { error } = await supabase.from('medicines').update(medicine).eq('id', id);

    if (!error) {
      set(state => ({
        medicines: state.medicines.map(m => (m.id === id ? { ...m, ...medicine } : m)),
      }));
    }

    return { error };
  },

  // Delete a medicine
  deleteMedicine: async (id: string, imageUrl?: string) => {
    try {
      // Delete the medicine record
      const { error: deleteError } = await supabase.from('medicines').delete().eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Delete the image from the bucket if an image URL exists
      if (imageUrl) {
        const filePath = imageUrl.split('/').slice(-2).join('/'); // Extract the file path from the URL
        const { error: storageError } = await supabase.storage
          .from('medicine-images')
          .remove([filePath]);

        if (storageError) {
          console.error('Error deleting image from storage:', storageError);
        }
      }

      // Update the local state
      set(state => ({
        medicines: state.medicines.filter(medicine => medicine.id !== id),
      }));

      return { success: true };
    } catch (error) {
      console.error('Error deleting medicine:', error);
      return { success: false, error: error as Error };
    }
  },

  // Claim a medicine
  claimMedicine: async (medicineId, claimerId) => {
    // Insert claim record
    const { error: claimError } = await supabase.from('claims').insert({
      medicine_id: medicineId,
      claimer_id: claimerId,
    });

    if (claimError) {
      return { error: claimError };
    }

    // Update medicine status
    const { error: updateError } = await supabase
      .from('medicines')
      .update({ status: 'claimed' })
      .eq('id', medicineId);

    if (!updateError) {
      set(state => ({
        medicines: state.medicines.map(m =>
          m.id === medicineId ? { ...m, status: 'claimed' } : m
        ),
      }));
    }

    return { error: updateError };
  },

  // Get medicines posted by a specific user
  getUserMedicines: async userId => {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('posted_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      set({ error: error.message });
      return [];
    }

    return data || [];
  },

  // Get claims made by a specific user
  getUserClaims: async userId => {
    const { data, error } = await supabase
      .from('claims')
      .select(
        `
        *,
        medicines (*)
      `
      )
      .eq('claimer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      set({ error: error.message });
      return [];
    }

    return data || [];
  },

  // Get a single medicine by ID
  getMedicineById: async id => {
    const { data, error } = await supabase.from('medicines').select('*').eq('id', id).single();

    if (error) {
      console.error('Error fetching medicine by ID:', error);
      return null;
    }

    return data;
  },
}));
