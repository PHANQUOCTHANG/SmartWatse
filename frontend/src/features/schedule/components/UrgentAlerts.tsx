import { AlertTriangle, Navigation } from "lucide-react";

const alerts = [
  {
    id: 1,
    title: "Thùng #102 – Quá tải",
    location: "Khu vực 4, Đường Nguyễn Trãi, Dã báo cao 15p trước",
    percentage: 98,
    color: "red",
  },
  {
    id: 2,
    title: "Thùng #45 – Sắp đầy",
    location: "Khu vực 1, Công viên trung tâm",
    percentage: 89,
    color: "yellow",
  },
];

export default function UrgentAlerts() {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={18} className="text-red-600" />
        <h3 className="text-sm font-semibold text-red-700">CẦN XỬ LÝ NGAY</h3>
      </div>

      {/* Alert items */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-lg border ${alert.color === "red" ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"} p-4`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div
                  className={`text-sm font-medium ${alert.color === "red" ? "text-red-900" : "text-yellow-900"}`}
                >
                  {alert.title}
                </div>
                <div
                  className={`text-xs mt-0.5 ${alert.color === "red" ? "text-red-600" : "text-yellow-600"}`}
                >
                  {alert.location}
                </div>
              </div>

              <span
                className={`text-xs font-semibold ${alert.color === "red" ? "text-red-600 bg-red-100" : "text-yellow-600 bg-yellow-100"} px-2 py-0.5 rounded-full`}
              >
                {alert.percentage}%
              </span>
            </div>

            <button
              className={`
                w-full
                flex items-center justify-center gap-2
                text-sm font-medium
                rounded-lg
                text-white
                transition
                h-9
                ${alert.color === "red" ? "bg-red-600 hover:bg-red-700" : "bg-yellow-500 hover:bg-yellow-600"}
              `}
            >
              <Navigation size={14} />
              Điều phối xe ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
