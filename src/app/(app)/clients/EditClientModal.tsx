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
    plan: 'Standard Weekly' as 'Premium Monthly' | 'Standard Weekly' | 'Single Session',
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
          plan: data.plan || 'Standard Weekly',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        plan: formData.plan,
      };
      const updatedClient = await updateClient(clientId, updateData);
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
            Name <span className="text-red-500">*</span>
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
            Email <span className="text-red-500">*</span>
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
