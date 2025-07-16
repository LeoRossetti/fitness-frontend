'use client';

import React, { useState } from 'react';
import { Calendar, Scale, Trash2, Edit, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { deleteProgressMeasurement } from '@/lib/api';
import toast from 'react-hot-toast';

interface Measurement {
  id: number;
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  notes?: string;
  createdAt: string;
}

interface MeasurementsTableProps {
  measurements: any[];
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export const MeasurementsTable: React.FC<MeasurementsTableProps> = ({ 
  measurements, 
  onDelete, 
  isLoading = false 
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  // Безопасное форматирование чисел
  const formatNumber = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const num = Number(value);
    return isNaN(num) ? 'N/A' : num.toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <BarChart3 className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No measurements yet</h3>
          <p className="text-gray-500">Start tracking your client's progress by adding their first measurement.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-violet-500" />
          Measurement History
        </h3>
        <span className="text-sm text-gray-500">
          {measurements.length} measurement{measurements.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Weight (kg)</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Chest (cm)</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Waist (cm)</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Hips (cm)</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Notes</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Source</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((measurement) => (
              <tr 
                key={measurement.id || `profile-${measurement.date}`} 
                className={`border-b border-gray-100 hover:bg-gray-50 ${
                  measurement.isFromProfile ? 'bg-blue-50' : ''
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {measurement.isFromProfile ? (
                      <>
                        <span className="text-blue-600 font-medium">
                          {measurement.date ? 
                            new Date(measurement.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 
                            'Profile Weight'
                          }
                        </span>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </>
                    ) : (
                      new Date(measurement.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`font-medium ${
                    measurement.isFromProfile ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {formatNumber(measurement.weight)}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {formatNumber(measurement.chest)}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {formatNumber(measurement.waist)}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {formatNumber(measurement.hips)}
                </td>
                <td className="py-3 px-4 text-gray-600 max-w-xs">
                  <div className="truncate" title={measurement.notes}>
                    {measurement.notes || '-'}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {measurement.isFromProfile ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Profile
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Manual
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  {!measurement.isFromProfile && (
                    <button
                      onClick={() => handleDelete(measurement.id)}
                      disabled={deletingId === measurement.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete measurement"
                    >
                      {deletingId === measurement.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  {measurement.isFromProfile && (
                    <span className="text-xs text-gray-400">Cannot delete</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {measurements.some(m => m.isFromProfile) && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Profile Weight:</strong> This measurement is taken from the client's profile and serves as the starting point for progress tracking. 
            It cannot be deleted but will be replaced once you add manual measurements.
          </p>
        </div>
      )}
    </div>
  );
}; 