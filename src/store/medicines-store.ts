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
  fetchMedicines: (filters?: { name?: string; location?: string; }) => Promise<void>;
  createMedicine: (medicine: MedicineInsert) => Promise<{ data: Medicine | null; error: any | null }>;
  updateMedicine: (id: string, medicine: MedicineUpdate) => Promise<{ error: any | null }>;
  deleteMedicine: (id: string) => Promise<{ error: any | null }>;
  claimMedicine: (medicineId: string, claimerId: string) => Promise<{ error: any | null }>;
  getUserMedicines: (userId: string) => Promise<Medicine[]>;
  getUserClaims: (userId: string) => Promise<any[]>;
};

export const useMedicinesStore = create<MedicinesState>((set, get) => ({
  medicines: [],
  isLoading: false,
  error: null,
  
  fetchMedicines: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    let query = supabase
      .from('medicines')
      .select('*')
      .eq('status', 'available');
    
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
  
  createMedicine: async (medicine) => {
    const { data, error } = await supabase
      .from('medicines')
      .insert(medicine)
      .select()
      .single();
    
    if (!error && data) {
      set((state) => ({ medicines: [data, ...state.medicines] }));
    }
    
    return { data, error };
  },
  
  updateMedicine: async (id, medicine) => {
    const { error } = await supabase
      .from('medicines')
      .update(medicine)
      .eq('id', id);
    
    if (!error) {
      await get().fetchMedicines();
    }
    
    return { error };
  },
  
  deleteMedicine: async (id) => {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);
    
    if (!error) {
      set((state) => ({
        medicines: state.medicines.filter((medicine) => medicine.id !== id),
      }));
    }
    
    return { error };
  },
  
  claimMedicine: async (medicineId, claimerId) => {
    // First insert claim record
    const { error: claimError } = await supabase
      .from('claims')
      .insert({
        medicine_id: medicineId,
        claimer_id: claimerId,
      });
    
    if (claimError) {
      return { error: claimError };
    }
    
    // Then update medicine status
    const { error: updateError } = await supabase
      .from('medicines')
      .update({ status: 'claimed' })
      .eq('id', medicineId);
    
    if (!updateError) {
      await get().fetchMedicines();
    }
    
    return { error: updateError };
  },
  
  getUserMedicines: async (userId) => {
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
  
  getUserClaims: async (userId) => {
    const { data, error } = await supabase
      .from('claims')
      .select(`
        *,
        medicines (*)
      `)
      .eq('claimer_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      set({ error: error.message });
      return [];
    }
    
    return data || [];
  },
}));