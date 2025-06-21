'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { Plus, Clock, User, Calendar as CalendarIcon } from 'lucide-react';
import { getClients, createSession, getSessionsByMonth, deleteSession, updateClientNextSession } from '@/lib/api';
import 'react-day-picker/dist/style.css';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { isSameDay } from 'date-fns';
import { Select } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

interface Session {
  id: number;
  date: string;
  time: string;
  note: string;
  Client: {
    id: number;
    User: {
      name: string;
    };
  };
  type: 'personal' | 'group' | 'consultation';
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clients, setClients] = useState<{ id: number; User: { name: string } }[]>([]);
  const [form, setForm] = useState({
    clientId: '',
    type: 'personal',
    time: '',
    note: '',
  });
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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
  const getClientName = (session: Session) => {
    return session.Client?.User?.name || '—';
  };

  // Генерируем опции времени с шагом 15 минут с 07:00 до 22:00
  const timeOptions = [
    { value: '', label: 'Choose time', disabled: true },
    ...Array.from({ length: ((22 - 7) * 4) + 1 }, (_, i) => {
      const hour = 7 + Math.floor(i / 4);
      const minute = (i % 4) * 15;
      const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      return { value, label: value };
    })
  ];

  // Обработчик сохранения
  const handleSave = async () => {
    if (!selectedDate || !form.time) {
      toast.error('Please select a date and time');
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
        type: form.type,
        time: form.time,
        note: form.note,
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
        type: 'personal',
        time: '',
        note: '',
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

      const clientId = session.Client?.id;
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
                    className="p-4 rounded-lg border border-gray-200 hover:border-[#10B981] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        {getClientName(session)}
                      </span>
                      <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-xs">{session.type}</span>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleDeleteSession(session.id)}
                      >
                        Cancel Session
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280] mt-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {getTimeFromDateString(session.date)}
                      </span>
                    </div>
                    {session.note && (
                      <p className="mt-2 text-sm text-[#6B7280]">{session.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Session Modal (TODO: Implement) */}
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Session">
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block text-sm font-medium mb-1">Client</label>
              <select
                name="clientId"
                value={form.clientId}
                onChange={handleFormChange}
                required
                className="w-full border rounded px-3 py-2 cursor-pointer"
              >
                <option value="" disabled>Select client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.User?.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 cursor-pointer"
              >
                <option value="personal">Personal</option>
                {/* <option value="group">Group</option> */}
                <option value="consultation">Consultation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <Select
                name="time"
                value={form.time}
                onChange={handleFormChange}
                options={timeOptions}
                required
                className="cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Note</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 cursor-pointer"
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
    </div>
  );
}
