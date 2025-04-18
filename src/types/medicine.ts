export interface MedicineBatch {
  id: string;
  medicine_id: string;
  quantity: number;
  expiry_date: string;
  condition: 'new' | 'used' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  image_url?: string;
  user_id: string;
  location: string;
  created_at: string;
  updated_at: string;
  batches: MedicineBatch[];
  total_quantity: number;
  barcode?: string;
  dosage?: string;
  interactions?: string[];
  reminders?: MedicineReminder[];
}

export interface MedicineReminder {
  id: string;
  medicine_id: string;
  user_id: string;
  type: 'expiry' | 'low_stock' | 'dosage';
  threshold?: number;
  frequency?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicineCategory {
  id: string;
  name: string;
  description?: string;
  subcategories?: string[];
}

export interface MedicineInteraction {
  medicine_id: string;
  interacts_with: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
} 