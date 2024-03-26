import { useMemo, useState } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import "./styles.css";
import { formatData } from "../utils/formatDate";

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
          <button className="month-change-btn">&lt;</button>
          <button className="month-change-btn">&gt;</button>
        </div>
        <span className="month-title">June 2023</span>
      </div>
      <div className="days">
        {calendarDates.map((day,index) => (
          <CalendarDay key={day.getTime()} day={day} showWeekName={index<7} selectedMonth={selectedMonth} />
        ))}
      </div>
    </div>
  );
}

interface ICalendarDayProps{
  day: Date,
  showWeekName: boolean,
  selectedMonth: Date
}

function CalendarDay({day, showWeekName, selectedMonth}: ICalendarDayProps) {
  return (
    <div className="day non-month-day old-month-day">
      <div className="day-header">
        {showWeekName && <div className="week-name">{formatData(day, { weekday: 'short'})}</div>}
        <div className="day-number">{formatData(day, {day: 'numeric'})}</div>
        <button className="add-event-btn">+</button>
      </div>
      <div className="events">
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
      </div>
    </div>
  );
}
