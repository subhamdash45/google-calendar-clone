import { useState } from "react"
import { TEvent } from "../context/Events"
import { useEvent } from "../context/useEvent"
import { concatClass } from "../utils/concatClass"
import { formatData } from "../utils/formatDate"
import { parse } from "date-fns"
import { EventFormModal } from "./EventFormModal"

export function CalendarEvent({ event }: { event: TEvent }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { updateEvent, deleteEvent } = useEvent()

  return (
    <>
      <button
        className={concatClass(
          "event",
          event.color,
          event.allDay && "all-day-event"
        )}
        onClick={() => setIsEditModalOpen(true)}
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
      <EventFormModal
        event={event}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(eventDetails) => updateEvent(event.id, eventDetails)}
        onDelete={() => deleteEvent(event.id)}
      />
    </>
  )
}
