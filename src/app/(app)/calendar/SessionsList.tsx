import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/Avatar';
import { Session } from '@/types/types';
import { getTimeFromDateString, getClientName, formatDuration, statusColorMap } from '@/utils/sessionUtils';

interface SessionsListProps {
  selectedDate: Date | undefined;
  sessions: Session[];
  onAddSession: () => void;
  onSessionClick: (session: Session) => void;
}

export default function SessionsList({
  selectedDate,
  sessions,
  onAddSession,
  onSessionClick,
}: SessionsListProps) {
  return (
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

      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#6B7280]">No sessions scheduled for this date</p>
          <Button
            onClick={onAddSession}
            className="mt-4 cursor-pointer"
            variant="default"
          >
            Schedule a session
          </Button>
        </div>
      ) : (
        <div className="space-y-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between bg-gray-50 rounded-lg shadow-sm p-4 mb-3 group cursor-pointer"
              onClick={() => onSessionClick(session)}
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
                      title={session.status || 'scheduled'}
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
                <span className="text-xs text-gray-500 mt-1">
                  {session.duration ? formatDuration(session.duration) : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 