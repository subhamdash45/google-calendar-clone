import { useEffect, useState } from "react"
import { TEvent } from "../context/Events"

export function useLocalStorage(key: string, initialValue: TEvent[]) {
  const [value, setValue] = useState<TEvent[]>(() => {
    const jsonValue = localStorage.getItem(key)
    if (jsonValue == null) return initialValue

    return (JSON.parse(jsonValue) as TEvent[]).map((event) => {
      if (event.date instanceof Date) return event
      return { ...event, date: new Date(event.date) }
    })
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
