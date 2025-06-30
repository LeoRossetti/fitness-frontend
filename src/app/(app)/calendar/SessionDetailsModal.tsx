import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/Avatar';
import { Calendar as CalendarIcon, Clock, StickyNote } from 'lucide-react';
import { ServerWorkoutTemplate, Session } from '@/types/types';
import WorkoutTemplateCard from '../workout_templates/WorkoutTemplateCard';
import { Select } from '@/components/ui/select';

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onUpdate: (note: string) => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
  isStatusUpdating?: boolean;
}

export default function SessionDetailsModal({
  isOpen,
  onClose,
  session,
  onUpdate,
  onDelete,
  onStatusChange,
  isStatusUpdating
}: SessionDetailsModalProps) {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNote, setEditNote] = useState(session?.note || '');

  if (!session) return null;

  const statusLabelMap: Record<string, string> = {
    scheduled: 'Scheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No show',
  };

  const statusColorMap: Record<string, string> = {
    scheduled: 'bg-gray-200 text-gray-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); setIsEditingNote(false); }} title="">
      <div className="p-0 w-full max-w-xl min-w-[420px] mx-auto animate-fade-in">
        {/* Client */}
        <div className="flex flex-col items-center mb-4 pt-8">
          <Avatar
            name={session.Client?.User?.name || ''}
            photoUrl={session.Client?.profile}
            size="w-20 h-20 shadow-lg"
          />
          <div className="mt-3 font-bold text-xl text-[#1F2A44]">{session.Client?.User?.name || '—'}</div>
          <div className="text-xs text-gray-500">{session.Client?.User?.email || ''}</div>
        </div>
        {/* Status */}
        <div className="flex flex-col items-center mb-4">
          <span className={`px-4 py-1 rounded-full text-base font-semibold mb-2 shadow-sm border ${statusColorMap[session.status || 'scheduled']}`}>{statusLabelMap[session.status || 'scheduled']}</span>
          <Select
            className="w-44 text-center px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all shadow-sm"
            value={session.status || 'scheduled'}
            onChange={e => onStatusChange(e.target.value)}
            disabled={isStatusUpdating}
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No show</option>
          </Select>
        </div>
        {/* Workout Card */}
        <div className="mb-6">
          <div className="font-semibold mb-3 text-[#1F2A44] text-center text-lg tracking-tight">Workout Template</div>
          {session.WorkoutTemplate && (session.WorkoutTemplate as ServerWorkoutTemplate).Exercises && (session.WorkoutTemplate as ServerWorkoutTemplate).Exercises.length > 0 ? (
            <div className="px-1 pt-1 pb-2">
              <WorkoutTemplateCard
                template={session.WorkoutTemplate as ServerWorkoutTemplate}
                hideActions={true}
              />
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center">No exercises in this template</div>
          )}
        </div>
        {/* Info */}
        <div className="grid grid-cols-1 gap-2 mb-8 bg-white/80 rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CalendarIcon className="w-4 h-4" />
            <span>{session.date?.slice(0, 10)}</span>
            {session.time && <span>at {session.time}</span>}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="w-4 h-4" />
            <span>{session.duration || '—'} min</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <StickyNote className="w-4 h-4 mt-1" />
            <div className="flex-1">
              {isEditingNote ? (
                <>
                  <textarea
                    className="w-full border rounded-lg p-2 mb-2 min-h-[60px]"
                    value={editNote}
                    onChange={e => setEditNote(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { onUpdate(editNote); setIsEditingNote(false); }}>Save</Button>
                    <Button size="sm" variant="default" onClick={() => { setIsEditingNote(false); setEditNote(session.note || ''); }}>Cancel</Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <span>{session.note || '—'}</span>
                  <Button size="sm" variant="default" onClick={() => setIsEditingNote(true)}>Edit</Button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-3 justify-end mt-2 pb-6">
          <Button className="min-w-[90px] rounded-lg shadow-md hover:shadow-lg transition-all" onClick={onDelete} variant="danger">
            Delete
          </Button>
          <Button className="min-w-[90px] rounded-lg shadow-md hover:shadow-lg transition-all" onClick={() => { onClose(); setIsEditingNote(false); }} variant="default">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
} 