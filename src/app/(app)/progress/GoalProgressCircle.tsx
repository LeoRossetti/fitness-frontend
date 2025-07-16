'use client';

import React from 'react';
import { Target, TrendingDown, TrendingUp } from 'lucide-react';

interface GoalProgressCircleProps {
  percent: number;
  label: string;
  currentValue?: number;
  targetValue?: number;
  change?: number;
  unit?: string;
}

export const GoalProgressCircle: React.FC<GoalProgressCircleProps> = ({ 
  percent, 
  label, 
  currentValue, 
  targetValue, 
  change = 0,
  unit = 'kg'
}) => {
  const radius = 36;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.min(Math.max(percent, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#10b981'; // green
    if (progress >= 60) return '#8b5cf6'; // violet
    if (progress >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const formatNumber = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'N/A';
    const num = Number(value);
    return isNaN(num) ? 'N/A' : num.toFixed(1);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-violet-500" />
          <h3 className="font-semibold text-gray-900">{label} Goal</h3>
        </div>
        {getChangeIcon(change)}
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={getProgressColor(progress)}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference + ' ' + circumference}
            strokeDashoffset={offset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy="0.3em"
            fontSize="1.2em"
            fontWeight="bold"
            fill="#4b5563"
          >
            {Math.round(progress)}%
          </text>
        </svg>
      </div>

      <div className="space-y-2 text-center">
        {currentValue !== undefined && targetValue !== undefined && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{formatNumber(currentValue)}{unit}</span>
            <span className="mx-1">→</span>
            <span className="font-medium text-violet-600">{formatNumber(targetValue)}{unit}</span>
          </div>
        )}
        
        {change !== 0 && (
          <div className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{formatNumber(change)}{unit} change
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          {progress >= 100 ? 'Goal achieved!' : `${Math.round(100 - progress)}% to go`}
        </div>
      </div>
    </div>
  );
}; 