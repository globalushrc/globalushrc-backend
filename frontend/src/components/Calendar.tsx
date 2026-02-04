import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate: string;
  availabilityMap?: { [date: string]: number };
  onMonthChange?: (year: number, month: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  selectedDate,
  availabilityMap = {},
  onMonthChange,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (onMonthChange) {
      onMonthChange(currentDate.getFullYear(), currentDate.getMonth() + 1);
    }
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    setCurrentDate(nextDate);
    if (onMonthChange) {
      onMonthChange(nextDate.getFullYear(), nextDate.getMonth() + 1);
    }
  };

  const handleNextMonth = () => {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );
    setCurrentDate(nextDate);
    if (onMonthChange) {
      onMonthChange(nextDate.getFullYear(), nextDate.getMonth() + 1);
    }
  };

  const isWeekend = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
  };

  // Hardcoded holidays for demo purposes - should ideally come from props or API
  const HOLIDAYS: { [key: string]: string } = {
    "2026-01-01": "New Year's Day",
    "2026-12-25": "Christmas Day",
    "2026-01-30": "Martyr's Day", // Example for Nepal
    "2026-04-14": "Nepali New Year",
    "2026-05-01": "International Labour Day",
  };

  const getHolidayName = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    return HOLIDAYS[dateStr] || null;
  };

  const handleDateClick = (day: number) => {
    if (
      isWeekend(currentDate.getFullYear(), currentDate.getMonth(), day) ||
      getHolidayName(currentDate.getFullYear(), currentDate.getMonth(), day)
    ) {
      return;
    }

    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onDateSelect(dateStr);
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const weekend = isWeekend(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      const holidayName = getHolidayName(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      const isUnavailable = weekend || holidayName;

      const dateStr = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1,
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isSelected = selectedDate === dateStr;

      const count = availabilityMap[dateStr];

      let bgClass =
        "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer border-emerald-100"; // Default Green (Available)
      if (isUnavailable) {
        bgClass = "bg-red-50 text-red-400 cursor-not-allowed border-red-100"; // Red (Blocked)
      }
      if (holidayName) {
        bgClass =
          "bg-orange-50 text-orange-700 cursor-not-allowed border-orange-100"; // Orange (Holiday)
      }
      if (isSelected) {
        bgClass =
          "bg-blue-600 text-white shadow-md transform scale-105 border-blue-600"; // Blue (Selected)
      }

      // Check if past date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const cellDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      if (cellDate < today) {
        bgClass =
          "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100";
      }

      days.push(
        <div
          key={day}
          title={holidayName || (weekend ? "Weekend" : "")}
          onClick={() => cellDate >= today && handleDateClick(day)}
          className={`h-12 flex flex-col items-center justify-center rounded-xl font-medium text-sm border transition-all duration-200 relative group ${bgClass}`}
        >
          <span className={isSelected ? "mt-[-8px]" : ""}>{day}</span>

          {/* Availability Count Badge */}
          {!isUnavailable && cellDate >= today && count !== undefined && (
            <div
              className={`mt-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none ${
                isSelected
                  ? "bg-white text-blue-600"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {count}
            </div>
          )}

          {holidayName && (
            <span className="text-[6px] leading-[6px] absolute bottom-1 truncate max-w-[90%] font-black uppercase tracking-tighter opacity-70">
              {holidayName}
            </span>
          )}
        </div>,
      );
    }

    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-w-sm mx-auto md:mx-0">
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
          <FaChevronLeft />
        </button>
        <span className="font-bold text-gray-800 text-lg">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-xs font-bold text-gray-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">{renderDays()}</div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span className="text-gray-600">Weekend</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
          <span className="text-gray-600 font-bold">Holiday</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
