import { TEvent } from "../context/Events"
import { formatData } from "../utils/formatDate"
import { CalendarEvent } from "./CalendarEvent"
import { Modal, TModalProps } from "./Modal"

type TViewMoreCalendarEventsModalProps = {
  events: TEvent[]
} & Omit<TModalProps, "children">

export function ViewMoreCalendarEventsModal({
  events,
  ...modalProps
}: TViewMoreCalendarEventsModalProps) {
  if (events.length === 0) return null
  return (
    <Modal {...modalProps}>
      <div className="modal-title">
        <small>{formatData(events[0].date, { dateStyle: "short" })}</small>
        <button className="close-btn" onClick={() => modalProps.onClose()}>
          &times;
        </button>
      </div>
      <div className="events">
        {events.map((event) => (
          <CalendarEvent event={event} key={event.id} />
        ))}
      </div>
    </Modal>
  )
}
