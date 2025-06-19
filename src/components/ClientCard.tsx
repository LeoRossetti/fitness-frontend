"use client";

import { Client } from '@/types/types';
import { Edit, Trash2 } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onDelete: () => void;
  onEdit: (clientId: number) => void;
}

const formatNextSession = (dateString: string | undefined) => {
  if (!dateString) return 'Not scheduled';
  
  console.log('Raw date string:', dateString);
  
  try {
    // Создаем объект даты
    const date = new Date(dateString);
    console.log('Parsed date:', date);
    
    // Проверяем валидность даты
    if (isNaN(date.getTime())) {
      console.log('Invalid date:', dateString);
      return 'Invalid date format';
    }
    
    // Используем Intl.DateTimeFormat для форматирования даты и времени
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC' // Используем UTC для предотвращения проблем с часовыми поясами
    });
    
    // Форматируем дату и время
    const formattedDate = formatter.format(date);
    console.log('Formatted date:', formattedDate);
    
    // Преобразуем формат из MM/DD/YYYY, HH:mm в YYYY-MM-DD, HH:mm
    const [datePart, timePart] = formattedDate.split(', ');
    const [month, day, year] = datePart.split('/');
    
    return `${year}-${month}-${day}, ${timePart}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date format';
  }
};

export default function ClientCard({ client, onDelete, onEdit }: ClientCardProps) {
  const tag = client.plan === 'Single Session' ? 'Single Session' : 'Subscription';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-4 sm:gap-2">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-[#1F2A44]">{client.User?.name}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                tag === 'Subscription' ? 'bg-[#A78BFA] text-white' : 'bg-[#D1D5DB] text-[#1F2A44]'
              }`}
            >
              {tag}
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mb-1">{client.User?.email}</p>
          <div className="flex flex-wrap gap-3 text-[#6B7280]">
            <div>
              <span className="text-xs font-medium">PLAN</span>
              <p className="text-xs">{client.plan}</p>
            </div>
            <div>
              <span className="text-xs font-medium">GOAL</span>
              <p className="text-xs">{client.goal}</p>
            </div>
            <div>
              <span className="text-xs font-medium">NEXT SESSION</span>
              <p className="text-xs">{formatNextSession(client.nextSession)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={() => onEdit(client.id)}
          className="flex items-center gap-1 border border-gray-300 text-[#1F2A44] px-2 py-1 cursor-pointer rounded hover:border-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Edit className="h-4 w-4" />
          <span className="text-sm">Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="border border-gray-300 text-[#EF4444] p-1 cursor-pointer rounded hover:border-[#EF4444] hover:bg-gray-100 transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
