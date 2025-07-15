'use client';

import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Clock as ClockIcon, BarChart3 } from 'lucide-react';

interface Session {
  id: number;
  date: string;
  time: string;
  status: string;
  note?: string;
  WorkoutTemplate?: {
    name: string;
  };
}

interface SessionsTableProps {
  sessions: Session[];
  isLoading?: boolean;
}

export const SessionsTable: React.FC<SessionsTableProps> = ({ 
  sessions, 
  isLoading = false 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
      case 'no_show':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'scheduled':
        return <ClockIcon className="h-4 w-4 text-blue-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no_show':
        return 'No Show';
      case 'scheduled':
        return 'Scheduled';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'no_show':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Calendar className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-500">No training sessions scheduled for this period.</p>
        </div>
      </div>
    );
  }

  // Группируем сессии по месяцам
  const sessionsByMonth = sessions.reduce((acc, session) => {
    const month = session.date.slice(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  // Сортируем месяцы
  const sortedMonths = Object.keys(sessionsByMonth).sort().reverse();

  return (
    <div className="space-y-6">
      {sortedMonths.map(month => {
        const monthSessions = sessionsByMonth[month];
        const monthName = new Date(month + '-01').toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });

        // Статистика по месяцу
        const stats = monthSessions.reduce((acc, session) => {
          if (session.status === 'completed') acc.completed++;
          else if (session.status === 'cancelled' || session.status === 'no_show') acc.canceled++;
          else if (session.status === 'scheduled') acc.scheduled++;
          return acc;
        }, { completed: 0, canceled: 0, scheduled: 0 });

        return (
          <div key={month} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-500" />
                {monthName}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {stats.completed} completed
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <XCircle className="h-4 w-4" />
                  {stats.canceled} canceled
                </span>
                <span className="flex items-center gap-1 text-blue-600">
                  <ClockIcon className="h-4 w-4" />
                  {stats.scheduled} scheduled
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {monthSessions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(session => (
                  <div 
                    key={session.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(session.status)}
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(session.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {session.time}
                          {session.WorkoutTemplate && (
                            <>
                              <span>•</span>
                              {session.WorkoutTemplate.name}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {getStatusText(session.status)}
                      </span>
                      {session.note && (
                        <div className="text-sm text-gray-500 max-w-xs truncate" title={session.note}>
                          {session.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}; 