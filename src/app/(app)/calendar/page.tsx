'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { Plus, Clock, User, Calendar as CalendarIcon } from 'lucide-react';
import { getSessionsByDate, getClients, createSession, getSessionsByMonth } from '@/utils/api/api';
import 'react-day-picker/dist/style.css';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isSameDay } from 'date-fns';
import { Select } from '@/components/ui/select';

interface Session {
  id: number;
  date: string;
  time: string;
  note: string;
  client: { id: number; name: string };
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
      getClients().then(setClients).catch(console.error);
    }
  }, [isAddModalOpen]);

  const getSessionTypeColor = (type: Session['type']) => {
    switch (type) {
      case 'personal':
        return 'bg-blue-100 text-blue-800';
      case 'group':
        return 'bg-purple-100 text-purple-800';
      case 'consultation':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Обработчик изменения полей формы
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Генерируем опции времени с шагом 15 минут с 07:00 до 22:00
  const timeOptions = Array.from({ length: ((22 - 7) * 4) + 1 }, (_, i) => {
    const hour = 7 + Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    return { value, label: value };
  });

  // Обработчик сохранения
  const handleSave = async () => {
    if (!selectedDate) return;
    try {
      // Формируем дату сессии с временем
      const date = `${selectedDate.toISOString().split('T')[0]}T${form.time}:00`;
      await createSession({
        clientId: Number(form.clientId),
        type: form.type,
        time: form.time,
        note: form.note,
        date,
      });
      setIsAddModalOpen(false);
      setCurrentMonth(new Date(selectedDate));
    } catch (err) {
      alert('Failed to create session');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1F2A44]">Calendar</h1>
            <p className="text-sm text-[#6B7280] mt-1">Manage your training sessions</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#10B981] text-white px-4 py-2 rounded-lg hover:bg-[#059669] transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Session
          </button>
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
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 text-[#10B981] hover:text-[#059669] transition-colors"
                >
                  Schedule a session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sessionsForSelectedDate.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-[#10B981] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        {session.client?.name || '—'}
                      </span>
                      <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-xs">{session.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6B7280] mt-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                className="w-full border rounded px-3 py-2"
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
                className="w-full border rounded px-3 py-2"
              >
                <option value="personal">Personal</option>
                <option value="group">Group</option>
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Note</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
                rows={2}
                placeholder="Optional note..."
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
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
