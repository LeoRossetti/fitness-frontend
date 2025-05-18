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
    plan: initialData?.plan || 'Premium Monthly',
    type: initialData?.type || 'Subscription',
    nextSession: initialData?.nextSession || '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (isSubmitting) return;
    setIsSubmitting(true);

    const validationErrors = validateClientForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSubmit.append(key, value);
    });
    if (file) formDataToSubmit.append('profile', file);

    try {
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/clients/${initialData?.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/clients`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSubmit,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Email already exists') {
          setErrors({ email: 'This email is already in use' });
        } else {
          setErrors({ form: errorData.error || 'Failed to save client' });
        }
        throw new Error(errorData.error);
      }

      const client = await response.json();
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
          type: 'Subscription',
          nextSession: '',
        });
        setFile(null);
      }
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      if (!errors.email) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setErrors({ form: errorMessage });
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
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#3B82F6]"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#3B82F6]"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {[
          { name: 'goal', label: 'Goal' },
          { name: 'phone', label: 'Phone' },
          { name: 'address', label: 'Address' },
          { name: 'notes', label: 'Notes', type: 'textarea' },
          { name: 'nextSession', label: 'Next Session', placeholder: 'e.g., Today, 10:00 AM' },
        ].map(({ name, label, type, placeholder }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {type === 'textarea' ? (
              <textarea
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#3B82F6]"
                rows={3}
              />
            ) : (
              <input
                type="text"
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#3B82F6]"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#3B82F6]"
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
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="Subscription">Subscription</option>
            <option value="One-time">One-time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-lg p-2 file:bg-gray-100 file:border file:rounded file:px-4"
          />
        </div>

        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isEditMode ? 'Save Changes' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
