import { FormEvent, Fragment, useId, useRef, useState } from "react"
import { TEvent } from "../context/Events"
import { UnionOmit } from "../utils/types"
import { Modal, TModalProps } from "./Modal"
import { formatData } from "../utils/formatDate"
import { EVENT_COLORS } from "../utils/useEvent"

type EventFormModalProps = {
  onSubmit: (event: UnionOmit<TEvent, "id">) => void
} & (
  | { onDelete: () => void; event: TEvent; date?: never }
  | { onDelete?: never; event?: never; date: Date }
) &
  Omit<TModalProps, "children">

export function EventFormModal({
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
            <input
              required
              type="text"
              id={`${formId}-name`}
              ref={nameRef}
              defaultValue={event?.name}
            />
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
                defaultValue={event?.endTime}
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
