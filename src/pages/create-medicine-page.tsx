// //create-medicine-page.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth-store';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const medicineSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  condition: z.string().min(1, 'Condition is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.string().min(1, 'Status is required'),
});

type MedicineFormData = z.infer<typeof medicineSchema>;

export function CreateMedicinePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>([51.505, -0.09]); // Default position
  const [currentLocation, setCurrentLocation] = useState<string | null>('51.505, -0.09');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MedicineFormData>({
    resolver: zodResolver(medicineSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: MedicineFormData) => {
    try {
      setUploading(true);
      setError(null);

      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('medicine-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('medicine-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('medicines').insert([
        {
          ...data,
          posted_by: user?.id,
          status: 'available',
          image_url: imageUrl,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create medicine listing');
      console.error('Error creating medicine:', error);
    } finally {
      setUploading(false);
    }
  };

  const LocationMarker = () => {
    const map = useMap();

    useEffect(() => {
      if (markerPosition) {
        map.setView(markerPosition, map.getZoom()); // Center the map on the marker
      }
    }, [markerPosition, map]);

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setCurrentLocation(locationString);
        setValue('location', locationString);
      },
    });

    return markerPosition ? <Marker position={markerPosition} /> : null;
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition([latitude, longitude]);
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setCurrentLocation(locationString);
          setValue('location', locationString);
        },
        () => {
          setError('Unable to retrieve location.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">List a New Medicine</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Medicine Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Medicine Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
            )}
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.expiry_date && (
              <p className="mt-1 text-sm text-red-600">{errors.expiry_date.message}</p>
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select condition</option>
              <option value="unopened">Unopened</option>
              <option value="sealed">Sealed</option>
              <option value="partially_used">Partially Used</option>
            </select>
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
            )}
          </div>

          {/* Pickup Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Pickup Location
            </label>
            <div className="mt-4 relative">
              <MapContainer
                center={markerPosition || [51.505, -0.09]} // Center on the marker or default location
                zoom={13}
                style={{
                  height: '300px',
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  zIndex: 0, // Ensure the map does not overlap the header
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker />
              </MapContainer>
            </div>
            <input
              {...register('location')}
              type="text"
              id="location"
              value={currentLocation || ''}
              readOnly
              className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="mt-2 inline-flex items-center px-4 py-2 border border-blue-500 shadow-sm text-sm font-medium rounded-md text-blue-500 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            >
              Use My Current Location
            </button>
          </div>

          {/* Upload Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3 px-4 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' // Disabled state
                  : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400' // Replace with your app's primary color
              }`}
            >
              {uploading ? 'Uploading...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
