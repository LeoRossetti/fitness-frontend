'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { TrendingUp, Target } from 'lucide-react';

interface WeightProgressChartProps {
  data: { date: string; weight?: number; goal?: number; isFromProfile?: boolean }[];
}

export const WeightProgressChart: React.FC<WeightProgressChartProps> = ({ data }) => {
  const hasGoal = data.some(d => d.goal !== undefined);
  const goalValue = data.find(d => d.goal !== undefined)?.goal;
  const hasProfileWeight = data.some(d => d.isFromProfile);
  
  // Форматируем даты для лучшего отображения
  const formattedData = data.map(d => ({
    ...d,
    date: d.isFromProfile 
      ? (d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Profile Weight')
      : new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">
            {dataPoint?.isFromProfile ? 'Initial Weight (from profile)' : label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: <span className="font-semibold">{entry.value} kg</span>
            </p>
          ))}
          {goalValue && (
            <p className="text-sm text-gray-500 mt-1">
              Target: <span className="font-semibold">{goalValue} kg</span>
            </p>
          )}
          {label === 'Profile Weight' && (
            <p className="text-xs text-blue-600 mt-1">
              ⓘ This is the weight from client profile
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-violet-500" />
          Weight Progress
        </h3>
        <div className="flex items-center gap-4">
          {hasProfileWeight && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Profile Weight
            </div>
          )}
          {hasGoal && (
            <div className="flex items-center gap-2 text-sm text-violet-600">
              <Target className="h-4 w-4" />
              Target: {goalValue} kg
            </div>
          )}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            domain={[dataMin => Math.floor(dataMin - 2), dataMax => Math.ceil(dataMax + 2)]} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            unit=" kg"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Целевая линия */}
          {hasGoal && (
            <ReferenceLine 
              y={goalValue} 
              stroke="#a3e635" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{ value: `Target: ${goalValue}kg`, position: 'insideTopRight', fill: '#a3e635' }}
            />
          )}
          
          {/* Линия веса */}
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#8b5cf6" 
            strokeWidth={3} 
            dot={(props: any) => {
              // Безопасный доступ к данным
              const dataPoint = props.payload;
              const isFromProfile = dataPoint?.isFromProfile || false;
              
              return (
                <circle
                  key={`dot-${props.index}-${props.cx}-${props.cy}`}
                  cx={props.cx}
                  cy={props.cy}
                  r={isFromProfile ? 8 : 5}
                  fill={isFromProfile ? '#3b82f6' : '#8b5cf6'}
                  stroke="#ffffff"
                  strokeWidth={isFromProfile ? 3 : 2}
                />
              );
            }}
            activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2 }}
            name="Current Weight"
          />
        </LineChart>
      </ResponsiveContainer>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No weight data available for this period
        </div>
      )}
      
      {hasProfileWeight && data.length === 1 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> The weight from the client profile is shown as the starting point. 
            Add new measurements to track progress over time.
          </p>
        </div>
      )}
    </div>
  );
}; 