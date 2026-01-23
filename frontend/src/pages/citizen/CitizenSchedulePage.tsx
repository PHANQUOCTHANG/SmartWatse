import NextCollectionCard from "@/features/schedule/components/NextCollectionCard";
import CalendarGrid from "@/features/schedule/components/CalendarGrid";
import clsx from "clsx";

const UPCOMING_COLLECTIONS = [
  {
    date: "24",
    day: "T4",
    time: "17:00 - 18:30",
    type: "Rác hữu cơ",
    status: "Đang đến",
    color: "bg-green-500",
  },
  {
    date: "25",
    day: "T5",
    time: "17:00 - 18:30",
    type: "Rác hữu cơ",
    status: "Đang đến",
    color: "bg-green-500",
  },
  {
    date: "26",
    day: "T6",
    time: "08:00 - 09:30",
    type: "Rác tái chế",
    status: null,
    color: "bg-blue-500",
  },
  {
    date: "26",
    day: "T6",
    time: "17:00 - 18:30",
    type: "Rác hữu cơ",
    status: null,
    color: "bg-green-500",
  },
];

export default function CitizenSchedulePage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {/* FILTERS - RESPONSIVE */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase block">
                Khu vực đang xem
              </label>
              <select className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base">
                <option>Phường Bến Nghé, Quận 1</option>
                <option>Phường Bến Thành, Quận 1</option>
                <option>Phường Đa Kao, Quận 1</option>
              </select>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto gap-1">
              <button className="flex-1 sm:flex-none px-4 md:px-6 py-3 rounded-lg bg-white shadow-sm text-xs md:text-sm font-bold hover:shadow-md transition">
                Lịch Tháng
              </button>
              <button className="flex-1 sm:flex-none px-4 md:px-6 py-3 rounded-lg text-gray-500 text-xs md:text-sm font-bold hover:text-gray-800 hover:bg-gray-200 transition">
                Danh Sách
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT - RESPONSIVE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* LEFT SIDE - Calendar */}
          <div className="lg:col-span-2 space-y-6">
            <NextCollectionCard />
            <CalendarGrid />
          </div>

          {/* RIGHT SIDE - Legend & Upcoming */}
          <div className="space-y-6">
            {/* Legend Panel */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">info</span>
                Chú thích
              </h4>
              <div className="space-y-4">
                <LegendItem
                  color="bg-green-500"
                  label="Rác hữu cơ"
                  desc="Hàng ngày"
                />
                <LegendItem
                  color="bg-blue-500"
                  label="Rác tái chế"
                  desc="Thứ 3, Thứ 6"
                />
                <LegendItem
                  color="bg-orange-500"
                  label="Rác cồng kềnh"
                  desc="Ngày 12 hàng tháng"
                />
              </div>
            </div>

            {/* Upcoming Collections */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    schedule
                  </span>
                  Chi tiết sắp tới
                </span>
                <a
                  href="#"
                  className="text-primary text-sm font-bold hover:underline"
                >
                  Xem tất cả
                </a>
              </h4>
              <div className="space-y-3">
                {UPCOMING_COLLECTIONS.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-blue-400 bg-blue-50 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{item.day}</p>
                        <p className="text-sm font-bold text-gray-600 mt-1">
                          {item.date}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.time}
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {item.type}
                        </p>
                        {item.status && (
                          <p className="text-xs text-green-600 font-bold mt-1">
                            ✓ {item.status}
                          </p>
                        )}
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <span className="material-symbols-outlined text-lg">
                          more_vert
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-primary font-bold text-sm hover:bg-blue-50 rounded-lg transition">
                <span className="material-symbols-outlined">download</span>
                Tải lịch về máy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({
  color,
  label,
  desc,
}: {
  color: string;
  label: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={clsx("size-3 rounded-full shrink-0", color)} />
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-[10px] text-gray-400 font-medium">{desc}</p>
      </div>
    </div>
  );
}
