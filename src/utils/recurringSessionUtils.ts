/**
 * Генерирует даты для повторяющихся сессий
 */

export interface RecurringOptions {
  frequency: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number; // 1-7 (понедельник-воскресенье)
  dayOfMonth?: number; // 1-31
  startDate: Date;
  endDate?: Date;
  maxSessions?: number; // Максимальное количество сессий
}

/**
 * Генерирует даты для еженедельных сессий
 */
function generateWeeklyDates(options: RecurringOptions & { dayOfWeek: number }): Date[] {
  const { dayOfWeek, startDate, endDate, maxSessions = 52 } = options;
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  // Устанавливаем время на 9:00 утра
  currentDate.setHours(9, 0, 0, 0);
  
  // Находим первый день недели, который соответствует dayOfWeek
  while (currentDate.getDay() !== (dayOfWeek === 7 ? 0 : dayOfWeek)) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Если первая дата раньше startDate, пропускаем
  if (currentDate < startDate) {
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  // Генерируем даты
  while (dates.length < maxSessions && (!endDate || currentDate <= endDate)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return dates;
}

/**
 * Генерирует даты для сессий раз в две недели
 */
function generateBiweeklyDates(options: RecurringOptions & { dayOfWeek: number }): Date[] {
  const { dayOfWeek, startDate, endDate, maxSessions = 26 } = options;
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  // Устанавливаем время на 9:00 утра
  currentDate.setHours(9, 0, 0, 0);
  
  // Находим первый день недели, который соответствует dayOfWeek
  while (currentDate.getDay() !== (dayOfWeek === 7 ? 0 : dayOfWeek)) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Если первая дата раньше startDate, пропускаем
  if (currentDate < startDate) {
    currentDate.setDate(currentDate.getDate() + 14);
  }
  
  // Генерируем даты
  while (dates.length < maxSessions && (!endDate || currentDate <= endDate)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 14);
  }
  
  return dates;
}

/**
 * Генерирует даты для ежемесячных сессий
 */
function generateMonthlyDates(options: RecurringOptions & { dayOfMonth: number }): Date[] {
  const { dayOfMonth, startDate, endDate, maxSessions = 12 } = options;
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  // Устанавливаем время на 9:00 утра
  currentDate.setHours(9, 0, 0, 0);
  
  // Устанавливаем день месяца
  currentDate.setDate(dayOfMonth);
  
  // Если первая дата раньше startDate, переходим к следующему месяцу
  if (currentDate < startDate) {
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(dayOfMonth);
  }
  
  // Генерируем даты
  while (dates.length < maxSessions && (!endDate || currentDate <= endDate)) {
    dates.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(dayOfMonth);
  }
  
  return dates;
}

/**
 * Основная функция для генерации дат повторяющихся сессий
 */
export function generateRecurringDates(options: RecurringOptions): Date[] {
  switch (options.frequency) {
    case 'weekly':
      if (!options.dayOfWeek) {
        throw new Error('dayOfWeek is required for weekly frequency');
      }
      return generateWeeklyDates({ ...options, dayOfWeek: options.dayOfWeek });
    
    case 'biweekly':
      if (!options.dayOfWeek) {
        throw new Error('dayOfWeek is required for biweekly frequency');
      }
      return generateBiweeklyDates({ ...options, dayOfWeek: options.dayOfWeek });
    
    case 'monthly':
      if (!options.dayOfMonth) {
        throw new Error('dayOfMonth is required for monthly frequency');
      }
      return generateMonthlyDates({ ...options, dayOfMonth: options.dayOfMonth });
    
    default:
      throw new Error(`Unsupported frequency: ${options.frequency}`);
  }
}

/**
 * Преобразует даты в формат ISO string для API
 */
export function formatDatesForAPI(dates: Date[]): string[] {
  return dates.map(date => date.toISOString().split('T')[0]);
}

/**
 * Получает название дня недели
 */
export function getDayOfWeekName(dayOfWeek: number): string {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[dayOfWeek - 1];
}

/**
 * Получает название частоты
 */
export function getFrequencyName(frequency: string): string {
  switch (frequency) {
    case 'weekly':
      return 'Weekly';
    case 'biweekly':
      return 'Bi-weekly';
    case 'monthly':
      return 'Monthly';
    default:
      return frequency;
  }
}

/**
 * Валидирует опции для повторяющихся сессий
 */
export function validateRecurringOptions(options: RecurringOptions): string[] {
  const errors: string[] = [];
  
  if (!options.startDate) {
    errors.push('Start date is required');
  }
  
  if (options.endDate && options.startDate && options.endDate <= options.startDate) {
    errors.push('End date must be after start date');
  }
  
  if (options.frequency === 'weekly' || options.frequency === 'biweekly') {
    if (!options.dayOfWeek || options.dayOfWeek < 1 || options.dayOfWeek > 7) {
      errors.push('Day of week must be between 1 and 7');
    }
  }
  
  if (options.frequency === 'monthly') {
    if (!options.dayOfMonth || options.dayOfMonth < 1 || options.dayOfMonth > 31) {
      errors.push('Day of month must be between 1 and 31');
    }
  }
  
  return errors;
} 