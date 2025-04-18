export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'donor' | 'claimer';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          role: 'donor' | 'claimer';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'donor' | 'claimer';
          created_at?: string;
        };
      };
      medicines: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          quantity: number;
          expiry_date: string;
          image_url?: string;
          location: string;
          posted_by: string;
          status?: 'available' | 'claimed' | 'expired';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          quantity?: number;
          expiry_date?: string;
          image_url?: string;
          location?: string;
          posted_by?: string;
          status?: 'available' | 'claimed' | 'expired';
          created_at?: string;
        };
      };
      claims: {
        Row: {
          id: string;
          medicine_id: string;
          claimer_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          medicine_id: string;
          claimer_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          medicine_id?: string;
          claimer_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}