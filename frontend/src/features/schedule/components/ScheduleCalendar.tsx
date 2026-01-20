import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarApi } from "@fullcalendar/core";
import viLocale from "@fullcalendar/core/locales/vi";
import { getEventClass } from "./calender/eventStyles";

export default function ScheduleCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null);

  const getApi = (): CalendarApi | undefined =>
    calendarRef.current?.getApi();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* ===== Custom Toolbar ===== */}
      <div className="flex items-center justify-between mb-4">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Tháng 10, 2023
          </h2>

          <div className="flex items-center gap-1">
            <button
              onClick={() => getApi()?.prev()}
              className="w-8 h-8 rounded-lg border border-gray-200
                         hover:bg-gray-50 flex items-center justify-center"
            >
              ‹
            </button>
            <button
              onClick={() => getApi()?.next()}
              className="w-8 h-8 rounded-lg border border-gray-200
                         hover:bg-gray-50 flex items-center justify-center"
            >
              ›
            </button>
          </div>

          <button
            onClick={() => getApi()?.today()}
            className="text-sm text-blue-600 hover:underline"
          >
            Hôm nay
          </button>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => getApi()?.changeView("dayGridMonth")}
            className="px-3 py-1.5 text-sm rounded-md bg-white shadow-sm"
          >
            Tháng
          </button>
          <button
            onClick={() => getApi()?.changeView("timeGridWeek")}
            className="px-3 py-1.5 text-sm rounded-md text-gray-600 hover:bg-white"
          >
            Tuần
          </button>
          <button
            onClick={() => getApi()?.changeView("timeGridDay")}
            className="px-3 py-1.5 text-sm rounded-md text-gray-600 hover:bg-white"
          >
            Ngày
          </button>
        </div>
      </div>

      {/* ===== Calendar ===== */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        height="auto"
        selectable
        editable={false}
        dayMaxEvents
        locale={viLocale}
        firstDay={1} // Thứ 2 là ngày đầu tuần
        dayHeaderFormat={{ weekday: "short" }}
        eventClassNames={(arg) =>
          getEventClass(arg.event.extendedProps.status)
        }
        events={[
          {
            id: "1",
            title: "Route A - Sáng",
            start: "2026-01-09T08:00:00",
            end: "2026-01-09T10:00:00",
            status: "IN_PROGRESS",
          },
          {
            id: "2",
            title: "Route B - Chiều",
            start: "2026-01-10T14:00:00",
            status: "ALERT",
          },
        ]}
      />
    </div>
  );
}
