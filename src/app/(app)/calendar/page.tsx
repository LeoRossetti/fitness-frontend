'use client';

import { useState, useEffect, Suspense } from 'react';
import { DayPicker } from 'react-day-picker';
import { Plus, Clock, Calendar as CalendarIcon, } from 'lucide-react';
import { getClients, createSession, getSessionsByMonth, deleteSession, updateClientNextSession, updateSessionStatus, getWorkoutTemplates, updateSession } from '@/lib/api';
import 'react-day-picker/dist/style.css';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TextField } from '@/components/ui/textfield';
import { isSameDay } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Session, ServerWorkoutTemplate } from '@/types/types';
import { Avatar } from '@/components/ui/Avatar';
import SessionDetailsModal from './SessionDetailsModal';

// Helper function for status color
const getStatusBadge = (status?: string) => {
  const map: Record<string, string> = {
    scheduled: 'bg-gray-200 text-gray-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-yellow-100 text-yellow-800',
  };
  if (!status) return null;
  return (
    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${map[status] || 'bg-gray-200 text-gray-700'}`}>
      {status === 'no_show' ? 'No Show' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Status color map
const statusColorMap: Record<string, string> = {
  scheduled: 'bg-gray-300',
  completed: 'bg-green-400',
  cancelled: 'bg-red-400',
  no_show: 'bg-yellow-400',
};
const statusLabelMap: Record<string, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No show',
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clients, setClients] = useState<{ id: number; User: { name: string } }[]>([]);
  const [templates, setTemplates] = useState<ServerWorkoutTemplate[]>([]);
  const [form, setForm] = useState({
    clientId: '',
    workoutTemplateId: '',
    time: '',
    note: '',
    duration: '60',
  });
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isStatusUpdating, setIsStatusUpdating] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editForm, setEditForm] = useState<{ note: string }>({ note: '' });

  // Получаем сессии за месяц при первом рендере и смене месяца
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    getSessionsByMonth(year, month)
      .then(setSessions)
      .catch(console.error);
  }, [currentMonth]);

  // Для выделения дат сессий
  const sessionDates = sessions.map(session => new Date(session.date));

  // Для отображения сессий за выбранную дату
  const sessionsForSelectedDate = selectedDate
    ? sessions.filter(session => isSameDay(new Date(session.date), selectedDate))
    : [];

  // Загружаем клиентов при открытии модалки
  useEffect(() => {
    if (isAddModalOpen) {
      getClients()
        .then(setClients)
        .catch((err) => {
          console.error('Failed to fetch clients:', err);
          toast.error('Failed to load clients');
        });
      getWorkoutTemplates()
        .then(res => setTemplates(res.templates))
        .catch((err) => {
          console.error('Failed to fetch templates:', err);
          toast.error('Failed to load templates');
        });
    }
  }, [isAddModalOpen]);

  // Обработчик изменения полей формы
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { name: string, value: string }
  ) => {
    if ('target' in e) {
      setForm((prev) => ({ ...prev, [e.target.name]: (e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value }));
    } else {
      setForm((prev) => ({ ...prev, [e.name]: e.value }));
    }
  };

  // Вспомогательная функция для извлечения времени из строки даты
  const getTimeFromDateString = (dateStr: string) => {
    const match = dateStr.match(/T(\d{2}:\d{2})/);
    return match ? match[1] : '';
  };

  // Вспомогательная функция для получения имени клиента
  const getClientName = (session: any) => {
    return session.Client?.User?.name || session.client?.User?.name || '—';
  };

  // Вспомогательная функция для форматирования длительности
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    if (minutes === 60) return '1 hour';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours}h ${remainingMinutes}m`;
  };

  // Генерируем опции времени с шагом 15 минут с 07:00 до 22:00
  const timeOptions = [
    { value: '', label: 'Choose time', disabled: true },
    ...Array.from({ length: ((22 - 7) * 4) + 1 }, (_, i) => {
      const hour = 7 + Math.floor(i / 4);
      const minute = (i % 4) * 15;
      const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      return { value, label: value, disabled: false };
    })
  ];

  // Опции для длительности сессии
  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '75', label: '1 hour 15 minutes' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
  ];

  // Обработчик сохранения
  const handleSave = async () => {
    if (!selectedDate || !form.time || !form.workoutTemplateId) {
      toast.error('Please select a date, time and workout template');
      return;
    }

    try {
      // Создаем дату в локальной временной зоне
      const localDate = new Date(selectedDate);
      const [hours, minutes] = form.time.split(':').map(Number);
      
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

      // Формируем дату в формате ISO с таймзоной пользователя (например, 2025-06-02T07:00:00+03:00)
      const offset = -localDate.getTimezoneOffset();
      const sign = offset >= 0 ? '+' : '-';
      const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
      const tz = `${sign}${pad(offset / 60)}:${pad(offset % 60)}`;
      const date = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00${tz}`;

      const sessionData = {
        clientId: Number(form.clientId),
        workoutTemplateId: Number(form.workoutTemplateId),
        time: form.time,
        note: form.note,
        duration: Number(form.duration),
        date,
      };

      console.log('Creating session with data:', sessionData);

      await createSession(sessionData);

      // Показываем уведомление об успехе
      toast.success('Session created successfully', {
        duration: 3000,
        position: 'top-right',
      });

      // Закрываем модальное окно и обновляем состояние
      setIsAddModalOpen(false);
      setCurrentMonth(new Date(selectedDate));
      setForm({
        clientId: '',
        workoutTemplateId: '',
        time: '',
        note: '',
        duration: '60',
      });
    } catch (err) {
      console.error('Failed to create session:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-right',
      });
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    try {
      console.log('Starting session deletion process for ID:', sessionId);
      
      const session = sessions.find(s => s.id === sessionId);
      if (!session) {
        console.error('Session not found in local state:', sessionId);
        toast.error('Session not found');
        return;
      }

      const clientId = session.clientId;
      if (!clientId) {
        console.error('Client ID not found in session:', session);
        toast.error('Client information not found');
        return;
      }

      console.log('Deleting session and updating client:', { sessionId, clientId });
      
      await deleteSession(sessionId);
      await updateClientNextSession(clientId, null);
      
      toast.success('Session has been canceled');
      setSessions(sessions => sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error('Error in handleDeleteSession:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel session';
      toast.error(errorMessage);
    }
  };

  const handleStatusChange = async (sessionId: number, newStatus: string) => {
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

  // Открыть модалку редактирования
  const handleEditClick = () => {
    if (selectedSession) {
      setEditForm({ note: selectedSession.note || '' });
      setIsEditingNote(true);
    }
  };

  // Сохранить изменения
  const handleEditSave = async () => {
    if (!selectedSession) return;
    try {
      await updateSession(selectedSession.id, { note: editForm.note });
      setSessions((prev) => prev.map(s => s.id === selectedSession.id ? { ...s, note: editForm.note } : s));
      setSelectedSession((prev) => prev ? { ...prev, note: editForm.note } : prev);
      setIsEditingNote(false);
      toast.success('Note updated');
    } catch (e) {
      toast.error('Failed to update note');
    }
  };

  // Отмена редактирования
  const handleEditCancel = () => {
    setIsEditingNote(false);
    setEditForm({ note: selectedSession?.note || '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2A44]">Calendar</h1>
            <p className="text-sm text-[#6B7280] mt-1">Manage your training sessions</p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer"
            variant="success"
          >
            <Plus className="h-5 w-5" />
            Add Session
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={{ hasSession: sessionDates }}
              modifiersClassNames={{
                selected: "bg-[#8B5CF6] text-white font-bold rounded-lg",
                hasSession: "border-b-4 border-[#8B5CF6] font-bold",
                today: "border border-[#8B5CF6]",
              }}
              disabled={{ before: new Date() }}
            />
          </div>

          {/* Sessions List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="h-5 w-5 text-[#1F2A44]" />
              <h2 className="text-xl font-semibold text-[#1F2A44]">
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
            </div>

            {sessionsForSelectedDate.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#6B7280]">No sessions scheduled for this date</p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 cursor-pointer"
                  variant="default"
                >
                  Schedule a session
                </Button>
              </div>
            ) : (
              <div className="space-y-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {sessionsForSelectedDate.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg shadow-sm p-4 mb-3 group cursor-pointer"
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={getClientName(session as any)}
                        photoUrl={(session as any).Client?.profile || (session as any).client?.profile}
                        size="w-10 h-10"
                      />
                      <div>
                        <div className="font-semibold text-[#1F2A44] flex items-center gap-2">
                          {getClientName(session as any)}
                          <span
                            className={`w-2 h-2 rounded-full ${statusColorMap[session.status || 'scheduled']}`}
                            title={statusLabelMap[session.status || 'scheduled']}
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                            {session.WorkoutTemplate?.name || '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end min-w-[120px]">
                      <div className="flex items-center gap-1 text-[#1F2A44] font-medium">
                        <Clock className="h-4 w-4" />
                        <span>{getTimeFromDateString(session.date)}</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{session.duration ? formatDuration(session.duration) : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Session Modal */}
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Session">
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Client</label>
              <Select
                name="clientId"
                value={form.clientId}
                onChange={handleFormChange}
                required
              >
                <option value="" disabled>Select client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.User?.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Workout Template</label>
              <Select
                name="workoutTemplateId"
                value={form.workoutTemplateId}
                onChange={handleFormChange}
                required
              >
                <option value="" disabled>Select workout template</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Time</label>
              <Select
                name="time"
                value={form.time}
                onChange={handleFormChange}
                required
              >
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Duration (minutes)</label>
              <Select
                name="duration"
                value={form.duration}
                onChange={handleFormChange}
                required
              >
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Note</label>
              <TextField
                name="note"
                value={form.note}
                onChange={handleFormChange}
                rows={2}
                placeholder="Optional note..."
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="danger" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {selectedSession && (
        <SessionDetailsModal
          isOpen={!!selectedSession}
          onClose={() => { setSelectedSession(null); setIsEditingNote(false); }}
          session={selectedSession}
          onUpdate={async (note) => {
            if (!selectedSession) return;
            try {
              await updateSession(selectedSession.id, { note });
              setSessions((prev) => prev.map(s => s.id === selectedSession.id ? { ...s, note } : s));
              setSelectedSession((prev) => prev ? { ...prev, note } : prev);
              toast.success('Note updated');
            } catch (e) {
              toast.error('Failed to update note');
            }
          }}
          onDelete={() => { handleDeleteSession(selectedSession.id); setSelectedSession(null); }}
          onStatusChange={async (newStatus) => {
            if (!selectedSession) return;
            setIsStatusUpdating(selectedSession.id);
            try {
              await updateSession(selectedSession.id, { status: newStatus as Session['status'] });
              setSessions((prev) => prev.map(s => s.id === selectedSession.id ? { ...s, status: newStatus as Session['status'] } : s));
              setSelectedSession((prev) => prev ? { ...prev, status: newStatus as Session['status'] } : prev);
            } catch (e) {
              toast.error('Failed to update status');
            } finally {
              setIsStatusUpdating(null);
            }
          }}
          isStatusUpdating={isStatusUpdating === selectedSession.id}
        />
      )}
    </div>
  );
}

