import clsx from "clsx";
import { TaskBin } from "@/features/task/types/task-detail.type";

type Props = {
  bin: TaskBin;
  active?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
};

export default function TaskBinCard({
  bin,
  active,
  onToggle,
  children,
}: Props) {
  const isCompleted = bin.status === "COMPLETED";

  // Định nghĩa màu sắc dựa trên trạng thái (Status Color Mapping)
  const statusConfig = {
    OVERLOADED: {
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      text: "text-red-600",
      border: "border-red-200",
      icon: "delete",
      label: "Quá tải",
    },
    PENDING: {
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      text: "text-amber-600",
      border: "border-amber-200",
      icon: "delete",
      label: "Chờ thu gom",
    },
    COMPLETED: {
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-200",
      icon: "check_circle",
      label: "Đã xong",
    },
    ISSUE: {
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      text: "text-orange-600",
      border: "border-orange-200",
      icon: "report",
      label: "Sự cố",
    },
  };

  // Lấy config theo status, mặc định là PENDING nếu không khớp
  const config =
    statusConfig[bin.status as keyof typeof statusConfig] ||
    statusConfig.PENDING;

  return (
    <div
      className={clsx(
        "rounded-2xl overflow-hidden transition-all duration-300 border-2",
        active
          ? "border-blue-500 shadow-lg scale-[1.01]"
          : "border-transparent bg-white shadow-sm",
        !active && "hover:border-gray-200"
      )}
    >
      {/* HEADER */}
      <div
        onClick={onToggle}
        className={clsx(
          "p-4 flex items-start gap-4 cursor-pointer active:opacity-80"
        )}
      >
        {/* Icon container với màu sắc động */}
        <div
          className={clsx(
            "size-12 rounded-full flex items-center justify-center shrink-0 transition-colors",
            config.iconBg,
            config.text
          )}
        >
          <span className="material-symbols-outlined text-2xl font-light">
            {config.icon}
          </span>
        </div>

        {/* Thông tin thùng rác */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-gray-900 text-base">
              Thùng {bin.name}
            </h3>

            {/* Badge Trạng thái */}
            <span
              className={clsx(
                "text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1",
                config.bg,
                config.text
              )}
            >
              {bin.status === "OVERLOADED" && (
                <span className="material-symbols-outlined text-xs">
                  warning
                </span>
              )}
              {config.label}
            </span>
          </div>

          <p className="text-sm text-gray-500 line-clamp-1">{bin.address}</p>

          {/* Tags */}
          <div className="flex gap-2 mt-2">
            <span className="text-[11px] bg-gray-50 text-gray-400 px-2 py-1 rounded-md border border-gray-100">
              Rác hữu cơ
            </span>
            <span className="text-[11px] bg-gray-50 text-gray-400 px-2 py-1 rounded-md border border-gray-100">
              600L
            </span>
          </div>
        </div>

        {!active && !isCompleted && (
          <span className="material-symbols-outlined text-gray-300 self-center">
            chevron_right
          </span>
        )}
      </div>

      {/* Hành động khi Active */}
      {active && !isCompleted && (
        <div className="border-t border-gray-100 bg-white p-4 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
