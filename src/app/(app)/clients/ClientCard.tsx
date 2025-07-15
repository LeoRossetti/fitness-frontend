"use client";

import { Client } from '@/types/types';
import { Edit, Trash2, Calendar, Target, Phone, Mail, User, Clock, Crown, Ruler, Scale, UserCheck, TrendingUp } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onDelete: (clientId: number, clientName: string) => void;
  onEdit: (clientId: number) => void;
  onProgress?: (clientId: number) => void;
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



export default function ClientCard({ client, onDelete, onEdit, onProgress, onClick }: ClientCardProps) {
  const nextSession = formatNextSession(client.nextSession);
  const hasNextSession = nextSession !== 'Not scheduled' && nextSession !== 'Invalid date format';

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onClick?.();
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-4 mb-3 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        {/* Main info */}
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base shadow-lg flex-shrink-0">
            {getInitials(client.User?.name)}
          </div>

          {/* Client info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                {client.User?.name || 'Unknown Client'}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(client.plan)}`}>
                {getPlanIcon(client.plan)}
                <span className="hidden sm:inline">{client.plan}</span>
                <span className="sm:hidden">
                  {client.plan === 'Premium Monthly' ? 'Premium' : client.plan === 'Standard Weekly' ? 'Standard' : 'Single'}
                </span>
              </span>
            </div>

            {/* Contact info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{client.User?.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="hidden sm:inline">{client.phone}</span>
                  <span className="sm:hidden">{client.phone.replace(/\d(?=\d{4})/g, '*')}</span>
                </div>
              )}
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
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
              <div className="mt-2 p-2 bg-gray-50 rounded-lg">
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
            <span className="hidden sm:inline text-sm">Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(client.id, client.User?.name || 'Unknown Client');
            }}
            className="border border-gray-300 text-[#EF4444] p-1 cursor-pointer rounded hover:border-[#EF4444] hover:bg-gray-100 transition-colors"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
