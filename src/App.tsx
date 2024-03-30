import { Calendar } from "./components/Calendar";
import { EventProvider } from "./context/Events";

export function App() {
  return (
    <EventProvider>
      <Calendar />
    </EventProvider>
  );
}
