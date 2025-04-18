import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { MedicineReminder } from '../../types/medicine';
import { format } from 'date-fns';

interface ReminderManagerProps {
  reminders: MedicineReminder[];
  onAddReminder: (reminder: Omit<MedicineReminder, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateReminder: (reminder: MedicineReminder) => void;
  onDeleteReminder: (reminderId: string) => void;
}

export function ReminderManager({ reminders, onAddReminder, onUpdateReminder, onDeleteReminder }: ReminderManagerProps) {
  const [newReminder, setNewReminder] = useState({
    type: 'expiry' as const,
    threshold: 0,
    frequency: '',
  });

  const handleAddReminder = () => {
    if (newReminder.type && (newReminder.threshold > 0 || newReminder.frequency)) {
      onAddReminder(newReminder);
      setNewReminder({
        type: 'expiry',
        threshold: 0,
        frequency: '',
      });
    }
  };

  const getReminderTypeLabel = (type: string) => {
    switch (type) {
      case 'expiry':
        return 'Expiry Reminder';
      case 'low_stock':
        return 'Low Stock Alert';
      case 'dosage':
        return 'Dosage Reminder';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Manage Reminders</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Reminder Type</Label>
          <Select
            id="type"
            value={newReminder.type}
            onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as 'expiry' | 'low_stock' | 'dosage' })}
          >
            <option value="expiry">Expiry Reminder</option>
            <option value="low_stock">Low Stock Alert</option>
            <option value="dosage">Dosage Reminder</option>
          </Select>
        </div>

        {newReminder.type !== 'dosage' && (
          <div className="space-y-2">
            <Label htmlFor="threshold">
              {newReminder.type === 'expiry' ? 'Days Before Expiry' : 'Low Stock Threshold'}
            </Label>
            <Input
              id="threshold"
              type="number"
              min="1"
              value={newReminder.threshold}
              onChange={(e) => setNewReminder({ ...newReminder, threshold: parseInt(e.target.value) })}
            />
          </div>
        )}

        {newReminder.type === 'dosage' && (
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Input
              id="frequency"
              value={newReminder.frequency}
              onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
              placeholder="e.g., Every 8 hours"
            />
          </div>
        )}
      </div>

      <Button onClick={handleAddReminder} className="w-full md:w-auto">
        Add Reminder
      </Button>

      <div className="mt-6 space-y-4">
        <h4 className="font-medium">Active Reminders</h4>
        <div className="space-y-2">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{getReminderTypeLabel(reminder.type)}</p>
                {reminder.type !== 'dosage' && (
                  <p className="text-sm text-gray-500">
                    Threshold: {reminder.threshold}
                  </p>
                )}
                {reminder.type === 'dosage' && reminder.frequency && (
                  <p className="text-sm text-gray-500">
                    Frequency: {reminder.frequency}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateReminder(reminder)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDeleteReminder(reminder.id)}
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