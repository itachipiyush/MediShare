import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Medicine } from '../../store/medicines-store';

interface ClaimModalProps {
  medicine: Medicine;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  medicine,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-amber-100 p-2 rounded-full">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-center mb-4">
            Confirm Medication Claim
          </h3>
          
          <p className="text-slate-600 mb-4">
            You are about to claim:
          </p>
          
          <div className="bg-slate-50 p-4 rounded-md mb-4">
            <p className="font-medium">{medicine.name}</p>
            <p className="text-sm text-slate-600">Quantity: {medicine.quantity}</p>
            <p className="text-sm text-slate-600">Location: {medicine.location}</p>
          </div>
          
          <p className="text-slate-600 mb-4 text-sm">
            By claiming this medication, you confirm that you will collect it from the donor's specified location. 
            The donor will be notified and may contact you to arrange pickup.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-md mb-6">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Important:</span> MediShare does not verify the quality of medications. 
              Always check expiry dates and packaging integrity before use.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={onConfirm} 
              isLoading={loading}
            >
              Confirm Claim
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};