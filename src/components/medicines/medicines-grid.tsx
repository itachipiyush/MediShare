import React from 'react';
import { MedicineCard } from './medicine-card';
import { Medicine } from '../../store/medicines-store';

interface MedicinesGridProps {
  medicines: Medicine[];
  onClaimClick?: (medicine: Medicine) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export const MedicinesGrid: React.FC<MedicinesGridProps> = ({ 
  medicines, 
  onClaimClick,
  loading = false,
  emptyMessage = "No medications found."
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-100 rounded-lg animate-pulse h-[380px]"></div>
        ))}
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {medicines.map((medicine) => (
        <MedicineCard
          key={medicine.id}
          medicine={medicine}
          onClaimClick={onClaimClick}
        />
      ))}
    </div>
  );
};