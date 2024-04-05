import { useMemo, useState } from "react"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import "./styles.css"
import { formatData } from "../utils/formatDate"
import { useEvent } from "../context/useEvent"
import { CalendarDay } from "./CalendarDay"

export function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  const calendarDates = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(selectedMonth))
    const lastWeekEnd = endOfWeek(endOfMonth(selectedMonth))
    return eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd })
  }, [selectedMonth])

  const { events } = useEvent()

  return (
    <div className="calendar">
      <div className="header">
        <button className="btn" onClick={() => setSelectedMonth(new Date())}>
          Today
        </button>
        <div>
          <button
            className="month-change-btn"
            onClick={() => {
              setSelectedMonth((pre) => subMonths(pre, 1))
            }}
          >
            &lt;
          </button>
          <button
            className="month-change-btn"
            onClick={() => {
              setSelectedMonth((pre) => addMonths(pre, 1))
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
            events={events.filter((event) => isSameDay(day, event.date))}
            showWeekName={index < 7}
            selectedMonth={selectedMonth}
          />
        ))}
      </div>
    </div>
  )
}
