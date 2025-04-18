import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MedicineInteraction } from '../../types/medicine';

interface InteractionCheckerProps {
  medicineId: string;
  interactions: MedicineInteraction[];
  onAddInteraction: (interaction: Omit<MedicineInteraction, 'medicine_id'>) => void;
}

export function InteractionChecker({ medicineId, interactions, onAddInteraction }: InteractionCheckerProps) {
  const [newInteraction, setNewInteraction] = useState({
    interacts_with: '',
    severity: 'low' as const,
    description: '',
  });

  const handleAddInteraction = () => {
    if (newInteraction.interacts_with && newInteraction.description) {
      onAddInteraction(newInteraction);
      setNewInteraction({
        interacts_with: '',
        severity: 'low',
        description: '',
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Medicine Interactions</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interacts_with">Interacts With</Label>
          <Input
            id="interacts_with"
            value={newInteraction.interacts_with}
            onChange={(e) => setNewInteraction({ ...newInteraction, interacts_with: e.target.value })}
            placeholder="Medicine name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="severity">Severity</Label>
          <select
            id="severity"
            className="w-full p-2 border rounded-md"
            value={newInteraction.severity}
            onChange={(e) => setNewInteraction({ ...newInteraction, severity: e.target.value as 'low' | 'medium' | 'high' })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          className="w-full p-2 border rounded-md"
          rows={3}
          value={newInteraction.description}
          onChange={(e) => setNewInteraction({ ...newInteraction, description: e.target.value })}
          placeholder="Describe the interaction..."
        />
      </div>

      <Button onClick={handleAddInteraction} className="w-full md:w-auto">
        Add Interaction
      </Button>

      <div className="mt-6 space-y-4">
        <h4 className="font-medium">Existing Interactions</h4>
        <div className="space-y-2">
          {interactions.map((interaction, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{interaction.interacts_with}</p>
                <span className={`font-semibold ${getSeverityColor(interaction.severity)}`}>
                  {interaction.severity.toUpperCase()}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{interaction.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 