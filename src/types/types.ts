export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // в продакшене должен быть хеширован
  role: "Client" | "Trainer";
}

export interface Client extends Omit<User, "role"> {
  goal?: string;
  phone?: string;
  address?: string;
  notes?: string;
  profile?: string;
  plan?: "Premium Monthly" | "Standard Weekly" | "Single Session";
  type?: "Subscription" | "One-time";
  nextSession?: string;
  age?: number;
  height?: number;
  weight?: number | null;
  targetWeight?: number | null;
  weightDate?: string;
  role: "Client";
  User?: {
    name: string;
    email: string;
  };
}

export interface Trainer extends Omit<User, "role"> {
  role: "Trainer";
}

export type ClientFormData = Omit<Client, "id" | "password">;

// Пример типизации для API
export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  muscleGroup: string;
  createdBy?: number;      // ID пользователя, создавшего упражнение
  createdAt?: string;
  updatedAt?: string;
}

// Типы для создания упражнения (без id и дат)
export type CreateExerciseData = Omit<Exercise, "id" | "createdAt" | "updatedAt">;

// Типы для сессий тренировок
export interface Session {
  id: number;
  clientId: number;        // ID клиента
  time: string;            // Время тренировки (например: "14:00")
  note: string;            // Заметки тренера
  date: string;            // Дата тренировки (формат: "2024-01-15")
  duration?: number;       // Продолжительность сессии в минутах
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'; // Статус сессии
  createdAt?: string;      // Дата создания записи
  updatedAt?: string;      // Дата обновления записи
  client?: Client;
  WorkoutTemplate?: {
    id: number;
    name: string;
    category?: string;
    description?: string;
  };
  // Для поддержки данных с backend:
  Client?: Client;
}

// Типы для создания сессии (без id и дат)
export type CreateSessionData = Omit<Session, "id" | "createdAt" | "updatedAt" | "client">;

// Тип для упражнения в шаблоне тренировки (с параметрами)
export interface WorkoutExercise {
  exerciseId: number;      // ID упражнения
  sets: number;            // Количество подходов
  reps: number;            // Количество повторений
  weight: string;          // Вес
  notes?: string;          // Заметки
}

// Типы для шаблонов тренировок
export interface WorkoutTemplate {
  id: number;
  name: string;                    // Название шаблона
  description?: string;            // Описание шаблона
  exercises: WorkoutExercise[];    // Массив упражнений в шаблоне с параметрами
  difficulty?: string;             // Сложность (например: "Начинающий", "Продвинутый")
  category?: string;               // Категория (например: "Силовая", "Кардио")
  createdAt?: string;              // Дата создания
  updatedAt?: string;              // Дата обновления
  // Для поддержки данных с backend:
  Exercises?: ServerWorkoutExercise[];
}

// Тип для упражнения в шаблоне от сервера (с дополнительными полями)
export interface ServerWorkoutExercise {
  id: number;
  workoutTemplateId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  weight: string;
  notes: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  Exercise: Exercise;  // Связанное упражнение
}

// Тип для шаблона от сервера (с дополнительными полями)
export interface ServerWorkoutTemplate {
  id: number;
  name: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  Exercises: ServerWorkoutExercise[];  // С большой буквы, как возвращает сервер
}

// Типы для создания шаблона (без id и дат)
export type CreateWorkoutTemplateData = Omit<WorkoutTemplate, "id" | "createdAt" | "updatedAt">;

// Progress tracking types
export interface Progress {
  id: number;
  clientId: number;
  date: string;
  type: 'weight' | 'measurements' | 'strength' | 'cardio' | 'flexibility' | 'body_composition';
  category: string;
  value: number;
  unit: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProgressData {
  clientId: number;
  date: string;
  type: 'weight' | 'measurements' | 'strength' | 'cardio' | 'flexibility' | 'body_composition';
  category: string;
  value: number;
  unit: string;
  notes?: string;
}

export interface ProgressStats {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  attendanceRate: number;
  averageWeight?: number;
  weightChange?: number;
  weightGoalProgress?: {
    targetWeight: number;
    progress: number;
    remaining: number;
    isGoalAchieved: boolean;
  };
  strengthProgress?: Record<string, { current: number; previous: number; change: number }>;
  measurements?: Record<string, { current: number; previous: number; change: number }>;
}

// Progress categories for different types
export const PROGRESS_CATEGORIES = {
  weight: ['weight'],
  measurements: ['chest', 'waist', 'hips', 'biceps', 'thighs', 'calves', 'shoulders', 'neck'],
  strength: ['bench_press', 'squat', 'deadlift', 'overhead_press', 'pull_ups', 'push_ups'],
  cardio: ['running_5k', 'running_10k', 'cycling', 'rowing', 'swimming'],
  flexibility: ['sit_and_reach', 'shoulder_flexibility', 'hip_flexibility'],
  body_composition: ['body_fat_percentage', 'muscle_mass', 'bmi']
} as const;

export const PROGRESS_UNITS = {
  weight: 'kg',
  measurements: 'cm',
  strength: 'kg',
  cardio: 'minutes',
  flexibility: 'cm',
  body_composition: '%'
} as const;
