'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Session } from '@/types/types';
import { useCalendar } from '@/hooks/useCalendar';
import { useSessions } from '@/hooks/useSessions';
import { createBulkSessions } from '@/lib/api';
import CalendarGrid from './CalendarGrid';
import SessionsList from './SessionsList';
import AddSessionModal from './AddSessionModal';
import SessionDetailsModal from './SessionDetailsModal';

export default function CalendarPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Используем кастомные хуки
  const {
    selectedDate,
    setSelectedDate,
    sessions,
    setSessions,
    currentMonth,
    setCurrentMonth,
    pastSessionDates,
    futureSessionDates,
    sessionsForSelectedDate,
    refreshSessions,
  } = useCalendar();

  const {
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
  } = useSessions(sessions, setSessions);

  // Загружаем данные при открытии модалки
  useEffect(() => {
    if (isAddModalOpen) {
      loadFormData();
    }
  }, [isAddModalOpen, loadFormData]);

  // Обработчик создания сессии
  const handleCreateSession = async (formData: any) => {
    if (!selectedDate) return;
    
    await createNewSession(formData, selectedDate, () => {
      setIsAddModalOpen(false);
      setCurrentMonth(new Date(selectedDate));
    });
  };

  // Обработчик создания повторяющихся сессий
  const handleCreateRecurringSessions = async (formData: any) => {
    try {
      const response = await createBulkSessions({
        clientId: parseInt(formData.clientId),
        dates: formData.dates,
        time: formData.time,
        note: formData.note,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        workoutTemplateId: formData.workoutTemplateId ? parseInt(formData.workoutTemplateId) : undefined,
      });

      console.log('Created recurring sessions:', response);
      
      // Обновляем календарь
      await refreshSessions();
      setIsAddModalOpen(false);
      
      // Показываем уведомление
      alert(`Successfully created ${response.sessionsCreated} sessions!`);
    } catch (error) {
      console.error('Error creating recurring sessions:', error);
      alert(`Error creating sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Обработчик удаления сессии
  const handleDeleteSession = async () => {
    if (!selectedSession) return;
    await deleteSessionById(selectedSession.id);
    setSelectedSession(null);
  };

  // Обработчик обновления статуса сессии
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedSession) return;
    await updateSessionStatusById(selectedSession.id, newStatus);
  };

  // Обработчик обновления заметки сессии
  const handleUpdateNote = async (note: string) => {
    if (!selectedSession) return;
    await updateSessionNote(selectedSession.id, note);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2A44]">Calendar</h1>
            <p className="text-sm text-[#6B7280] mt-1">Manage your training sessions</p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer w-full sm:w-auto"
            variant="success"
          >
            <Plus className="h-5 w-5" />
            Add Session
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Calendar Grid */}
          <CalendarGrid
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            futureSessionDates={futureSessionDates}
            pastSessionDates={pastSessionDates}
          />

          {/* Sessions List */}
          <SessionsList
            selectedDate={selectedDate}
            sessions={sessionsForSelectedDate}
            onAddSession={() => setIsAddModalOpen(true)}
            onSessionClick={setSelectedSession}
          />
        </div>
      </div>

      {/* Add Session Modal */}
      <AddSessionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateSession}
        onSaveRecurring={handleCreateRecurringSessions}
        clients={clients}
        templates={templates}
        isCreating={isCreatingSession}
        selectedDate={selectedDate}
      />

      {/* Session Details Modal */}
      {selectedSession && (
        <SessionDetailsModal
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
          session={selectedSession}
          onUpdate={handleUpdateNote}
          onDelete={handleDeleteSession}
          onStatusChange={handleStatusChange}
          isStatusUpdating={isStatusUpdating === selectedSession.id}
        />
      )}
    </div>
  );
} 