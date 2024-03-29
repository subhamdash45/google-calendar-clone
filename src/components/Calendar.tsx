import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isBefore,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import "./styles.css";
import { formatData } from "../utils/formatDate";
import { concatClass } from "../utils/concatClass";

export function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const calendarDates = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(selectedMonth));
    const lastWeekEnd = endOfWeek(endOfMonth(selectedMonth));
    return eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd });
  }, [selectedMonth]);

  console.log(calendarDates);
  return (
    <div className="calendar">
      <div className="header">
        <button className="btn">Today</button>
        <div>
          <button
            className="month-change-btn"
            onClick={() => {
              setSelectedMonth((pre) => subMonths(pre, 1));
            }}
          >
            &lt;
          </button>
          <button
            className="month-change-btn"
            onClick={() => {
              setSelectedMonth((pre) => addMonths(pre, 1));
            }}
          >
            &gt;
          </button>
        </div>
        <span className="month-title">
          {formatData(selectedMonth, { month: "long", year: "numeric" })}
        </span>
      </div>
      <div className="days">
        {calendarDates.map((day, index) => (
          <CalendarDay
            key={day.getTime()}
            day={day}
            showWeekName={index < 7}
            selectedMonth={selectedMonth}
          />
        ))}
      </div>
    </div>
  );
}

interface ICalendarDayProps {
  day: Date;
  showWeekName: boolean;
  selectedMonth: Date;
}

function CalendarDay({ day, showWeekName, selectedMonth }: ICalendarDayProps) {
  return (
    <div
      className={concatClass(
        "day",
        !isSameMonth(day, selectedMonth) && "non-month-day",
        isBefore(endOfDay(day), selectedMonth) && "old-month-day"
      )}
    >
      <div className="day-header">
        {showWeekName && (
          <div className="week-name">
            {formatData(day, { weekday: "short" })}
          </div>
        )}
        <div className={concatClass("day-number", isToday(day) && "today")}>
          {formatData(day, { day: "numeric" })}
        </div>
        <button className="add-event-btn">+</button>
      </div>
      {/* <div className="events">
        <button className="all-day-event blue event">
          <div className="event-name">Short</div>
        </button>
        <button className="all-day-event green event">
          <div className="event-name">
            Long Event Name That Just Keeps Going
          </div>
        </button>
        <button className="event">
          <div className="color-dot blue"></div>
          <div className="event-time">7am</div>
          <div className="event-name">Event Name</div>
        </button>
      </div> */}
    </div>
  );
}
