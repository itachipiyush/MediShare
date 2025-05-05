import React, { useState } from 'react';
import { Calendar, MapPin, PackageCheck, AlertCircle, Edit, Trash } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatDate, getDaysUntilExpiry, isExpired } from '../../lib/utils';
import { Medicine } from '../../store/medicines-store';
import { useAuthStore } from '../../store/auth-store';
import { MedicineDetailsModal } from './medicine-details-modal';

interface MedicineCardProps {
  medicine: Medicine;
  onClaimClick?: (medicine: Medicine) => void;
  onEditClick?: (medicine: Medicine) => void;
  onDeleteClick?: (medicine: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onClaimClick,
  onEditClick,
  onDeleteClick,
}) => {
  const { user } = useAuthStore();
  const [imageError, setImageError] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const daysUntilExpiry = getDaysUntilExpiry(medicine.expiry_date);
  const expired = isExpired(medicine.expiry_date);

  // Placeholder image if no image or error loading
  const placeholderImage =
    'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  const canClaim = user && user.role === 'claimer' && medicine.status === 'available' && !expired;

  const canEditOrDelete = user && user.role === 'donor' && medicine.posted_by === user.id;

  const handleClaimClick = () => {
    if (onClaimClick && canClaim) {
      onClaimClick(medicine);
    }
  };

  const handleEditClick = () => {
    if (onEditClick && canEditOrDelete) {
      onEditClick(medicine);
    }
  };

  const handleDeleteClick = () => {
    if (onDeleteClick && canEditOrDelete) {
      onDeleteClick(medicine);
    }
  };

  const handleDetailsClick = () => {
    setIsDetailsModalOpen(true);
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={imageError || !medicine.image_url ? placeholderImage : medicine.image_url}
            alt={medicine.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />

          {medicine.status !== 'available' && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg uppercase">
                {medicine.status === 'claimed' ? 'Claimed' : 'Expired'}
              </span>
            </div>
          )}

          {expired && medicine.status === 'available' && (
            <div className="absolute top-0 right-0 m-2">
              <Badge variant="danger" className="flex items-center space-x-1">
                <AlertCircle size={14} />
                <span>Expired</span>
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="flex-grow py-4">
          <h3 className="font-semibold text-lg mb-2 text-slate-800">{medicine.name}</h3>

          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{medicine.description}</p>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-600">
              <MapPin size={16} className="mr-2 text-teal-600" />
              <span>{medicine.location}</span>
            </div>
            <div className="flex items-center text-sm text-slate-600">
              <PackageCheck size={16} className="mr-2 text-teal-600" />
              <span>Quantity: {medicine.quantity}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar size={16} className="mr-2 text-teal-600" />
              <span className={expired ? 'text-red-600' : 'text-slate-600'}>
                Expires: {formatDate(medicine.expiry_date)}
                {!expired && daysUntilExpiry <= 30 && (
                  <span className="ml-1 text-amber-600">({daysUntilExpiry} days left)</span>
                )}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4">
          <div className="flex space-x-2 w-full">
            <Button variant="outline" className="flex-1" onClick={handleDetailsClick}>
              Details
            </Button>

            {canClaim && (
              <Button className="flex-1" onClick={handleClaimClick}>
                Claim
              </Button>
            )}

            {canEditOrDelete && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className="flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteClick}
                  className="flex items-center justify-center"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Medicine Details Modal */}
      <MedicineDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        medicine={medicine}
      />
    </>
  );
};
