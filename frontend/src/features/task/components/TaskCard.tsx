import clsx from "clsx";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    address: string;
    status: string;
    timeAgo: string;
    lat: number;
    lng: number;
  };
}

export default function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/staff/tasks/${task.id}`);
  };
  const renderStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; bg: string; icon: string }> =
      {
        OVERLOADED: { label: "Quá tải", bg: "bg-red-500", icon: "warning" },
        FULL: { label: "Sắp đầy", bg: "bg-amber-500", icon: "priority_high" },
        SCHEDULED: { label: "Định kỳ", bg: "bg-blue-500", icon: "event" },
        COMPLETED: { label: "Hoàn thành", bg: "bg-gray-400", icon: "check" },
      };
    const config = configs[status] || configs.SCHEDULED;

    return (
      <div
        className={clsx(
          "absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg z-10",
          config.bg
        )}
      >
        <span className="material-symbols-outlined text-[12px]">
          {config.icon}
        </span>
        {config.label}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      {/* Map Preview Area */}
      <div className="h-40 bg-gray-200 relative overflow-hidden">
        <img
          src={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s+ff0000(${task.lng},${task.lat})/${task.lng},${task.lat},14/400x200?access_token=YOUR_MAPBOX_TOKEN`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt="Map preview"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x200?text=Map+Preview";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 text-white text-[10px] font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
          ID: {task.id}
        </div>
        {renderStatusBadge(task.status)}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">
          {task.title}
        </h3>
        <div className="flex items-start gap-2 text-gray-500 mb-4">
          <span className="material-symbols-outlined text-sm mt-0.5 text-primary">
            location_on
          </span>
          <p className="text-xs line-clamp-2">{task.address}</p>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-[11px] mb-5 font-medium">
          <span className="material-symbols-outlined text-sm">schedule</span>
          Giao {task.timeAgo}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleViewDetail}
            className="bg-primary text-white py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
          >
            Xem chi tiết
          </button>
          <button className="bg-gray-50 text-gray-700 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 border border-gray-100 active:scale-95">
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}
