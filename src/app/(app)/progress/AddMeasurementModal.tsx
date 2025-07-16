'use client';

import React, { useState } from 'react';
import { X, Plus, Scale, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProgressMeasurement } from '@/lib/api';
import toast from 'react-hot-toast';

interface AddMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  clientName: string;
  onMeasurementAdded: () => void;
}

export const AddMeasurementModal: React.FC<AddMeasurementModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName,
  onMeasurementAdded
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем, что хотя бы одно измерение указано
    if (!formData.weight && !formData.chest && !formData.waist && !formData.hips && !formData.biceps) {
      toast.error('Please enter at least one measurement');
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Submitting measurement data:', {
        clientId,
        date: formData.date,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        chest: formData.chest ? parseFloat(formData.chest) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
        biceps: formData.biceps ? parseFloat(formData.biceps) : undefined,
        notes: formData.notes || undefined
      });

      const result = await createProgressMeasurement({
        clientId,
        date: formData.date,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        chest: formData.chest ? parseFloat(formData.chest) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
        biceps: formData.biceps ? parseFloat(formData.biceps) : undefined,
        notes: formData.notes || undefined
      });

      console.log('✅ Measurement created successfully:', result);
      toast.success('Measurement added successfully!');
      onMeasurementAdded();
      onClose();
      
      // Сбрасываем форму
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        chest: '',
        waist: '',
        hips: '',
        biceps: '',
        notes: ''
      });
    } catch (error) {
      console.error('❌ Error adding measurement:', error);
      toast.error(`Failed to add measurement: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="h-5 w-5 text-violet-500" />
            Add Measurement
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Adding measurement for <span className="font-medium text-gray-900">{clientName}</span>
            </p>
          </div>

          {/* Date */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="flex text-sm font-medium text-gray-700 mb-2 items-center gap-2">
              <Scale className="h-4 w-4" />
              Weight (kg)
            </label>
            <Input
              type="number"
              step="0.1"
              min="20"
              max="300"
              placeholder="e.g., 75.5"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Measurements Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chest (cm)
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g., 95"
                value={formData.chest}
                onChange={(e) => handleInputChange('chest', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waist (cm)
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g., 80"
                value={formData.waist}
                onChange={(e) => handleInputChange('waist', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hips (cm)
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g., 100"
                value={formData.hips}
                onChange={(e) => handleInputChange('hips', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biceps (cm)
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g., 35"
                value={formData.biceps}
                onChange={(e) => handleInputChange('biceps', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes about this measurement..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Adding...' : 'Add Measurement'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 