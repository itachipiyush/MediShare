import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/ui/modal';
import { Button } from '../ui/button';
import { Medicine } from '../../store/medicines-store';

interface MedicineDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

export const MedicineDetailsModal: React.FC<MedicineDetailsModalProps> = ({
  isOpen,
  onClose,
  medicine,
}) => {
  if (!medicine) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <h2 className="text-lg font-bold">{medicine.name}</h2>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <p>
            <strong>Description:</strong> {medicine.description}
          </p>
          <p>
            <strong>Quantity:</strong> {medicine.quantity}
          </p>
          <p>
            <strong>Location:</strong> {medicine.location}
          </p>
          <p>
            <strong>Expiry Date:</strong> {medicine.expiry_date}
          </p>
          <p>
            <strong>Status:</strong> {medicine.status}
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
