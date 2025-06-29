'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TextField } from '@/components/ui/textfield';
import { Modal } from '@/components/ui/modal';
import toast from 'react-hot-toast';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded?: () => void;
}

export default function AddClientModal({ isOpen, onClose, onClientAdded }: AddClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: '',
    address: '',
    notes: '',
    plan: 'Premium Monthly' as const,
    type: 'Subscription' as const,
    nextSession: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onClose();
        onClientAdded?.();
        toast.success('Client added successfully');
      } else {
        toast.error('Failed to add client');
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('An error occurred while adding the client');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Add New Client">
      <form onSubmit={handleSubmit} className="space-y-4 min-w-[28rem]">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-primary mb-2">
            Address
          </label>
          <Input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, City, Country"
          />
        </div>
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-primary mb-2">
            Fitness Goals
          </label>
          <TextField
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            rows={3}
            placeholder="Enter client's fitness goals..."
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-primary mb-2">
            Notes
          </label>
          <TextField
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Additional notes about the client..."
          />
        </div>
        <div>
          <label htmlFor="plan" className="block text-sm font-medium text-primary mb-2">
            Plan
          </label>
          <Select
            id="plan"
            name="plan"
            value={formData.plan}
            onChange={handleChange}
          >
            <option value="Premium Monthly">Premium Monthly</option>
            <option value="Standard Weekly">Standard Weekly</option>
            <option value="Single Session">Single Session</option>
          </Select>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-primary mb-2">
            Type
          </label>
          <Select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="Subscription">Subscription</option>
            <option value="One-time">One-time</option>
          </Select>
        </div>
        <div>
          <label htmlFor="nextSession" className="block text-sm font-medium text-primary mb-2">
            Next Session
          </label>
          <Input
            id="nextSession"
            name="nextSession"
            type="datetime-local"
            value={formData.nextSession}
            onChange={handleChange}
            className="cursor-pointer"
          />
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="danger" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Adding...' : 'Add Client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 