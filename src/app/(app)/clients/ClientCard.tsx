"use client";

import { Client } from '@/types/types';
import { Edit, Trash2, Calendar, Target, Phone, Mail, User, Clock, Crown, Ruler, Scale, UserCheck } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onDelete: () => void;
  onEdit: (clientId: number) => void;
  onAssignTemplate: (clientId: number) => void;
  onClick?: () => void;
}

const formatNextSession = (dateString: string | undefined) => {
  if (!dateString) return 'Not scheduled';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date format';
    }
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });
    
    const formattedDate = formatter.format(date);
    const [datePart, timePart] = formattedDate.split(', ');
    const [month, day, year] = datePart.split('/');
    
    return `${year}-${month}-${day}, ${timePart}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date format';
  }
};

const getPlanColor = (plan: string | undefined) => {
  switch (plan) {
    case 'Premium Monthly':
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    case 'Standard Weekly':
      return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    case 'Single Session':
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

const getPlanIcon = (plan: string | undefined) => {
  switch (plan) {
    case 'Premium Monthly':
      return <Crown className="h-4 w-4" />;
    case 'Standard Weekly':
      return <Calendar className="h-4 w-4" />;
    case 'Single Session':
      return <Clock className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const getInitials = (name: string | undefined) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function ClientCard({ client, onDelete, onEdit, onAssignTemplate, onClick }: ClientCardProps) {
  const nextSession = formatNextSession(client.nextSession);
  const hasNextSession = nextSession !== 'Not scheduled' && nextSession !== 'Invalid date format';

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onClick?.();
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-6 mb-4 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        {/* Main info */}
        <div className="flex items-start gap-4 flex-1">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
            {getInitials(client.User?.name)}
          </div>

          {/* Client info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 truncate">
                {client.User?.name || 'Unknown Client'}
              </h3>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(client.plan)}`}>
                {getPlanIcon(client.plan)}
                {client.plan}
              </span>
            </div>

            {/* Contact info */}
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{client.User?.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{client.phone}</span>
                </div>
              )}
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {client.goal && (
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Goal</p>
                    <p className="text-sm text-gray-700">{client.goal}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Next Session</p>
                  <p className={`text-sm ${hasNextSession ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {nextSession}
                  </p>
                </div>
              </div>

              {client.type && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</p>
                    <p className="text-sm text-gray-700">{client.type}</p>
                  </div>
                </div>
              )}

              {client.age && (
                <div className="flex items-start gap-2">
                  <UserCheck className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Age</p>
                    <p className="text-sm text-gray-700">{client.age} years</p>
                  </div>
                </div>
              )}

              {client.height && (
                <div className="flex items-start gap-2">
                  <Ruler className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Height</p>
                    <p className="text-sm text-gray-700">{client.height} cm</p>
                  </div>
                </div>
              )}

              {client.weight && (
                <div className="flex items-start gap-2">
                  <Scale className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Weight</p>
                    <p className="text-sm text-gray-700">{client.weight} kg</p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {client.notes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-gray-700 line-clamp-2">{client.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(client.id);
            }}
            className="flex items-center gap-1 border border-gray-300 text-[#1F2A44] px-2 py-1 cursor-pointer rounded hover:border-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span className="text-sm">Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="border border-gray-300 text-[#EF4444] p-1 cursor-pointer rounded hover:border-[#EF4444] hover:bg-gray-100 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
