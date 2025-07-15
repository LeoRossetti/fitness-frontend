import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface CalendarGridProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  futureSessionDates: Date[];
  pastSessionDates: Date[];
}

export default function CalendarGrid({
  selectedDate,
  onSelectDate,
  currentMonth,
  onMonthChange,
  futureSessionDates,
  pastSessionDates,
}: CalendarGridProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
        <div className="text-sm text-gray-500">
          {futureSessionDates.length} upcoming sessions
        </div>
      </div>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="w-full"
        month={currentMonth}
        onMonthChange={onMonthChange}
        modifiers={{
          hasSession: futureSessionDates,
          pastSession: pastSessionDates,
        }}
        modifiersClassNames={{
          selected: "bg-violet-500 text-white font-bold rounded-lg shadow-md",
          hasSession: "border-b-4 border-violet-500 font-bold bg-violet-50",
          pastSession: "border-b-4 border-green-500 font-bold bg-green-50",
          today: "border-2 border-violet-500 font-bold",
        }}
      />
    </div>
  );
} 