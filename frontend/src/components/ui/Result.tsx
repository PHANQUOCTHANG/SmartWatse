import React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  SearchX,
  LockKeyhole,
  WifiOff,
  Trash2,
  Truck,
  Wrench,
  Signal,
  MapPin,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Status chuẩn cho nghiệp vụ Quản lý rác thải & IoT
export type SmartWasteStatus =
  | "success" // Tác vụ thành công (đã thu gom, đã lưu)
  | "error" // Lỗi hệ thống
  | "critical" // Báo động đỏ (Quá tải, Cháy, Hỏng nặng)
  | "warning" // Cảnh báo (Sắp đầy >80%, Pin yếu)
  | "maintenance" // Đang bảo trì/sửa chữa
  | "offline" // Mất tín hiệu cảm biến
  | "empty" // Không có dữ liệu
  | "403"; // Không có quyền truy cập

interface SmartWasteResultProps {
  status?: SmartWasteStatus;
  isFullScreen?: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  image?: string; // Có thể là ảnh chụp thùng rác hoặc ảnh map
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: { label: string; onClick: () => void };
  children?: React.ReactNode;
  className?: string;
}

// Cấu hình Semantic cho Smart City
const getStatusConfig = (status: SmartWasteStatus) => {
  switch (status) {
    case "success":
      return {
        icon: CheckCircle2,
        // Màu Emerald/Teal đặc trưng cho Eco-Tech
        colorClass: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
        ring: "border-emerald-500/30",
        bgPattern: "bg-emerald-500/5",
      };
    case "critical":
    case "error":
      return {
        icon: Trash2, // Hoặc AlertOctagon
        // Màu Rose/Red cho báo động khẩn cấp
        colorClass: "text-rose-600 bg-rose-500/10 border-rose-500/20",
        ring: "border-rose-500/30",
        bgPattern: "bg-rose-500/5",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        // Màu Amber cho cảnh báo sắp đầy
        colorClass: "text-amber-600 bg-amber-500/10 border-amber-500/20",
        ring: "border-amber-500/30",
        bgPattern: "bg-amber-500/5",
      };
    case "maintenance":
      return {
        icon: Wrench,
        // Màu Blue/Indigo cho kỹ thuật/bảo trì
        colorClass: "text-blue-600 bg-blue-500/10 border-blue-500/20",
        ring: "border-blue-500/30",
        bgPattern: "bg-blue-500/5",
      };
    case "offline":
      return {
        icon: WifiOff,
        // Màu Slate/Gray thể hiện mất kết nối
        colorClass: "text-slate-500 bg-slate-500/10 border-slate-500/20",
        ring: "border-slate-500/30",
        bgPattern: "bg-slate-500/5",
      };
    case "403":
      return {
        icon: LockKeyhole,
        colorClass: "text-slate-600 bg-slate-200 border-slate-300",
        ring: "border-slate-400/30",
        bgPattern: "bg-slate-200/50",
      };
    case "empty":
    default:
      return {
        icon: SearchX, // Hoặc Info
        colorClass: "text-primary bg-primary/10 border-primary/20",
        ring: "border-primary/30",
        bgPattern: "bg-primary/5",
      };
  }
};

const SmartWasteResult: React.FC<SmartWasteResultProps> = ({
  status = "empty",
  isFullScreen = false,
  title,
  description,
  icon: customIcon,
  image,
  primaryAction,
  secondaryAction,
  children,
  className,
}) => {
  const {
    icon: DefaultIcon,
    colorClass,
    ring,
    bgPattern,
  } = getStatusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col items-center justify-center p-8 text-center overflow-hidden min-h-[450px]",
        // Border sắc nét hơn cho cảm giác Dashboard kỹ thuật
        isFullScreen
          ? "fixed inset-0 z-50 h-screen w-screen bg-background"
          : "w-full flex-1 bg-card/80 backdrop-blur-sm rounded-xl border border-border/60 shadow-sm",
        className,
      )}
    >
      {/* --- BACKGROUND LAYER: TECHNICAL GRID --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Lưới kỹ thuật (Dot Grid) */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 dark:opacity-[0.05]" />

        {/* Radar Effect (Quét sóng) */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl",
            bgPattern,
          )}
        />
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center gap-6">
        {/* 1. VISUAL LAYER (Image or Icon) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {image ? (
            <div className="relative group">
              {/* Khung ảnh kiểu Map/Camera feed */}
              <div className="w-56 h-40 sm:w-64 sm:h-48 rounded-lg overflow-hidden border border-border shadow-lg bg-muted relative">
                <img
                  src={image}
                  alt="Status visual"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                />
                {/* Overlay giả lập Camera Feed */}
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg" />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-white/80 bg-black/40 px-1 rounded">
                    REC
                  </span>
                </div>
              </div>

              {/* Icon trạng thái nhỏ gắn góc */}
              <div
                className={cn(
                  "absolute -bottom-4 -right-4 p-3 rounded-lg shadow-md border-2 border-card",
                  colorClass,
                )}
              >
                {customIcon || <DefaultIcon className="size-6" />}
              </div>
            </div>
          ) : (
            // ICON MODE (Technical HUD Style)
            <div className="relative">
              {/* Vòng tròn Radar lan tỏa */}
              {(status === "critical" ||
                status === "warning" ||
                status === "offline") && (
                <span
                  className={cn(
                    "absolute inset-0 rounded-full animate-ping opacity-20",
                    colorClass,
                  )}
                />
              )}

              <div
                className={cn(
                  "p-6 rounded-2xl border-2 shadow-lg backdrop-blur-xl relative z-10",
                  colorClass,
                  ring,
                )}
              >
                {customIcon || (
                  <DefaultIcon
                    className="size-12 sm:size-14"
                    strokeWidth={1.5}
                  />
                )}
              </div>

              {/* Decorative Lines (Tech feel) */}
              <div className="absolute top-1/2 -left-4 w-3 h-[1px] bg-border" />
              <div className="absolute top-1/2 -right-4 w-3 h-[1px] bg-border" />
            </div>
          )}
        </motion.div>

        {/* 2. CONTENT LAYER */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 px-4"
        >
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-balance uppercase font-mono">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground text-sm sm:text-base text-pretty max-w-sm mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>

        {/* 3. INJECTED CONTENT */}
        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full py-2 bg-muted/30 rounded-lg border border-border/50 p-4"
          >
            {children}
          </motion.div>
        )}

        {/* 4. ACTIONS LAYER */}
        {(primaryAction || secondaryAction) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full justify-center pt-4"
          >
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto min-w-[130px] border-slate-300 hover:bg-slate-50 text-slate-700"
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                onClick={primaryAction.onClick}
                className={cn(
                  "w-full sm:w-auto min-w-[150px] gap-2 shadow-md",
                  status === "critical"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : status === "success"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-primary hover:bg-primary/90",
                )}
              >
                {primaryAction.icon}
                {primaryAction.label}
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* FOOTER STATUS BAR (IoT Dashboard Style) */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-muted/50 border-t border-border flex items-center justify-between px-6 text-[10px] font-mono uppercase text-muted-foreground select-none">
        <div className="flex items-center gap-2">
          <Activity className="size-3 text-primary animate-pulse" />
          <span>System: Online</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Env: Production</span>
          <span className="flex items-center gap-1">
            <Signal className="size-3" />
            Gateway: Connected
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SmartWasteResult;
