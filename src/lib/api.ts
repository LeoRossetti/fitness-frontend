const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// Импортируем типы
import { 
  Exercise, 
  CreateExerciseData, 
  Session, 
  CreateSessionData, 
  WorkoutTemplate,
  CreateWorkoutTemplateData,
  ServerWorkoutTemplate
} from '../types/types';

// Универсальная функция для всех API запросов
const makeRequest = async (endpoint: string, options: RequestInit & { params?: Record<string, string | number> } = {}) => {
  // Разделяем параметры URL от настроек fetch
  // Пример: { params: { date: '2024-01-15' }, method: 'POST' } 
  // → params = { date: '2024-01-15' }, fetchOptions = { method: 'POST' }
  const { params, ...fetchOptions } = options;
  
  // Начинаем формировать URL
  // Пример: endpoint = 'sessions' → url = 'http://localhost:1337/api/sessions'
  let url = `${API_URL}/api/${endpoint}`;
  
  // Если есть параметры, добавляем их к URL
  // Пример: params = { date: '2024-01-15' } → url = 'http://localhost:1337/api/sessions?date=2024-01-15'
  if (params) {
    const searchParams = new URLSearchParams();
    // Проходим по всем параметрам и добавляем их
    // Пример: { date: '2024-01-15', month: '2024-01' } → 'date=2024-01-15&month=2024-01'
    Object.entries(params).forEach(([key, value]) => 
      searchParams.append(key, String(value))
    );
    url += `?${searchParams.toString()}`;
  }

  // Делаем запрос к серверу
  // Пример: GET запрос к 'http://localhost:1337/api/sessions?date=2024-01-15'
  const response = await fetch(url, {
    credentials: 'include', // Отправляем куки для авторизации
    headers: { 'Content-Type': 'application/json' }, // Говорим серверу что отправляем JSON
    ...fetchOptions // Добавляем дополнительные настройки (method, body и т.д.)
  });

  // Проверяем успешность запроса
  // Пример: если сервер вернул 404 или 500, выбрасываем ошибку
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  // Возвращаем данные в формате JSON
  // Пример: { id: 1, name: 'John', email: 'john@example.com' }
  return response.json();
};

// ---------------------------------------------------------------------------------------CLIENTS------------------------------------------------------------------------------------------------
// Оптимизированные функции для клиентов (пример)
export const getClients = () => makeRequest('clients');

export const createClient = (data: { name: string; email: string }) => 
  makeRequest('clients', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const deleteClient = (id: number) => 
  makeRequest(`clients/${id}`, { method: 'DELETE' });

export const getClientById = (id: number) => 
  makeRequest(`clients/${id}`);

export const updateClient = (id: number, data: any) => 
  makeRequest(`clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------SESSIONS------------------------------------------------------------------------------------------------
export const getSessionsByDate = (date: string): Promise<Session[]> => 
  makeRequest('sessions', { params: { date } });

export const createSession = (data: CreateSessionData): Promise<Session> => 
  makeRequest('sessions', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const getSessionsByMonth = (year: number, month: number): Promise<Session[]> => 
  makeRequest('sessions', { 
    params: { month: `${year}-${String(month).padStart(2, '0')}` } 
  });

export const deleteSession = (id: number): Promise<void> => 
  makeRequest(`sessions/${id}`, { method: 'DELETE' });

export const updateClientNextSession = (clientId: number, nextSession: string | null) => 
  makeRequest(`clients/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify({ nextSession })
  });
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------EXERCISES------------------------------------------------------------------------------------------------
export const getExercises = (): Promise<{ exercises: Exercise[] }> => makeRequest('exercises');

export const createExercise = (data: CreateExerciseData): Promise<Exercise> => 
  makeRequest('exercises', {
    method: 'POST',
    body: JSON.stringify(data)
  });
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------WORKOUT TEMPLATES------------------------------------------------------------------------------------------------
export const getWorkoutTemplates = (): Promise<{ templates: ServerWorkoutTemplate[] }> => makeRequest('workout-templates');

export const getWorkoutTemplateById = (id: number): Promise<ServerWorkoutTemplate> => 
  makeRequest(`workout-templates/${id}`);

export const createWorkoutTemplate = (data: CreateWorkoutTemplateData): Promise<WorkoutTemplate> => 
  makeRequest('workout-templates', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const updateWorkoutTemplate = (id: number, data: any): Promise<ServerWorkoutTemplate> => 
  makeRequest(`workout-templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const deleteWorkoutTemplate = (id: number): Promise<void> => 
  makeRequest(`workout-templates/${id}`, { method: 'DELETE' });
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
