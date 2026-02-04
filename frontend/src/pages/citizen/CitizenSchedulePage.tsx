import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Download,
  Truck,
  Leaf,
  Recycle,
  Trash2,
  AlertTriangle,
  Headset,
  MoreVertical,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { areaApi } from "@/features/area/api/areaApi";
import { areaKeys } from "@/features/area/utils/areaKeys";
import { useSchedules } from "@/features/schedule/hooks/useSchedules";
import {
  matchesRecurringRule,
  createRecurringRule,
  RecurrenceFrequency,
} from "@/features/schedule/utils/recurringHelper";

const CitizenSchedulePage: React.FC = () => {
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "list">("month");

  // Fetch danh sách khu vực
  const { data: areasData, isLoading: areasLoading } = useQuery({
    queryKey: areaKeys.list({ limit: 100 }),
    queryFn: () => areaApi.getAll({ limit: 100 }),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch lịch trình (chỉ khi chọn khu vực)
  const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
  const {
    schedules: schedulesData,
    isLoading: schedulesLoading,
    updateFilter,
  } = useSchedules(
    undefined,
    {
      startDate: month,
      areaId: selectedAreaId || undefined,
    },
    true,
  );

  // Cập nhật filter khi selectedAreaId thay đổi
  useEffect(() => {
    updateFilter("areaId", selectedAreaId || undefined);
  }, [selectedAreaId, updateFilter]);

  // Get display data
  const displaySchedulesData = schedulesData || [];

  console.log("displaySchedulesData", displaySchedulesData);

  // Tính toán ngày cho calendar
  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const prevLastDay = new Date(year, monthIndex, 0);

  const firstDayOfWeek = firstDay.getDay() || 7;
  const lastDayDate = lastDay.getDate();
  const prevDaysToShow = firstDayOfWeek - 1;

  const prevMonthDays = Array.from(
    { length: prevDaysToShow },
    (_, i) => prevLastDay.getDate() - prevDaysToShow + i + 1,
  );
  const calendarDays = Array.from({ length: lastDayDate }, (_, i) => i + 1);
  const remainingDays = 42 - (prevMonthDays.length + calendarDays.length);
  const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => i + 1);

  // Map schedules by date, handling recurring schedules
  const schedulesByDate = useMemo(() => {
    const map = new Map<number, any[]>();

    displaySchedulesData?.forEach((schedule) => {
      // Create recurring rule if frequency is provided
      const frequency = schedule.frequency as RecurrenceFrequency | undefined;

      if (
        frequency &&
        ["hàng_ngày", "hàng_tuần", "hàng_tháng"].includes(frequency)
      ) {
        // This is a recurring schedule - calculate which days in the current month it occurs
        const rule = createRecurringRule(schedule.scheduledDate, frequency);

        // Check each day in the current month
        for (let day = 1; day <= lastDayDate; day++) {
          const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          if (matchesRecurringRule(dateStr, rule)) {
            if (!map.has(day)) map.set(day, []);
            map.get(day)?.push(schedule);
          }
        }
      } else {
        // Non-recurring schedule - only show on its scheduled date
        const date = new Date(schedule.scheduledDate);
        const day = date.getDate();
        if (date.getMonth() === monthIndex && date.getFullYear() === year) {
          if (!map.has(day)) map.set(day, []);
          map.get(day)?.push(schedule);
        }
      }
    });

    return map;
  }, [displaySchedulesData, year, monthIndex, lastDayDate]);

  const selectedArea = areasData?.data?.find((a) => a.id === selectedAreaId);
  const monthStr = currentDate.toLocaleDateString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
    setSelectedDay(null);
  };

  // Get next upcoming schedule
  const nextSchedule = useMemo(() => {
    if (!displaySchedulesData || displaySchedulesData.length === 0) return null;

    const now = new Date();
    const upcomingSchedules = displaySchedulesData.filter((schedule) => {
      const scheduleDate = new Date(schedule.scheduledDate);
      return scheduleDate >= now;
    });

    if (upcomingSchedules.length === 0) return null;

    // Sort by date and return the first one (closest to now)
    return upcomingSchedules.sort((a, b) => {
      const dateA = new Date(a.scheduledDate);
      const dateB = new Date(b.scheduledDate);
      return dateA.getTime() - dateB.getTime();
    })[0];
  }, [displaySchedulesData]);

  // Get schedules for selected day or upcoming schedules
  const schedulesForDetailPanel = useMemo(() => {
    if (!displaySchedulesData || displaySchedulesData.length === 0) {
      return [];
    }

    if (selectedDay !== null) {
      // Filter schedules for selected day, including recurring schedules
      return displaySchedulesData.filter((schedule) => {
        const frequency = schedule.frequency as RecurrenceFrequency | undefined;

        // Check if it's a recurring schedule
        if (
          frequency &&
          ["hàng_ngày", "hàng_tuần", "hàng_tháng"].includes(frequency)
        ) {
          // Create recurring rule and check if selected day matches
          const rule = createRecurringRule(schedule.scheduledDate, frequency);
          const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
          return matchesRecurringRule(dateStr, rule);
        } else {
          // Non-recurring schedule - check if it's on the selected day
          const scheduleDate = new Date(schedule.scheduledDate);
          return (
            scheduleDate.getDate() === selectedDay &&
            scheduleDate.getMonth() === monthIndex &&
            scheduleDate.getFullYear() === year
          );
        }
      });
    }

    // If no day selected, show upcoming schedules
    const now = new Date();
    const upcomingSchedules = displaySchedulesData.filter((schedule) => {
      const scheduleDate = new Date(schedule.scheduledDate);
      return scheduleDate >= now;
    });

    return upcomingSchedules.sort((a, b) => {
      const dateA = new Date(a.scheduledDate);
      const dateB = new Date(b.scheduledDate);
      return dateA.getTime() - dateB.getTime();
    });
  }, [displaySchedulesData, selectedDay, monthIndex, year]);

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101822] text-[#111418] dark:text-white p-4 md:p-8 font-['Public_Sans',sans-serif]">
      <div className="mx-auto w-full flex flex-col gap-6">
        {/* Tiêu đề và Bộ lọc */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold tracking-tight">
              Lịch thu gom rác
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex flex-col gap-1 w-full sm:w-80">
              <div className="relative">
                <select
                  value={selectedAreaId}
                  onChange={(e) => setSelectedAreaId(e.target.value)}
                  disabled={areasLoading}
                  className="w-full appearance-none bg-white dark:bg-[#1a222d] border border-[#e5e7eb] dark:border-[#2a3441] text-[#111418] dark:text-white rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium cursor-pointer shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {areasLoading ? "Đang tải khu vực..." : "Chọn khu vực"}
                  </option>
                  {areasData?.data?.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                <ChevronLeft
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#60728a] pointer-events-none rotate-270"
                  size={20}
                />
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex bg-[#e5e7eb] dark:bg-[#2a3441] p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "month" ? "bg-white dark:bg-[#1a222d] text-[#111418] dark:text-white shadow-sm" : "text-[#60728a] hover:text-[#111418] dark:hover:text-white"}`}
                >
                  Lịch Tháng
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "list" ? "bg-white dark:bg-[#1a222d] text-[#111418] dark:text-white shadow-sm" : "text-[#60728a] hover:text-[#111418] dark:hover:text-white"}`}
                >
                  Danh Sách
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Cột Chính: Banner & Lịch */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Banner Thông báo Sắp tới */}
            {selectedAreaId && nextSchedule && (
              <div className="bg-gradient-to-br from-[#1973f0] to-[#4ba1f5] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute right-[-5%] top-[-10%] h-[150%] w-1/3 opacity-10 transform rotate-12 bg-white"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider backdrop-blur-md">
                        Sắp tới
                      </span>
                      <span className="text-white/80 text-sm font-medium">
                        {new Date(
                          nextSchedule.scheduledDate,
                        ).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">
                        {nextSchedule.startTime} — {nextSchedule.endTime}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-white/90 font-semibold text-lg">
                        <Leaf size={20} fill="currentColor" />
                        {nextSchedule.name || "Lịch thu gom"}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20 min-w-[160px] text-center shadow-inner">
                    <p className="text-[10px] text-white/70 uppercase font-black mb-1">
                      Trạng thái
                    </p>
                    <p className="text-xl font-bold flex items-center justify-center gap-2">
                      <Truck size={20} /> Sắp đến
                    </p>
                    <p className="text-xs text-white/80 mt-1 font-medium">
                      ~Sắp tới
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Component Lịch */}
            <div className="bg-white dark:bg-[#1a222d] rounded-2xl border border-[#e5e7eb] dark:border-[#2a3441] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e7eb] dark:border-[#2a3441]">
                <h3 className="font-bold text-xl">{monthStr}</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#344152] rounded-full transition-colors text-[#60728a]"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#344152] rounded-full transition-colors text-[#60728a]"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Tên các thứ */}
              <div className="grid grid-cols-7 border-b border-[#e5e7eb] dark:border-[#2a3441] bg-gray-50/50 dark:bg-[#1f2937]/50">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                  <div
                    key={day}
                    className="py-3 text-center text-xs font-bold text-[#60728a] dark:text-[#94a3b8] uppercase tracking-tighter"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Lưới ngày */}
              {!selectedAreaId ? (
                <div className="grid grid-cols-7 auto-rows-fr bg-[#e5e7eb] dark:bg-[#2a3441] gap-[1px]">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-[#1a222d] min-h-[110px] p-3 opacity-40"
                    >
                      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-600 w-full opacity-20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 auto-rows-fr bg-[#e5e7eb] dark:bg-[#2a3441] gap-[1px]">
                  {prevMonthDays.map((d) => (
                    <div
                      key={`p-${d}`}
                      className="bg-white dark:bg-[#1a222d] min-h-[110px] p-3 opacity-30 select-none"
                    >
                      <span className="text-sm font-medium">{d}</span>
                    </div>
                  ))}

                  {calendarDays.map((d) => {
                    const schedules = schedulesByDate.get(d) || [];
                    const today = new Date();
                    const isToday =
                      d === today.getDate() &&
                      monthIndex === today.getMonth() &&
                      year === today.getFullYear();
                    const isSelected = selectedDay === d;

                    return (
                      <div
                        key={d}
                        onClick={() => setSelectedDay(d)}
                        className={`bg-white dark:bg-[#1a222d] min-h-[110px] p-3 relative group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors ${schedulesLoading ? "cursor-default" : "cursor-pointer"} ${isToday ? "ring-2 ring-inset ring-[#1973f0] z-10 bg-blue-50/20 dark:bg-blue-900/5" : ""} ${isSelected ? "bg-blue-100 dark:bg-blue-900/20 ring-2 ring-blue-500" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-sm font-bold ${isToday || isSelected ? "text-[#1973f0]" : ""}`}
                          >
                            {d}
                          </span>
                          {isToday && (
                            <span className="text-[9px] font-black text-white bg-[#1973f0] px-1.5 py-0.5 rounded-full uppercase">
                              Hôm nay
                            </span>
                          )}
                        </div>

                        {schedulesLoading ? (
                          <div className="mt-2 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 w-full animate-pulse" />
                        ) : (
                          <div className="mt-2 flex flex-col gap-1.5">
                            {schedules.length > 0 ? (
                              schedules.map((schedule, idx) => (
                                <div
                                  key={idx}
                                  className="h-1.5 rounded-full bg-green-500 w-full"
                                  title={schedule.name || "Lịch thu gom"}
                                />
                              ))
                            ) : (
                              <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-600 w-full opacity-30" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {nextMonthDays.map((d) => (
                    <div
                      key={`n-${d}`}
                      className="bg-white dark:bg-[#1a222d] min-h-[110px] p-3 opacity-30 select-none"
                    >
                      <span className="text-sm font-medium">{d}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cột Phụ: Danh sách sắp tới */}
          <div className="flex flex-col gap-6">
            {/* Danh sách sự kiện sắp tới */}
            <div className="bg-white dark:bg-[#1a222d] rounded-2xl border border-[#e5e7eb] dark:border-[#2a3441] shadow-sm overflow-hidden flex flex-col flex-1">
              <div className="p-5 border-b border-[#e5e7eb] dark:border-[#2a3441] flex justify-between items-center">
                <div className="flex flex-col">
                  <h4 className="font-bold">Chi tiết lịch trình</h4>
                  {selectedDay && (
                    <p className="text-xs text-[#60728a] mt-1">
                      Ngày {selectedDay} tháng {monthIndex + 1}
                    </p>
                  )}
                </div>
                {!selectedAreaId && (
                  <p className="text-xs text-[#60728a]">Chọn khu vực để xem</p>
                )}
              </div>

              <div className="flex-1 divide-y divide-[#f0f2f5] dark:divide-[#2a3441]">
                {selectedAreaId &&
                schedulesForDetailPanel &&
                schedulesForDetailPanel.length > 0 ? (
                  schedulesForDetailPanel.slice(0, 5).map((schedule, i) => {
                    const scheduleDate = new Date(schedule.scheduledDate);
                    const day = scheduleDate.getDate();
                    const weekday = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][
                      scheduleDate.getDay()
                    ];
                    const today = new Date();
                    const isActive =
                      scheduleDate.toDateString() === today.toDateString();

                    return (
                      <div
                        key={i}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-[#202b3a] transition-all cursor-pointer flex gap-4 group"
                      >
                        <div
                          className={`flex flex-col items-center justify-center w-12 h-14 rounded-xl flex-shrink-0 font-bold transition-all ${isActive ? "bg-[#1973f0] text-white" : "bg-[#f0f2f5] dark:bg-[#2a3441] text-[#60728a]"}`}
                        >
                          <span className="text-[10px] opacity-80 uppercase leading-none mb-1">
                            {weekday}
                          </span>
                          <span className="text-lg leading-none">{day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold truncate">
                              {schedule.name || "Lịch thu gom"}
                            </p>
                            {isActive && (
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#60728a] dark:text-[#94a3b8] mt-0.5 font-medium">
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                          {isActive && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] font-bold rounded-full">
                              Đang vận hành
                            </span>
                          )}
                        </div>
                        <button className="text-[#60728a] hover:text-[#1973f0] transition-colors p-1 self-start opacity-0 group-hover:opacity-100">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center min-h-[200px] text-[#60728a]">
                    <p className="text-sm">
                      {selectedAreaId
                        ? selectedDay !== null
                          ? "Không có lịch trình trong ngày này"
                          : "Không có lịch trình sắp tới"
                        : "Vui lòng chọn khu vực"}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50/80 dark:bg-[#202b3a]/50 border-t border-[#e5e7eb] dark:border-[#2a3441]">
                <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-[#60728a] hover:text-[#1973f0] transition-all">
                  <Download size={16} /> Tải lịch PDF (.pdf)
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-6 pb-12 text-center border-t border-[#e5e7eb] dark:border-[#2a3441] pt-8">
          <p className="text-xs font-medium text-[#60728a] dark:text-[#94a3b8]">
            © 2024 Smart Waste Management System. Hệ thống quản lý rác thải
            thông minh.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CitizenSchedulePage;
