import { ClipboardList, Truck, AlertTriangle } from "lucide-react";

const stats = [
  {
    label: "Tổng nhiệm vụ hôm nay",
    value: 12,
    icon: ClipboardList,
    tone: "blue",
  },
  {
    label: "Đang thực hiện",
    value: 3,
    icon: Truck,
    tone: "yellow",
  },
  {
    label: "Cảnh báo khẩn cấp",
    value: 2,
    icon: AlertTriangle,
    tone: "red",
    badge: "+1 mới",
  },
];

export default function ScheduleStats() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((s) => {
        const Icon = s.icon;

        return (
          <div
            key={s.label}
            className={`
              rounded-xl border p-5
              ${
                s.tone === "red"
                  ? "border-red-200 bg-red-50"
                  : "border-gray-200 bg-white"
              }
            `}
          >
            <div className="flex items-center justify-between">
              {/* Text */}
              <div>
                <div className="text-sm text-gray-500">{s.label}</div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="text-2xl font-semibold text-gray-900">
                    {s.value}
                  </div>

                  {s.badge && (
                    <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      {s.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Icon */}
              <div
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full
                  ${
                    s.tone === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : s.tone === "yellow"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }
                `}
              >
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
