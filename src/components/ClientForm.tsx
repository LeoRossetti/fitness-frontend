"use client";

import { useState, FormEvent } from 'react';
import { validateClientForm } from '../utils/validateClientForm';
import { Client } from '../types/types';
import { toast } from 'react-hot-toast';

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
        toast.error(errorData.error || 'Failed to save client');
        throw new Error(errorData.error);
      }

      const client = await response.json();
      onSubmit(client);
      toast.success(isEditMode ? 'Client updated!' : 'Client created!');
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
    <div className="max-w-md w-full mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{isEditMode ? 'Edit Client' : 'Add New Client'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'name', label: 'Name' },
          { name: 'email', label: 'Email', type: 'email' },
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
                placeholder={placeholder}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            ) : (
              <input
                type={type || 'text'}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            )}
            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {errors.form && <p className="text-red-500 text-sm mt-1">{errors.form}</p>}

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            disabled={isSubmitting}
          >
            {isEditMode ? 'Save Changes' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}