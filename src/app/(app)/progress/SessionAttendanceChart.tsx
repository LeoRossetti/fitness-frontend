'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SessionAttendanceChartProps {
  data: { month: string; completed: number; canceled: number }[];
}

export const SessionAttendanceChart: React.FC<SessionAttendanceChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow w-full">
      <h3 className="text-base font-semibold mb-2">Session Attendance</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#8b5cf6" name="completed" />
          <Bar dataKey="canceled" fill="#f87171" name="canceled" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}; 