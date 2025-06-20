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
  type: "Subscription" | "One-time";
  nextSession?: string;
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
  type: string;            // Тип тренировки (например: "Силовая", "Кардио")
  time: string;            // Время тренировки (например: "14:00")
  note: string;            // Заметки тренера
  date: string;            // Дата тренировки (формат: "2024-01-15")
  createdAt?: string;      // Дата создания записи
  updatedAt?: string;      // Дата обновления записи
  // Связь с клиентом (может быть загружена с сервера)
  client?: Client;
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
