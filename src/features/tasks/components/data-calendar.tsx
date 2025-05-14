import { Task, TaskStatus } from "../constant/types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventCard from "./event-card";
import CustomToolbar from "./custom-toolbar";

interface DataCalendarProps {
  data: Task[];
}
export default function DataCalendar({ data }: DataCalendarProps) {
  const locales = {
    "en-US": enUS,
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    assignee: task.assignedUser.name,
    status: task.status,
    id: task.id,
  }));

  const handleNavigation = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else {
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar={true}
      showAllEvents={true}
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEEE", culture) || "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee!}
            status={event.status as TaskStatus}
          />
        ),
        toolbar: () => (
          <CustomToolbar date={value} onNavigate={handleNavigation} />
        ),
      }}
    />
  );
}
