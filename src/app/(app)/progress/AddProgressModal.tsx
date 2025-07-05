import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TextField } from '@/components/ui/textfield';
import { CreateProgressData, PROGRESS_CATEGORIES, PROGRESS_UNITS } from '@/types/types';

interface AddProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProgressData) => void;
  clientId: number;
  isCreating: boolean;
}

export default function AddProgressModal({
  isOpen,
  onClose,
  onSave,
  clientId,
  isCreating,
}: AddProgressModalProps) {
  const [form, setForm] = useState<CreateProgressData>({
    clientId,
    date: new Date().toISOString().split('T')[0],
    type: 'weight',
    category: 'weight',
    value: 0,
    unit: 'kg',
    notes: '',
  });

  // Сброс формы при открытии модалки
  useEffect(() => {
    if (isOpen) {
      setForm({
        clientId,
        date: new Date().toISOString().split('T')[0],
        type: 'weight',
        category: 'weight',
        value: 0,
        unit: 'kg',
        notes: '',
      });
    }
  }, [isOpen, clientId]);

  // Обновляем единицы измерения при изменении типа
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      unit: PROGRESS_UNITS[prev.type],
      category: PROGRESS_CATEGORIES[prev.type][0],
    }));
  }, [form.type]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.value <= 0) return;
    onSave(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Progress Entry">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Date</label>
          <Input
            type="date"
            name="date"
            value={form.date}
            onChange={handleFormChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">Type</label>
          <Select
            name="type"
            value={form.type}
            onChange={handleFormChange}
            required
          >
            <option value="weight">Weight</option>
            <option value="measurements">Measurements</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="body_composition">Body Composition</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">Category</label>
          <Select
            name="category"
            value={form.category}
            onChange={handleFormChange}
            required
          >
            {PROGRESS_CATEGORIES[form.type].map(category => (
              <option key={category} value={category}>
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">Value</label>
          <Input
            type="number"
            name="value"
            value={form.value}
            onChange={handleFormChange}
            step="0.1"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">Unit</label>
          <Input
            type="text"
            name="unit"
            value={form.unit}
            onChange={handleFormChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">Notes</label>
          <TextField
            name="notes"
            value={form.notes}
            onChange={handleFormChange}
            rows={3}
            placeholder="Optional notes about this measurement..."
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button 
            type="button" 
            variant="danger" 
            onClick={onClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Saving...' : 'Save Progress'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 