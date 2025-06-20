// src/components/EditClientModal.tsx
"use client";

import { useEffect, useState } from "react";
import { getClientById, updateClient } from "@/lib/api";
import { Client } from "@/types/types";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
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
    goal: '',
    address: '',
    notes: '',
    plan: 'Premium Monthly' as const,
    type: 'Subscription' as const,
    nextSession: '',
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
          goal: data.goal || '',
          address: data.address || '',
          notes: data.notes || '',
          plan: data.plan || 'Premium Monthly',
          type: data.type || 'Subscription',
          nextSession: data.nextSession || '',
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
      const updatedClient = await updateClient(clientId, formData);
      onUpdated?.(updatedClient);
      onClose();
      toast.success('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('An error occurred while updating the client');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) return <div>Loading...</div>;

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Client">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1"
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <Input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className="mt-1"
            placeholder="123 Main St, City, Country"
          />
        </div>
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
            Fitness Goals
          </label>
          <textarea
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            rows={3}
            placeholder="Enter client's fitness goals..."
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            rows={3}
            placeholder="Additional notes about the client..."
          />
        </div>
        <div>
          <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
            Plan
          </label>
          <select
            id="plan"
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="Premium Monthly">Premium Monthly</option>
            <option value="Standard Weekly">Standard Weekly</option>
            <option value="Single Session">Single Session</option>
          </select>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="Subscription">Subscription</option>
            <option value="One-time">One-time</option>
          </select>
        </div>
        <div>
          <label htmlFor="nextSession" className="block text-sm font-medium text-gray-700">
            Next Session
          </label>
          <Input
            id="nextSession"
            name="nextSession"
            type="text"
            value={formData.nextSession}
            onChange={handleChange}
            className="mt-1"
            placeholder="e.g., Today, 10:00 AM"
          />
        </div>
        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
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
