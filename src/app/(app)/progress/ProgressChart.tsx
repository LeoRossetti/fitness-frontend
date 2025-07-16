'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface ProgressChartPoint {
  date: string;
  weight?: number;
}

interface ProgressChartProps {
  data: ProgressChartPoint[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
        <div className="text-center py-12 text-gray-500">
          <p>No data to display</p>
          <p className="text-sm">Add the first weight measurement</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            domain={[dataMin => Math.floor(dataMin - 2), dataMax => Math.ceil(dataMax + 2)]} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#d1d5db' }}
            unit=" kg"
          />
          <Tooltip 
            formatter={(value: any) => [`${value} kg`, 'Weight']} 
            labelFormatter={label => `Date: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#6366f1" 
            strokeWidth={3} 
            dot={{ r: 6, fill: '#6366f1', stroke: 'white', strokeWidth: 2 }} 
            activeDot={{ r: 8, fill: '#6366f1', stroke: 'white', strokeWidth: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 