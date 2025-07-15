'use client';

import React, { useState } from 'react';

interface ProgressFormProps {
  onSubmit: (data: ProgressFormData) => void;
  loading?: boolean;
}

export interface ProgressFormData {
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  notes?: string;
}

const initialState: ProgressFormData = {
  date: new Date().toISOString().slice(0, 10),
  weight: undefined,
  chest: undefined,
  waist: undefined,
  hips: undefined,
  biceps: undefined,
  notes: '',
};

export const ProgressForm: React.FC<ProgressFormProps> = ({ onSubmit, loading }) => {
  const [form, setForm] = useState<ProgressFormData>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value === '' ? undefined : name === 'notes' ? value : Number(value)
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, date: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 flex flex-col gap-4 max-w-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Measurement</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
        <input 
          type="date" 
          name="date" 
          value={form.date} 
          onChange={handleDateChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" 
          required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
        <input 
          type="number" 
          name="weight" 
          value={form.weight ?? ''} 
          onChange={handleChange} 
          min={20} 
          max={300} 
          step={0.1} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" 
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Chest (cm)</label>
          <input 
            type="number" 
            name="chest" 
            value={form.chest ?? ''} 
            onChange={handleChange} 
            min={50} 
            max={200} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Waist (cm)</label>
          <input 
            type="number" 
            name="waist" 
            value={form.waist ?? ''} 
            onChange={handleChange} 
            min={40} 
            max={200} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Hips (cm)</label>
          <input 
            type="number" 
            name="hips" 
            value={form.hips ?? ''} 
            onChange={handleChange} 
            min={50} 
            max={200} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Biceps (cm)</label>
          <input 
            type="number" 
            name="biceps" 
            value={form.biceps ?? ''} 
            onChange={handleChange} 
            min={15} 
            max={100} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <textarea 
          name="notes" 
          value={form.notes} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent" 
          rows={3} 
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}; 