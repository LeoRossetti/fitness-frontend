'use client';

import { useState } from 'react';
import { X, Plus, Calendar, Target, Scale, Activity, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TextField } from '@/components/ui/textfield';
import { CreateProgressData, PROGRESS_CATEGORIES, PROGRESS_UNITS } from '@/types/types';
import { createProgress } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface AddProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  onProgressAdded: () => void;
}

const PROGRESS_TYPES = [
  { value: 'weight', label: 'Weight', icon: Scale },
  { value: 'measurements', label: 'Measurements', icon: Target },
  { value: 'strength', label: 'Strength', icon: Activity },
  { value: 'cardio', label: 'Cardio', icon: Heart },
  { value: 'flexibility', label: 'Flexibility', icon: Activity },
  { value: 'body_composition', label: 'Body Composition', icon: User },
];

export default function AddProgressModal({ isOpen, onClose, clientId, onProgressAdded }: AddProgressModalProps) {
  const [formData, setFormData] = useState<Partial<CreateProgressData>>({
    clientId,
    date: new Date().toISOString().split('T')[0],
    type: 'weight',
    category: 'weight',
    value: 0,
    unit: 'kg',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.category || !formData.value || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await createProgress(formData as CreateProgressData);
      toast.success('Progress added successfully');
      onProgressAdded();
      onClose();
      setFormData({
        clientId,
        date: new Date().toISOString().split('T')[0],
        type: 'weight',
        category: 'weight',
        value: 0,
        unit: 'kg',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to add progress:', error);
      toast.error('Failed to add progress');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: string) => {
    const categories = PROGRESS_CATEGORIES[type as keyof typeof PROGRESS_CATEGORIES] || [];
    const unit = PROGRESS_UNITS[type as keyof typeof PROGRESS_UNITS] || '';
    
    setFormData(prev => ({
      ...prev,
      type: type as any,
      category: categories[0] || '',
      unit
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({ ...prev, category }));
  };

  if (!isOpen) return null;

  const selectedType = PROGRESS_TYPES.find(t => t.value === formData.type);
  const categories = formData.type ? PROGRESS_CATEGORIES[formData.type as keyof typeof PROGRESS_CATEGORIES] || [] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Progress</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress Type
            </label>
            <Select
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              required
            >
              {PROGRESS_TYPES.map(type => {
                const IconComponent = type.icon;
                return (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                );
              })}
            </Select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </Select>
          </div>

          {/* Value and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value
              </label>
              <Input
                type="number"
                step="0.1"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <Input
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <TextField
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              className="flex-1 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Progress
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 