import { useMemo, useState } from "react"
import { TEvent } from "../context/Events"
import { useEvent } from "../utils/useEvent"
import { concatClass } from "../utils/concatClass"
import { endOfDay, isBefore, isSameMonth, isToday } from "date-fns"
import { formatData } from "../utils/formatDate"
import { OverFlowContainer } from "./OverFlowContainer"
import { CalendarEvent } from "./CalendarEvent"
import { ViewMoreCalendarEventsModal } from "./ViewMoreCalendarEventsModal"
import { EventFormModal } from "./EventFormModal"

interface ICalendarDayProps {
  day: Date
  showWeekName: boolean
  selectedMonth: Date
  events: TEvent[]
}

export function CalendarDay({
  day,
  showWeekName,
  selectedMonth,
  events,
}: ICalendarDayProps) {
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false)
  const [isViewMoreEventModalOpen, setIsViewMoreEventModalOpen] =
    useState(false)
  const { addEvent } = useEvent()

  const sortedEvent = useMemo(() => {
    const timeToNumber = (time: string) => parseFloat(time.replace(":", "."))

    return [...events].sort((a, b) => {
      if (a.allDay && b.allDay) {
        return 0
      }
      if (a.allDay) {
        return -1
      }
      if (b.allDay) {
        return 1
      }
      return timeToNumber(a.startTime) - timeToNumber(b.startTime)
    })
  }, [events])

  return (
    <div
      className={concatClass(
        "day",
        !isSameMonth(day, selectedMonth) && "non-month-day",
        isBefore(endOfDay(day), new Date()) && "old-month-day"
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
        <button
          className="add-event-btn"
          onClick={() => setIsNewEventModalOpen(true)}
        >
          +
        </button>
      </div>
      {Boolean(sortedEvent.length) && (
        <OverFlowContainer
          className="events"
          items={sortedEvent}
          getKey={(event) => event.id}
          renderItem={(event) => <CalendarEvent event={event} />}
          renderOverFlow={(amount) => (
            <>
              <button
                className="events-view-more-btn"
                onClick={() => setIsViewMoreEventModalOpen(true)}
              >
                +{amount} More
              </button>
              <ViewMoreCalendarEventsModal
                events={sortedEvent}
                isOpen={isViewMoreEventModalOpen}
                onClose={() => setIsViewMoreEventModalOpen(false)}
              />
            </>
          )}
        />
      )}

      <EventFormModal
        date={day}
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onSubmit={addEvent}
      />
    </div>
  )
}
