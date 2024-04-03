import { ReactNode, createContext, useState } from "react"
import { UnionOmit } from "../utils/types"
import { EVENT_COLORS } from "./useEvent"

export type TEvent = {
  id: string
  name: string
  color: (typeof EVENT_COLORS)[number]
  date: Date
} & (
  | { allDay: false; startTime: string; endTime: string }
  | { allDay: true; startTime?: never; endTime?: never }
)

type TEventContext = {
  events: TEvent[]
  addEvent: (event: UnionOmit<TEvent, "id">) => void
  updateEvent: (id: string, event: UnionOmit<TEvent, "id">) => void
  deleteEvent: (id: string) => void
}

export const EventContext = createContext<TEventContext | null>(null)

// const abc:Event={
//   allDay: false,
//   name: 'sjsdj',
//   id: 'djjf',
//   color: 'green',
//   date: new Date(),
//   startTime: 'ffkf',
//   endTime: 'djfjf'
// }
// console.log(abc)

type TEventProviderProps = {
  children: ReactNode
}

export function EventProvider({ children }: TEventProviderProps) {
  const [events, setEvents] = useState<TEvent[]>([])

  function addEvent(eventDetails: UnionOmit<TEvent, "id">) {
    setEvents((pre) => [...pre, { ...eventDetails, id: crypto.randomUUID() }])
  }

  function updateEvent(id: string, eventDetails: UnionOmit<TEvent, "id">) {
    const updatedEvents = events.map((event) => {
      return event.id == id ? { id, ...eventDetails } : event
    })
    setEvents(updatedEvents)
  }

  function deleteEvent(id: string) {
    setEvents((pre) => pre.filter((event) => event.id !== id))
  }

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent }}
    >
      {children}
    </EventContext.Provider>
  )
}
