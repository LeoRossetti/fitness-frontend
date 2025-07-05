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
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
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
          selected: "bg-[#8B5CF6] text-white font-bold rounded-lg",
          hasSession: "border-b-4 border-[#8B5CF6] font-bold",
          pastSession: "border-b-4 border-green-500 font-bold",
          today: "border border-[#8B5CF6]",
        }}
      />
    </div>
  );
} 