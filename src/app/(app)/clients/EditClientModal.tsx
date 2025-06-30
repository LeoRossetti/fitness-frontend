// src/components/EditClientModal.tsx
"use client";

import { useEffect, useState } from "react";
import { getClientById, updateClient } from "@/lib/api";
import { Client } from "@/types/types";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { TextField } from "@/components/ui/textfield";
import toast from 'react-hot-toast';

type Props = {
  clientId: number;
  onClose: () => void;
  onUpdated?: (client: Client) => void;
};

export default function EditClientModal({ clientId, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    goal: '',
    plan: 'Standard Weekly' as const,
    type: 'Subscription' as const,
    age: '',
    height: '',
    weight: '',
    notes: ''
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        console.log('Fetching client with ID:', clientId);
        const data = await getClientById(clientId);
        console.log('Client data received:', data);
        setFormData({
          name: data.User?.name || '',
          email: data.User?.email || '',
          phone: data.phone || '',
          address: data.address || '',
          goal: data.goal || '',
          plan: data.plan || 'Standard Weekly',
          type: data.type || 'Subscription',
          age: data.age || '',
          height: data.height || '',
          weight: data.weight || '',
          notes: data.notes || '',
        });
      } catch (error) {
        console.error("Failed to fetch client:", error);
        console.error("Error details:", {
          clientId,
          error: error instanceof Error ? error.message : error
        });
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Структурируем данные правильно для API
      const updateData = {
        User: {
          name: formData.name,
          email: formData.email
        },
        phone: formData.phone,
        goal: formData.goal,
        address: formData.address,
        notes: formData.notes,
        plan: formData.plan,
        type: formData.type,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseInt(formData.weight) : undefined,
      };

      console.log('Sending update data:', updateData);
      const updatedClient = await updateClient(clientId, updateData);
      console.log('Client updated successfully:', updatedClient);
      
      onUpdated?.(updatedClient);
      onClose();
      toast.success('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
      console.error('Error details:', {
        clientId,
        formData,
        error: error instanceof Error ? error.message : error
      });
      toast.error('An error occurred while updating the client');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) return <div>Loading...</div>;

  return (
    <Modal isOpen={true} onClose={onClose} size="lg" title="Edit Client">
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
          <label htmlFor="age" className="block text-sm font-medium text-primary mb-2">
            Age
          </label>
          <Input
            id="age"
            name="age"
            type="text"
            value={formData.age}
            onChange={handleChange}
            placeholder="e.g., 25"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-primary mb-2">
            Height
          </label>
          <Input
            id="height"
            name="height"
            type="text"
            value={formData.height}
            onChange={handleChange}
            placeholder="e.g., 180 cm"
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-primary mb-2">
            Weight
          </label>
          <Input
            id="weight"
            name="weight"
            type="text"
            value={formData.weight}
            onChange={handleChange}
            placeholder="e.g., 75 kg"
          />
        </div>
        <div className="flex gap-2 pt-4">
          <Button type="button" variant="danger" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
