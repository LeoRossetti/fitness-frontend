'use client';

import { useMemo } from 'react';
import { Progress } from '@/types/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressChartProps {
  data: Progress[];
  type: string;
  category: string;
  title: string;
}

export default function ProgressChart({ data, type, category, title }: ProgressChartProps) {
  const filteredData = useMemo(() => {
    return data
      .filter(item => item.type === type && item.category === category)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, type, category]);

  const change = useMemo(() => {
    if (filteredData.length < 2) return null;
    const first = filteredData[0].value;
    const last = filteredData[filteredData.length - 1].value;
    return last - first;
  }, [filteredData]);

  const changePercentage = useMemo(() => {
    if (!change || filteredData.length < 2) return null;
    const first = filteredData[0].value;
    return ((change / first) * 100).toFixed(1);
  }, [change, filteredData]);

  const getChangeIcon = () => {
    if (!change) return <Minus className="h-4 w-4 text-gray-400" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getChangeColor = () => {
    if (!change) return 'text-gray-500';
    if (change > 0) return 'text-green-600';
    return 'text-red-600';
  };

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No data available for this metric</p>
        </div>
      </div>
    );
  }

  const latestValue = filteredData[filteredData.length - 1];
  const unit = latestValue.unit;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          {getChangeIcon()}
          {change !== null && (
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change > 0 ? '+' : ''}{change.toFixed(1)} {unit}
              {changePercentage && ` (${changePercentage}%)`}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Latest Value</span>
          <span className="text-2xl font-bold text-gray-900">
            {latestValue.value} {unit}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Date</span>
          <span className="text-sm font-medium text-gray-900">
            {new Date(latestValue.date).toLocaleDateString()}
          </span>
        </div>

        {latestValue.notes && (
          <div className="pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">Notes</span>
            <p className="text-sm text-gray-700 mt-1">{latestValue.notes}</p>
          </div>
        )}

        {filteredData.length > 1 && (
          <div className="pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">History</span>
            <div className="mt-2 space-y-1">
              {filteredData.slice(-5).reverse().map((record, index) => (
                <div key={record.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                  <span className="font-medium text-gray-900">
                    {record.value} {record.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 