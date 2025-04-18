import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type UserRole = 'donor' | 'claimer' | 'admin';
export type MedicineStatus = 'available' | 'claimed' | 'expired';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  quantity: number;
  expiry_date: string;
  condition: string;
  image_url: string;
  location: string;
  posted_by: string;
  status: MedicineStatus;
  created_at: string;
  updated_at: string;
}

export interface Claim {
  id: string;
  medicine_id: string;
  claimer_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}