// Утилиты для работы с датами и временем

// Создание ISO даты с таймзоной
export const createISODateWithTimezone = (date: Date, time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  
  // Проверяем валидность времени
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid time format');
  }

  // Устанавливаем время
  const localDate = new Date(date);
  localDate.setHours(hours, minutes, 0, 0);

  // Проверяем, что дата валидна
  if (isNaN(localDate.getTime())) {
    throw new Error('Invalid date');
  }

  // Формируем дату в формате ISO с таймзоной
  const offset = -localDate.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  const tz = `${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
  
  return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00${tz}`;
};

// Валидация формы сессии
export const validateSessionForm = (form: any, selectedDate?: Date): string | null => {
  if (!selectedDate) {
    return 'Please select a date';
  }
  
  if (!form.time) {
    return 'Please select a time';
  }
  
  if (!form.clientId) {
    return 'Please select a client';
  }
  
  if (!form.duration) {
    return 'Please select duration';
  }
  
  return null;
}; 