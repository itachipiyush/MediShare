import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { MedicineBatch } from '../../types/medicine';
import { format } from 'date-fns';

interface BatchManagerProps {
  batches: MedicineBatch[];
  onAddBatch: (batch: Omit<MedicineBatch, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateBatch: (batch: MedicineBatch) => void;
  onDeleteBatch: (batchId: string) => void;
}

export function BatchManager({ batches, onAddBatch, onUpdateBatch, onDeleteBatch }: BatchManagerProps) {
  const [newBatch, setNewBatch] = useState({
    quantity: 0,
    expiry_date: '',
    condition: 'new' as const,
  });

  const handleAddBatch = () => {
    if (newBatch.quantity > 0 && newBatch.expiry_date) {
      onAddBatch(newBatch);
      setNewBatch({
        quantity: 0,
        expiry_date: '',
        condition: 'new',
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Batches</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={newBatch.quantity}
            onChange={(e) => setNewBatch({ ...newBatch, quantity: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry_date">Expiry Date</Label>
          <Input
            id="expiry_date"
            type="date"
            value={newBatch.expiry_date}
            onChange={(e) => setNewBatch({ ...newBatch, expiry_date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            id="condition"
            value={newBatch.condition}
            onChange={(e) => setNewBatch({ ...newBatch, condition: e.target.value as 'new' | 'used' | 'expired' })}
          >
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="expired">Expired</option>
          </Select>
        </div>
      </div>

      <Button onClick={handleAddBatch} className="w-full md:w-auto">
        Add Batch
      </Button>

      <div className="mt-6 space-y-4">
        <h4 className="font-medium">Existing Batches</h4>
        <div className="space-y-2">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">Quantity: {batch.quantity}</p>
                <p className="text-sm text-gray-500">
                  Expires: {format(new Date(batch.expiry_date), 'PPP')}
                </p>
                <p className="text-sm text-gray-500">Condition: {batch.condition}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateBatch(batch)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDeleteBatch(batch.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 