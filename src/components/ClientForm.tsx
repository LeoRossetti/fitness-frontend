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
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [goal, setGoal] = useState(initialData?.goal || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [plan, setPlan] = useState<'Premium Monthly' | 'Standard Weekly' | 'Single Session'>(initialData?.plan || 'Premium Monthly');
  const [nextSession, setNextSession] = useState(initialData?.nextSession || '');
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      name,
      email,
      goal,
      phone,
      address,
      notes,
      plan,
      nextSession,
    };

    const validationErrors = validateClientForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (goal) formData.append('goal', goal);
    if (phone) formData.append('phone', phone);
    if (address) formData.append('address', address);
    if (notes) formData.append('notes', notes);
    formData.append('plan', plan);
    if (nextSession) formData.append('nextSession', nextSession);
    if (file) formData.append('profile', file);

    try {
      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/clients/${initialData?.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/clients`;
      const method = isEditMode ? 'PUT' : 'POST';

      console.log(`Sending ${method} request to:`, url);
      console.log('FormData entries:', [...formData.entries()]);
      const response = await fetch(url, {
        method,
        body: formData,
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
        setName('');
        setEmail('');
        setGoal('');
        setPhone('');
        setAddress('');
        setNotes('');
        setPlan('Premium Monthly');
        setNextSession('');
        setFile(null);
      }
    } catch (err: unknown) { // Используем unknown вместо Error
      console.error('Fetch error:', err);
      // Проверяем, является ли err экземпляром Error
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
          <label className="block text-[#1F2A44] font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
          {errors.name && <p className="text-[#EF4444] mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-[#1F2A44] font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
          {errors.email && <p className="text-[#EF4444] mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-[#1F2A44] font-medium mb-1">Goal</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-[#1F2A44] font-medium mb-1">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-[#1F2A44] font-medium mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <div>
          <label className="block text-[#1F2A44] font-medium mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-[#1F2A44] font-medium mb-1">Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as 'Premium Monthly' | 'Standard Weekly' | 'Single Session')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="Premium Monthly">Premium Monthly</option>
            <option value="Standard Weekly">Standard Weekly</option>
            <option value="Single Session">Single Session</option>
          </select>
        </div>
        <div>
          <label className="block text-[#1F2A44] font-medium mb-1">Next Session</label>
          <input
            type="text"
            value={nextSession}
            onChange={(e) => setNextSession(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            placeholder="e.g., Today, 10:00 AM"
          />
        </div>
        <div>
          <label className="block text-[#1F2A44] font-medium mb-1">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        {errors.form && <p className="text-[#EF4444] mt-1">{errors.form}</p>}
        <button
          type="submit"
          className="bg-[#3B82F6] text-white px-6 py-2 rounded-lg hover:bg-[#2563EB] transition-colors w-full"
          disabled={isSubmitting}
        >
          {isEditMode ? 'Save Changes' : 'Submit'}
        </button>
      </form>
    </div>
  );
}