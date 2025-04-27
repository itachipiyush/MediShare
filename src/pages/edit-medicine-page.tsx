import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/button';

const medicineSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  condition: z.string().min(1, 'Condition is required'),
  location: z.string().min(1, 'Location is required'),
});

type MedicineFormData = z.infer<typeof medicineSchema>;

export function EditMedicinePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MedicineFormData>({
    resolver: zodResolver(medicineSchema),
  });

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('medicines').select('*').eq('id', id).single();

        if (error) {
          throw error;
        }

        if (data) {
          // Pre-fill the form with existing data
          setValue('name', data.name);
          setValue('description', data.description);
          setValue('quantity', data.quantity);
          setValue('expiry_date', data.expiry_date);
          setValue('condition', data.condition);
          setValue('location', data.location);
        }
      } catch (error) {
        setError('Failed to fetch medicine details.');
        console.error('Error fetching medicine:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMedicine();
    }
  }, [id, setValue]);

  const onSubmit = async (data: MedicineFormData) => {
    try {
      setError(null);

      const { error: updateError } = await supabase.from('medicines').update(data).eq('id', id);

      if (updateError) {
        throw updateError;
      }

      alert('Medicine updated successfully.');
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to update medicine.');
      console.error('Error updating medicine:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Medicine</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Medicine Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Medicine Name
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            {...register('quantity', { valueAsNumber: true })}
            type="number"
            id="quantity"
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          />
          {errors.quantity && <p className="text-red-600 text-sm">{errors.quantity.message}</p>}
        </div>

        {/* Expiry Date */}
        <div>
          <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            {...register('expiry_date')}
            type="date"
            id="expiry_date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          />
          {errors.expiry_date && (
            <p className="text-red-600 text-sm">{errors.expiry_date.message}</p>
          )}
        </div>

        {/* Condition */}
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            Condition
          </label>
          <select
            {...register('condition')}
            id="condition"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          >
            <option value="">Select condition</option>
            <option value="unopened">Unopened</option>
            <option value="sealed">Sealed</option>
            <option value="partially_used">Partially Used</option>
          </select>
          {errors.condition && <p className="text-red-600 text-sm">{errors.condition.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            {...register('location')}
            type="text"
            id="location"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          />
          {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
        </div>

        {/* Submit Button */}
        <Button type="submit" variant="primary" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
