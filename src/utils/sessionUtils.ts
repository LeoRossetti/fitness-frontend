// Вспомогательные функции для работы с сессиями
export const getTimeFromDateString = (dateStr: string) => {
  const match = dateStr.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : '';
};

export const getClientName = (session: any) => {
  return session.Client?.User?.name || session.client?.User?.name || '—';
};

export const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  if (minutes === 60) return '1 hour';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours}h ${remainingMinutes}m`;
};

export const getSessionTypeColor = (type: string) => {
  switch (type) {
    case 'personal': return 'bg-blue-100 text-blue-800';
    case 'group': return 'bg-purple-100 text-purple-800';
    case 'consultation': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Status color map
export const statusColorMap: Record<string, string> = {
  scheduled: 'bg-gray-300',
  completed: 'bg-green-400',
  cancelled: 'bg-red-400',
  no_show: 'bg-yellow-400',
};

export const statusLabelMap: Record<string, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No show',
};

// Helper function for status badge classes
export const getStatusBadgeClasses = (status?: string) => {
  const map: Record<string, string> = {
    scheduled: 'bg-gray-200 text-gray-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-yellow-100 text-yellow-800',
  };
  return map[status || 'scheduled'] || 'bg-gray-200 text-gray-700';
}; 