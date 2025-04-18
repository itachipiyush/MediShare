import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { MedicineInsert } from '../../store/medicines-store';

const medicineSchema = z.object({
  name: z.string().min(3, { message: "Medication name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  expiry_date: z.string().refine(date => new Date(date) > new Date(), {
    message: "Expiry date must be in the future",
  }),
  location: z.string().min(2, { message: "Location is required" }),
  image_url: z.string().url({ message: "Invalid URL" }).optional().or(z.literal('')),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

interface MedicineFormProps {
  onSubmit: (data: MedicineInsert) => Promise<void>;
  defaultValues?: Partial<MedicineFormValues>;
  loading?: boolean;
}

export const MedicineForm: React.FC<MedicineFormProps> = ({
  onSubmit,
  defaultValues,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: defaultValues || {
      name: '',
      description: '',
      quantity: 1,
      expiry_date: '',
      location: '',
      image_url: '',
    },
  });

  const handleFormSubmit = async (data: MedicineFormValues) => {
    await onSubmit(data as MedicineInsert);
    // Only reset if no defaultValues were provided (assuming it's a new form, not edit)
    if (!defaultValues) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Medication Name"
        placeholder="e.g., Paracetamol 500mg"
        {...register('name')}
        error={errors.name?.message}
      />
      
      <Textarea
        label="Description"
        placeholder="Include details about the medication, condition, packaging, etc."
        rows={4}
        {...register('description')}
        error={errors.description?.message}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Quantity"
          type="number"
          min={1}
          {...register('quantity', { valueAsNumber: true })}
          error={errors.quantity?.message}
        />
        
        <Input
          label="Expiry Date"
          type="date"
          {...register('expiry_date')}
          error={errors.expiry_date?.message}
        />
      </div>
      
      <Input
        label="Location"
        placeholder="City, State"
        {...register('location')}
        error={errors.location?.message}
      />
      
      <Input
        label="Image URL (Optional)"
        placeholder="https://example.com/image.jpg"
        {...register('image_url')}
        error={errors.image_url?.message}
      />
      
      <div className="pt-2">
        <Button
          type="submit"
          isLoading={loading}
          className="w-full md:w-auto"
        >
          {defaultValues ? 'Update Medication' : 'Donate Medication'}
        </Button>
      </div>
    </form>
  );
};