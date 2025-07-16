import { useState, useEffect } from 'react';
import { getClients, getWorkoutTemplates, createSession, deleteSession, updateSession, updateSessionStatus, updateClientNextSession } from '@/lib/api';
import { Session, ServerWorkoutTemplate } from '@/types/types';
import { toast } from 'react-hot-toast';

export const useSessions = (sessions: Session[], setSessions: React.Dispatch<React.SetStateAction<Session[]>>) => {
  const [clients, setClients] = useState<{ id: number; User?: { name: string; email: string } }[]>([]);
  const [templates, setTemplates] = useState<ServerWorkoutTemplate[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isDeletingSession, setIsDeletingSession] = useState<number | null>(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState<number | null>(null);

  // Загружаем клиентов и шаблоны
  const loadFormData = async () => {
    try {
      const [clientsData, templatesData] = await Promise.all([
        getClients(),
        getWorkoutTemplates()
      ]);
      setClients(clientsData);
      setTemplates(templatesData.templates);
    } catch (err) {
      console.error('Failed to load form data:', err);
      toast.error('Failed to load clients and templates');
    }
  };

  // Создание сессии
  const createNewSession = async (sessionData: any, selectedDate: Date, onSuccess?: () => void) => {
    setIsCreatingSession(true);
    try {
      // Создаем дату в локальной временной зоне
      const localDate = new Date(selectedDate);
      const [hours, minutes] = sessionData.time.split(':').map(Number);
      
      // Проверяем валидность времени
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        toast.error('Invalid time format');
        return;
      }

      // Устанавливаем время в локальной временной зоне
      localDate.setHours(hours, minutes, 0, 0);

      // Проверяем, что дата валидна
      if (isNaN(localDate.getTime())) {
        toast.error('Invalid date');
        return;
      }

      // Формируем дату в формате ISO с таймзоной пользователя
      const offset = -localDate.getTimezoneOffset();
      const sign = offset >= 0 ? '+' : '-';
      const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
      const tz = `${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
      const date = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00${tz}`;

      const finalSessionData = {
        ...sessionData,
        date,
      };

      console.log('Creating session with data:', finalSessionData);

      // Оптимистичное обновление - добавляем сессию сразу
      const optimisticSession: Session = {
        id: Date.now(), // Временный ID
        clientId: Number(sessionData.clientId),
        time: sessionData.time,
        note: sessionData.note,
        duration: Number(sessionData.duration),
        date,
        status: 'scheduled',
        Client: clients.find(c => c.id === Number(sessionData.clientId)) as any,
        WorkoutTemplate: templates.find(t => t.id === Number(sessionData.workoutTemplateId)),
      };

      setSessions(prev => [...prev, optimisticSession]);

      await createSession(finalSessionData);

      toast.success('Session created successfully');
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create session:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      toast.error(errorMessage);
    } finally {
      setIsCreatingSession(false);
    }
  };

  // Удаление сессии
  const deleteSessionById = async (sessionId: number) => {
    setIsDeletingSession(sessionId);
    try {
      console.log('Starting session deletion process for ID:', sessionId);
      
      // Находим сессию в локальном состоянии для получения clientId
      const sessionToDelete = sessions.find((s: Session) => s.id === sessionId);
      if (!sessionToDelete) {
        console.error('Session not found in local state:', sessionId);
        toast.error('Session not found');
        return;
      }

      await deleteSession(sessionId);
      await updateClientNextSession(sessionToDelete.clientId, null);
      
      toast.success('Session has been canceled');
      setSessions(sessions => sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error('Error in handleDeleteSession:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel session';
      toast.error(errorMessage);
    } finally {
      setIsDeletingSession(null);
    }
  };

  // Обновление статуса сессии
  const updateSessionStatusById = async (sessionId: number, newStatus: string) => {
    setIsStatusUpdating(sessionId);
    try {
      await updateSessionStatus(sessionId, newStatus);
      setSessions(sessions =>
        sessions.map(s =>
          s.id === sessionId ? { ...s, status: newStatus as Session['status'] } : s
        )
      );
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setIsStatusUpdating(null);
    }
  };

  // Обновление заметки сессии
  const updateSessionNote = async (sessionId: number, note: string) => {
    try {
      await updateSession(sessionId, { note });
      setSessions((prev) => prev.map(s => s.id === sessionId ? { ...s, note } : s));
      toast.success('Note updated');
    } catch (e) {
      toast.error('Failed to update note');
    }
  };

  return {
    clients,
    templates,
    isCreatingSession,
    isDeletingSession,
    isStatusUpdating,
    loadFormData,
    createNewSession,
    deleteSessionById,
    updateSessionStatusById,
    updateSessionNote,
  };
}; 