import { FormEvent, Fragment, useId, useMemo, useRef, useState } from "react"
import {
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import "./styles.css"
import { formatData } from "../utils/formatDate"
import { concatClass } from "../utils/concatClass"
import { Modal, TModalProps } from "./Modal"
import { UnionOmit } from "../utils/types"
import { TEvent } from "../context/Events"
import { EVENT_COLORS, useEvent } from "../context/useEvent"

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
        <button className="btn">Today</button>
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

function CalendarEvent({ event }: { event: TEvent }) {
  return (
    <button
      className={concatClass(
        "event",
        event.color,
        event.allDay && "all-day-event"
      )}
    >
      {event.allDay ? (
        <div className="event-name">{event.name}</div>
      ) : (
        <>
          <div className={concatClass("color-dot", event.color)}></div>
          <div className="event-time">
            {formatData(parse(event.startTime, "HH:mm", event.date), {
              timeStyle: "short",
            })}
          </div>
          <div className="event-name">{event.name}</div>
        </>
      )}
    </button>
  )
}

interface ICalendarDayProps {
  day: Date
  showWeekName: boolean
  selectedMonth: Date
  events: TEvent[]
}

function CalendarDay({
  day,
  showWeekName,
  selectedMonth,
  events,
}: ICalendarDayProps) {
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false)
  const { addEvent } = useEvent()
  // function addEvent(event: UnionOmit<TEvent, "id">): void {
  //   throw new Error("Function not implemented.")
  // }
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
        <button
          className="add-event-btn"
          onClick={() => setIsNewEventModalOpen(true)}
        >
          +
        </button>
      </div>
      {Boolean(sortedEvent.length) && (
        <div className="events">
          {sortedEvent.map((event) => (
            <CalendarEvent key={event.id} event={event} />
          ))}
        </div>
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

type EventFormModalProps = {
  onSubmit: (event: UnionOmit<TEvent, "id">) => void
} & (
  | { onDelete: () => void; event: TEvent; date?: never }
  | { onDelete?: never; event?: never; date: Date }
) &
  Omit<TModalProps, "children">

function EventFormModal({
  onSubmit,
  onDelete,
  event,
  date,
  ...modalProps
}: EventFormModalProps) {
  const isNew = event == null
  const formId = useId()
  const [selectedColor, setSelectedColor] = useState(
    event?.color || EVENT_COLORS[0]
  )
  const [isAllDayChecked, setIsAllDayChecked] = useState(event?.allDay || false)
  const [startTime, setStartTime] = useState(event?.startTime || "")
  const nameRef = useRef<HTMLInputElement>(null)
  const endTimeRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const name = nameRef.current?.value
    const endTime = endTimeRef.current?.value

    if (name == null || name === "") return

    const commonProps = {
      name,
      date: date || event.date,
      color: selectedColor,
    }

    let newEvent: UnionOmit<TEvent, "id">

    if (isAllDayChecked) {
      newEvent = {
        ...commonProps,
        allDay: true,
      }
    } else {
      if (
        startTime == null ||
        startTime === "" ||
        endTime == null ||
        endTime === ""
      )
        return

      newEvent = {
        ...commonProps,
        allDay: false,
        startTime,
        endTime,
      }
    }
    modalProps.onClose()
    onSubmit(newEvent)
  }

  return (
    <Modal {...modalProps}>
      <div className="modal-body">
        <div className="modal-title">
          <div>{isNew ? "Add" : "Edit"} Event</div>
          <small>
            {formatData(date || event.date, { dateStyle: "short" })}
          </small>
          <button className="close-btn" onClick={() => modalProps.onClose()}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor={`${formId}-name`}>Name</label>
            <input required type="text" id={`${formId}-name`} ref={nameRef} />
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id={`${formId}-all-day`}
              checked={isAllDayChecked}
              onClick={() => setIsAllDayChecked((pre) => !pre)}
            />
            <label htmlFor={`${formId}-all-day`}>All Day?</label>
          </div>
          <div className="row">
            <div className="form-group">
              <label htmlFor={`${formId}-start-time`}>Start Time</label>
              <input
                type="time"
                id={`${formId}-start-time`}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required={!isAllDayChecked}
                disabled={isAllDayChecked}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`${formId}-end-time`}>End Time</label>
              <input
                type="time"
                id={`${formId}-end-time`}
                required={!isAllDayChecked}
                disabled={isAllDayChecked}
                min={startTime}
                ref={endTimeRef}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Color</label>
            <div className="row left">
              {EVENT_COLORS.map((color) => {
                return (
                  <Fragment key={color}>
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      id={`${formId}-${color}`}
                      checked={selectedColor === color}
                      onChange={() => {
                        setSelectedColor(color)
                      }}
                      className="color-radio"
                    />
                    <label htmlFor={`${formId}-${color}`}>
                      <span className="sr-only">{color}</span>
                    </label>
                  </Fragment>
                )
              })}
            </div>
          </div>
          <div className="row">
            <button className="btn btn-success" type="submit">
              {isNew ? "Add" : "Edit"}
            </button>
            {onDelete != null && (
              <button
                className="btn btn-delete"
                type="button"
                onClick={onDelete}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  )
}
