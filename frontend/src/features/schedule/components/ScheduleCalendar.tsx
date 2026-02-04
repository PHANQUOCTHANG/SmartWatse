import {
  useRef,
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarApi, DatesSetArg } from "@fullcalendar/core";
import viLocale from "@fullcalendar/core/locales/vi";
import { getEventClass } from "./calender/eventStyles";
import { useSchedules } from "../hooks/useSchedules";
import { queryClient } from "@/lib/queryClient";
import { scheduleKeys } from "../utils/scheduleKeys";
import type { ISchedule } from "../types";

const ScheduleCalendar = forwardRef<
  { refetch: () => void },
  { onScheduleClick?: (s: ISchedule) => void; selectedAreaId?: string }
>(({ onScheduleClick, selectedAreaId }, ref) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const initialMonth = useMemo(
    () => new Date().toISOString().substring(0, 7),
    [],
  );
  const { schedules, isLoading, updateFilter } = useSchedules(
    undefined,
    {
      startDate: initialMonth,
      areaId: selectedAreaId || undefined,
    },
    true,
  );

  // Cập nhật filter khi selectedAreaId thay đổi
  useEffect(() => {
    if (!selectedAreaId) updateFilter("areaId", "default");
    else updateFilter("areaId", selectedAreaId || undefined);
  }, [selectedAreaId, updateFilter]);

  useImperativeHandle(ref, () => ({
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  }));

  const [viewTitle, setViewTitle] = useState("");
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [inputValue, setInputValue] = useState(initialMonth);

  const getApi = (): CalendarApi | undefined => calendarRef.current?.getApi();

  // Tạo danh sách năm (từ 2020 đến 2030)
  const years = useMemo(
    () => Array.from({ length: 11 }, (_, i) => 2020 + i),
    [],
  );

  // Đồng bộ trạng thái khi lịch thay đổi (bấm nút Next/Prev/Today)
  const handleDatesSet = useCallback(
    (arg: DatesSetArg) => {
      setCurrentView(arg.view.type);

      const start = arg.view.currentStart;
      const end = arg.view.currentEnd;
      const year = start.getFullYear();
      const month = String(start.getMonth() + 1).padStart(2, "0");
      const day = String(start.getDate()).padStart(2, "0");

      const monthStr = `${year}-${month}`;

      // Format tiêu đề dùng "/" thay vì chữ
      let formattedTitle = "";
      if (arg.view.type === "dayGridMonth") {
        formattedTitle = `Tháng ${month}/${year}`;
      } else {
        const endYear = end.getFullYear();
        const endMonth = String(end.getMonth() + 1).padStart(2, "0");
        const endDay = String(end.getDate() - 1).padStart(2, "0"); // Trừ 1 vì end date là ngày đầu tiên của tuần tiếp theo
        formattedTitle = `${day}/${month}/${year} - ${endDay}/${endMonth}/${endYear}`;
      }

      setViewTitle(formattedTitle);
      setInputValue(
        arg.view.type === "dayGridMonth" ? monthStr : `${monthStr}-${day}`,
      );
      updateFilter("startDate", monthStr);
    },
    [updateFilter],
  );

  // Xử lý khi chọn Năm từ Select
  const handleYearChange = (year: string) => {
    const api = getApi();
    if (!api) return;

    // Lấy tháng hiện tại đang xem để giữ nguyên tháng, chỉ đổi năm
    const currentMonth = api.getDate().getMonth() + 1;
    const targetDate = `${year}-${String(currentMonth).padStart(2, "0")}-01`;
    api.gotoDate(targetDate);
  };

  // Xử lý khi chọn/xóa Tháng hoặc Ngày
  const handleJumpDate = (val: string) => {
    const api = getApi();
    if (!api) return;

    if (!val) {
      api.today(); // Nếu xóa trắng input thì về mặc định hôm nay
    } else {
      setInputValue(val);
      api.gotoDate(val);
    }
  };

  const events = useMemo(() => {
    if (!schedules || !Array.isArray(schedules)) return [];
    return schedules
      .map((s: ISchedule) => {
        const dateRaw = (s.scheduledDate || (s as any).date) as string;
        if (!dateRaw || !s.name) return null;
        const dateObj = new Date(dateRaw);
        if (isNaN(dateObj.getTime())) return null;
        const datePart = dateObj.toLocaleDateString("en-CA");

        return {
          id: s._id || s.id,
          title: s.name,
          start: s.startTime ? `${datePart}T${s.startTime}` : datePart,
          end: s.endTime ? `${datePart}T${s.endTime}` : undefined,
          extendedProps: {
            status: s.status,
            startTime: s.startTime,
            endTime: s.endTime,
            raw: s,
          },
        };
      })
      .filter(Boolean) as any[];
  }, [schedules]);

  console.log(events);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm h-full flex flex-col gap-4">
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800 capitalize min-w-50">
            {viewTitle}
          </h2>

          {/* NHÓM BỘ CHỌN NHANH */}
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
            {/* Chọn Năm */}
            <select
              value={new Date(inputValue).getFullYear()}
              onChange={(e) => handleYearChange(e.target.value)}
              className="bg-transparent text-sm font-bold text-blue-600 outline-none cursor-pointer border-r border-blue-200 pr-2"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Chọn Tháng/Ngày */}
            <span className="text-lg font-bold text-blue-400 mx-1">/</span>
            <input
              type={currentView === "dayGridMonth" ? "month" : "date"}
              value={inputValue}
              onChange={(e) => handleJumpDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-blue-600 outline-none cursor-pointer"
            />
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => getApi()?.prev()}
              className="w-10 h-10 hover:bg-white rounded-md transition-all text-xl"
            >
              ‹
            </button>
            <button
              onClick={() => getApi()?.next()}
              className="w-10 h-10 hover:bg-white rounded-md transition-all text-xl"
            >
              ›
            </button>
          </div>
          <button
            onClick={() => getApi()?.today()}
            className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg"
          >
            Hôm nay
          </button>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg border">
          <button
            onClick={() => getApi()?.changeView("dayGridMonth")}
            className={`px-4 py-1.5 text-sm font-bold rounded-md ${currentView === "dayGridMonth" ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
          >
            Tháng
          </button>
          <button
            onClick={() => getApi()?.changeView("timeGridWeek")}
            className={`px-4 py-1.5 text-sm font-bold rounded-md ${currentView === "timeGridWeek" ? "bg-white shadow text-blue-600" : "text-gray-500"}`}
          >
            Tuần
          </button>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden relative grow bg-gray-50">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          locale={viLocale}
          events={events}
          height="720px"
          eventDisplay="block"
          eventContent={(arg) => (
            <div className="flex flex-col p-1 w-full leading-tight">
              <div className="font-bold text-[11px] truncate uppercase">
                {arg.event.title}
              </div>
              {arg.event.extendedProps.startTime && (
                <div className="text-[10px] mt-0.5 opacity-90 border-t border-white/20 pt-0.5">
                  {arg.event.extendedProps.startTime} -{" "}
                  {arg.event.extendedProps.endTime || "..."}
                </div>
              )}
            </div>
          )}
          eventClassNames={(arg) =>
            getEventClass(arg.event.extendedProps.status)
          }
          datesSet={handleDatesSet}
          eventClick={(info) => onScheduleClick?.(info.event.extendedProps.raw)}
        />
      </div>
    </div>
  );
});

ScheduleCalendar.displayName = "ScheduleCalendar";
export default ScheduleCalendar;
