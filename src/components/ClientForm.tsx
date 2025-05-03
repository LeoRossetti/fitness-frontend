"use client";

import { useState, FormEvent } from 'react';
import { validateClientForm } from '../utils/validateClientForm';
import { Client } from '../types/types';

interface ClientFormProps {
  onSubmit: (client: Client) => void;
  initialData?: Client;
  isEditMode?: boolean;
}

export default function ClientForm({ onSubmit, initialData, isEditMode = false }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    goal: initialData?.goal || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    notes: initialData?.notes || '',
    plan: initialData?.plan || 'Premium Monthly' as 'Premium Monthly' | 'Standard Weekly' | 'Single Session',
    nextSession: initialData?.nextSession || '',
    type: initialData?.plan || 'Subscription' as 'Subscription' | 'One-time',
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) {
      console.log('Submit prevented: Already submitting');
      return;
    }
    setIsSubmitting(true);

    const data = {
      name: formData.name,
      email: formData.email,
      goal: formData.goal,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      plan: formData.plan,
      nextSession: formData.nextSession,
    };

    const validationErrors = validateClientForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('email', formData.email);
    if (formData.goal) formDataToSubmit.append('goal', formData.goal);
    if (formData.phone) formDataToSubmit.append('phone', formData.phone);
    if (formData.address) formDataToSubmit.append('address', formData.address);
    if (formData.notes) formDataToSubmit.append('notes', formData.notes);
    formDataToSubmit.append('plan', formData.plan);
    if (formData.nextSession) formDataToSubmit.append('nextSession', formData.nextSession);
    if (file) formDataToSubmit.append('profile', file);

    try {
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/clients/${initialData?.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/clients`;
      const method = isEditMode ? 'PUT' : 'POST';

      console.log(`Sending ${method} request to:`, url);
      console.log('FormData entries:', [...formDataToSubmit.entries()]);
      const response = await fetch(url, {
        method,
        body: formDataToSubmit,
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Response error:', errorData);
        if (errorData.error === 'Email already exists') {
          setErrors({ email: 'This email is already in use' });
        } else {
          setErrors({ form: errorData.error || 'Failed to save client' });
        }
        throw new Error(errorData.error || 'Failed to save client');
      }

      const client = await response.json();
      console.log('Client saved:', client);
      onSubmit(client);
      setErrors({});
      if (!isEditMode) {
        setFormData({
          name: '',
          email: '',
          goal: '',
          phone: '',
          address: '',
          notes: '',
          plan: 'Premium Monthly',
          nextSession: '',
          type: 'Subscription',
        });
        setFile(null);
      }
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      if (err instanceof Error) {
        if (!errors.email) {
          setErrors({ form: err.message });
        }
      } else {
        if (!errors.email) {
          setErrors({ form: 'An unknown error occurred' });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#1F2A44] mb-4">{isEditMode ? 'Edit Client' : 'Add New Client'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
          {errors.name && <p className="text-[#EF4444] text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
          {errors.email && <p className="text-[#EF4444] text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
          <input
            type="text"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="Premium Monthly">Premium Monthly</option>
            <option value="Standard Weekly">Standard Weekly</option>
            <option value="Single Session">Single Session</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="Subscription">Subscription</option>
            <option value="One-time">One-time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Next Session</label>
          <input
            type="text"
            name="nextSession"
            value={formData.nextSession}
            onChange={handleChange}
            placeholder="e.g., Today, 10:00 AM"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#E5E7EB] file:text-[#1F2A44] hover:file:bg-[#D1D5DB]"
          />
        </div>
        {errors.form && <p className="text-[#EF4444] text-sm mt-1">{errors.form}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#3B82F6] text-white px-6 py-2 rounded-lg hover:bg-[#2563EB] transition-colors"
            disabled={isSubmitting}
          >
            {isEditMode ? 'Save Changes' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}