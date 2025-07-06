import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { TextField } from '@/components/ui/textfield';
import { ServerWorkoutTemplate } from '@/types/types';

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  clients: { id: number; User: { name: string } }[];
  templates: ServerWorkoutTemplate[];
  isCreating: boolean;
  selectedDate: Date | undefined;
}

export default function AddSessionModal({
  isOpen,
  onClose,
  onSave,
  clients,
  templates,
  isCreating,
  selectedDate,
}: AddSessionModalProps) {
  const [form, setForm] = useState({
    clientId: '',
    workoutTemplateId: '',
    time: '',
    note: '',
    duration: '60',
  });

  // Сброс формы при открытии модалки
  useEffect(() => {
    if (isOpen) {
      setForm({
        clientId: '',
        workoutTemplateId: '',
        time: '',
        note: '',
        duration: '60',
      });
    }
  }, [isOpen]);

  // Обработчик изменения полей формы
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { name: string, value: string }
  ) => {
    if ('target' in e) {
      setForm((prev) => ({ ...prev, [e.target.name]: (e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value }));
    } else {
      setForm((prev) => ({ ...prev, [e.name]: e.value }));
    }
  };

  // Генерируем опции времени с шагом 15 минут с 07:00 до 22:00
  const timeOptions = [
    { value: '', label: 'Choose time', disabled: true },
    ...Array.from({ length: ((22 - 7) * 4) + 1 }, (_, i) => {
      const hour = 7 + Math.floor(i / 4);
      const minute = (i % 4) * 15;
      const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      return { value, label: value, disabled: false };
    })
  ];

  // Опции для длительности сессии
  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '75', label: '1 hour 15 minutes' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !form.time || !form.workoutTemplateId) {
      return;
    }
    onSave(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Session">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Client</label>
          <Select
            name="clientId"
            value={form.clientId}
            onChange={handleFormChange}
            required
          >
            <option value="" disabled>Select client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.User?.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Workout Template</label>
          <Select
            name="workoutTemplateId"
            value={form.workoutTemplateId}
            onChange={handleFormChange}
            required
          >
            <option value="" disabled>Select workout template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Time</label>
          <Select
            name="time"
            value={form.time}
            onChange={handleFormChange}
            required
          >
            {timeOptions.map(option => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Duration</label>
          <Select
            name="duration"
            value={form.duration}
            onChange={handleFormChange}
            required
          >
            {durationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Note</label>
          <TextField
            name="note"
            value={form.note}
            onChange={handleFormChange}
            rows={2}
            placeholder="Optional note..."
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
            {isCreating ? 'Creating...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 