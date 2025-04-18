import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Medicine } from '../lib/supabase';

interface FavoritesState {
  favorites: Medicine[];
  isLoading: boolean;
  error: string | null;
  fetchFavorites: () => Promise<void>;
  addFavorite: (medicineId: string) => Promise<void>;
  removeFavorite: (medicineId: string) => Promise<void>;
  isFavorite: (medicineId: string) => boolean;
  clearError: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  fetchFavorites: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ favorites: [], isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('medicineId')
        .eq('userId', user.id);

      if (error) throw error;

      const medicineIds = data.map(f => f.medicineId);
      const { data: medicines, error: medicinesError } = await supabase
        .from('medicines')
        .select('*')
        .in('id', medicineIds);

      if (medicinesError) throw medicinesError;

      set({ favorites: medicines || [], isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch favorites', isLoading: false });
    }
  },

  addFavorite: async (medicineId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('favorites')
        .insert([{ userId: user.id, medicineId }]);

      if (error) throw error;

      const { data: medicine, error: medicineError } = await supabase
        .from('medicines')
        .select('*')
        .eq('id', medicineId)
        .single();

      if (medicineError) throw medicineError;

      set(state => ({
        favorites: [...state.favorites, medicine]
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to add favorite' });
    }
  },

  removeFavorite: async (medicineId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('userId', user.id)
        .eq('medicineId', medicineId);

      if (error) throw error;

      set(state => ({
        favorites: state.favorites.filter(m => m.id !== medicineId)
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to remove favorite' });
    }
  },

  isFavorite: (medicineId: string) => {
    return get().favorites.some(m => m.id === medicineId);
  },

  clearError: () => set({ error: null })
})); 