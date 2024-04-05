import { useContext } from "react"
import { EventContext } from "../context/Events"

export const EVENT_COLORS = ["red", "green", "blue"] as const

export function useEvent() {
  const value = useContext(EventContext)

  if (value === null)
    throw new Error("useEvent must be used in an EventProvider")

  return value
}
