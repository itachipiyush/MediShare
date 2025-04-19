//auth-store.ts

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoading: false,
  error: null,

  signUp: async (email: string, password: string, role: UserRole) => {
    try {
      set({ isLoading: true, error: null });

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error('Error during sign up:', authError);
        throw authError;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([{ id: authData.user.id, email, role }]);

        if (profileError) {
          console.error('Error inserting user into users table:', profileError);
          throw profileError;
        }

        console.log('User successfully added to users table');
      }
    } catch (error) {
      console.error('Sign up process failed:', error);
      set({ error: error instanceof Error ? error.message : 'An error occurred during sign up' });
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Attempting to sign in with:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Auth successful, user data:', data);

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle(); // Use maybeSingle to handle no rows gracefully

        if (userError) {
          console.error('Error fetching user profile:', userError);
          throw userError;
        }

        if (!userData) {
          console.error('No user profile found for the authenticated user');
          throw new Error('User profile not found. Please contact support.');
        }

        console.log('User profile fetched successfully:', userData);
        set({ user: userData });
      } else {
        console.error('No user data received after successful auth');
        throw new Error('No user data received after successful authentication');
      }
    } catch (error) {
      console.error('Sign in process failed:', error);
      set({ error: error instanceof Error ? error.message : 'An error occurred during sign in' });
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },

  getUser: async () => {
    try {
      set({ isLoading: true, error: null });

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (userError) throw userError;
        set({ user: userData });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
