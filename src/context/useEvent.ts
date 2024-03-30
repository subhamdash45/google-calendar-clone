import { useContext } from "react";
import { EventContext } from "./Events";

export const EVENT_COLORS = ["red", "green", "blue"] as const;
export function useEvent() {
  const value = useContext(EventContext);

  if (value === null)
    return new Error("useEvent must be used in an EventProvider");

  return value;
}
