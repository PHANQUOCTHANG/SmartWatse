/**
 * SMART WASTE UI KIT - LOADERS COLLECTION
 * ------------------------------------------------
 * Phong cách: Industrial IoT, Clean Tech, Smart City.
 * Bao gồm:
 * 1. SensorLoader: Kết nối IoT
 * 2. BinLoader: Tải dữ liệu thùng rác
 * 3. MapLoader: Định vị GPS
 * 4. RouteLoader: Tính lộ trình xe
 * 5. DataProcessingLoader: Xử lý chung
 * 6. AuthLoader: Đăng nhập/Bảo mật
 * 7. BrandLoader: Splash Screen
 */

import React from "react";
import {
  Truck,
  Wifi,
  Loader2,
  MapPin,
  Fingerprint,
  ShieldCheck,
  Hexagon,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Giả sử bạn có util này (clsx + tailwind-merge)

// ============================================================================
// 1. GLOBAL STYLES (Injected Scoped CSS)
// ============================================================================

const loaderStyles = `
  /* Radar Scan (Sensor) */
  @keyframes radar-scan {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Liquid Fill (Bin) */
  @keyframes fill-up {
    0% { height: 0%; opacity: 0.5; }
    50% { height: 70%; opacity: 1; }
    100% { height: 0%; opacity: 0.5; }
  }

  /* Truck Drive (Route) */
  @keyframes truck-drive {
    0% { transform: translateX(-20px); opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { transform: translateX(20px); opacity: 0; }
  }

  /* Signal Ripple (Map) */
  @keyframes signal-radiate {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  /* Pin Bounce (Map) */
  @keyframes map-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  /* Scan Vertical (Auth) */
  @keyframes scan-vertical {
    0% { top: 0%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  /* Logo Pulse (Brand) */
  @keyframes logo-pulse {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
    70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }

  /* Progress Bar (Brand) */
  @keyframes progress-loading {
    0% { width: 0%; }
    100% { width: 100%; }
  }

  .animate-radar { animation: radar-scan 3s linear infinite; }
  .animate-fill { animation: fill-up 2s ease-in-out infinite; }
  .animate-truck { animation: truck-drive 2s ease-in-out infinite; }
  .animate-signal { animation: signal-radiate 1.5s ease-out infinite; }
  .animate-bounce-slow { animation: map-bounce 1.5s ease-in-out infinite; }
  .animate-scan { animation: scan-vertical 2s linear infinite; }
  .animate-logo-pulse { animation: logo-pulse 2s infinite; }
  .animate-progress { animation: progress-loading 3s ease-out forwards; }
`;

export interface LoaderProps {
  fullscreen?: boolean;
  text?: React.ReactNode;
  subtext?: string;
  className?: string;
}

// Wrapper Component to handle Layout & CSS Injection
const LoaderContainer: React.FC<
  LoaderProps & { children: React.ReactNode }
> = ({ fullscreen, children, className = "" }) => {
  const layoutClass = fullscreen
    ? "fixed inset-0 z-[9999] bg-white/95 backdrop-blur-md"
    : "relative w-full h-full min-h-[200px] bg-transparent";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        layoutClass,
        className,
      )}
    >
      <style>{loaderStyles}</style>
      {children}
    </div>
  );
};

// ============================================================================
// 2. COMPONENTS EXPORT
// ============================================================================

/**
 * 1. SENSOR LOADER
 * Use case: Kết nối thiết bị IoT, xem chi tiết thùng rác Realtime.
 */
export const SensorLoader: React.FC<LoaderProps> = ({
  fullscreen,
  text = "Đang kết nối cảm biến...",
  subtext = "Đồng bộ dữ liệu IoT",
}) => (
  <LoaderContainer fullscreen={fullscreen}>
    <div className="relative flex items-center justify-center w-24 h-24 mb-4">
      {/* Radar rings */}
      <div className="absolute inset-0 border-2 border-emerald-100 rounded-full" />
      <div className="absolute inset-4 border-2 border-emerald-200 rounded-full" />

      {/* Scanning gradient */}
      <div className="absolute inset-0 rounded-full animate-radar bg-gradient-to-tr from-emerald-500/0 via-emerald-500/10 to-emerald-500/40" />

      {/* Center Icon */}
      <div className="relative z-10 bg-white p-3 rounded-full shadow-lg border border-emerald-100">
        <Wifi className="w-8 h-8 text-emerald-600" />
      </div>

      {/* Decor dots */}
      <div className="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
      <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
    </div>

    <div className="text-center space-y-1">
      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
        {text}
      </h4>
      {subtext && <p className="text-xs text-slate-400 font-mono">{subtext}</p>}
    </div>
  </LoaderContainer>
);

/**
 * 2. BIN CAPACITY LOADER
 * Use case: Tải danh sách thùng rác, Dashboard thống kê.
 */
export const BinLoader: React.FC<LoaderProps> = ({
  fullscreen,
  text = "Đang tải dữ liệu...",
  subtext,
}) => (
  <LoaderContainer fullscreen={fullscreen}>
    <div className="relative w-16 h-20 border-2 border-slate-300 rounded-b-lg rounded-t-sm mx-auto mb-4 bg-slate-50 overflow-hidden flex flex-col justify-end shadow-sm">
      {/* Lid */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-2 bg-slate-300 rounded-full" />

      {/* Filling Animation */}
      <div className="w-full bg-amber-400/80 animate-fill origin-bottom" />

      {/* Measure lines */}
      <div className="absolute top-4 w-full h-px bg-slate-200/50" />
      <div className="absolute top-10 w-full h-px bg-slate-200/50" />
      <div className="absolute top-16 w-full h-px bg-slate-200/50" />
    </div>

    <div className="text-center">
      <h4 className="text-sm font-semibold text-slate-700">{text}</h4>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  </LoaderContainer>
);

/**
 * 3. MAP LOADER
 * Use case: Tải bản đồ, tìm vị trí người dùng.
 */
export const MapLoader: React.FC<LoaderProps> = ({
  fullscreen,
  text = "Đang định vị...",
}) => (
  <LoaderContainer fullscreen={fullscreen}>
    <div className="relative flex items-center justify-center w-32 h-32 mb-2">
      {/* Ripples */}
      <div className="absolute bottom-6 w-12 h-4 bg-blue-500/20 rounded-[100%] animate-signal" />
      <div
        className="absolute bottom-6 w-12 h-4 bg-blue-500/20 rounded-[100%] animate-signal"
        style={{ animationDelay: "0.5s" }}
      />

      {/* Bouncing Pin */}
      <div className="animate-bounce-slow text-blue-600 drop-shadow-xl">
        <MapPin size={48} fill="currentColor" className="text-blue-600" />
      </div>
    </div>

    <p className="text-sm font-medium text-slate-600 animate-pulse">{text}</p>
  </LoaderContainer>
);

/**
 * 4. ROUTE LOADER
 * Use case: Tính toán lộ trình tối ưu, điều phối xe.
 */
export const RouteLoader: React.FC<LoaderProps> = ({
  fullscreen,
  text = "Đang tính lộ trình tối ưu...",
}) => (
  <LoaderContainer fullscreen={fullscreen}>
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-12 flex items-center justify-center overflow-hidden border-b-2 border-slate-200">
        <div className="animate-truck text-slate-700">
          <Truck size={32} />
        </div>

        {/* Road marks */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between px-2">
          <div className="w-4 h-0.5 bg-slate-300" />
          <div className="w-4 h-0.5 bg-slate-300" />
          <div className="w-4 h-0.5 bg-slate-300" />
        </div>
      </div>

      <p className="text-sm text-slate-600 font-mono mt-2">{text}</p>
    </div>
  </LoaderContainer>
);

/**
 * 5. DATA PROCESSING LOADER
 * Use case: Xử lý dữ liệu nhẹ, submit form đơn giản.
 */
export const DataProcessingLoader: React.FC<LoaderProps> = ({
  fullscreen,
  text = "Đang xử lý...",
}) => (
  <LoaderContainer fullscreen={fullscreen}>
    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-slate-100">
      <Loader2 className="animate-spin text-emerald-600" size={20} />
      <span className="text-sm font-medium text-slate-700">{text}</span>
    </div>
  </LoaderContainer>
);

/**
 * 6. AUTH LOADER
 * Use case: Đăng nhập, verify token, kiểm tra quyền Admin.
 */
export const AuthLoader: React.FC<LoaderProps> = ({
  fullscreen,
  text = "Đang xác thực...",
  subtext = "Verifying Credentials",
}) => (
  <LoaderContainer fullscreen={fullscreen}>
    <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
      {/* Frame */}
      <div className="absolute inset-0 border-2 border-slate-200 rounded-xl" />

      {/* HUD Corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-500 -mt-0.5 -ml-0.5 rounded-tl-md" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-500 -mt-0.5 -mr-0.5 rounded-tr-md" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-500 -mb-0.5 -ml-0.5 rounded-bl-md" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-500 -mb-0.5 -mr-0.5 rounded-br-md" />

      {/* Fingerprint Icon */}
      <div className="relative z-10 text-slate-300">
        <Fingerprint size={48} strokeWidth={1} />
      </div>

      {/* Scanning Bar */}
      <div className="absolute left-1 right-1 h-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-scan z-20" />
    </div>

    <div className="text-center">
      <h4 className="text-sm font-bold text-slate-700 tracking-wider">
        {text}
      </h4>
      <div className="flex items-center justify-center gap-2 mt-1">
        <ShieldCheck size={12} className="text-emerald-600" />
        <p className="text-[10px] text-slate-400 font-mono uppercase">
          {subtext}
        </p>
      </div>
    </div>
  </LoaderContainer>
);

/**
 * 7. BRAND LOADER
 * Use case: Splash screen, Khởi động ứng dụng lần đầu.
 */
export const BrandLoader: React.FC<LoaderProps> = ({
  fullscreen = true,
  text = "SMART WASTE",
  subtext = "Urban Management System",
}) => (
  <LoaderContainer fullscreen={fullscreen} className="bg-slate-50">
    {/* Tech Grid Background */}
    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[20px_20px] opacity-20 pointer-events-none" />

    <div className="relative z-10 flex flex-col items-center">
      {/* Logo Wrapper */}
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
        {/* Pulse Effect */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-logo-pulse" />

        {/* Hexagon Base */}
        <Hexagon
          className="absolute inset-0 text-slate-900 fill-slate-900"
          size={96}
          strokeWidth={1}
        />

        {/* Leaf Icon */}
        <Leaf
          className="relative z-10 text-emerald-400 fill-emerald-400 drop-shadow-md"
          size={40}
        />

        {/* Tech Dot */}
        <div className="absolute top-2 right-6 w-1.5 h-1.5 bg-white rounded-full z-20" />
      </div>

      {/* Brand Text */}
      <h1 className="text-3xl font-black text-slate-800 tracking-tighter mb-1">
        {text}
      </h1>
      <p className="text-xs font-bold text-emerald-600 tracking-[0.2em] uppercase mb-8">
        {subtext}
      </p>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 animate-progress rounded-full" />
      </div>
    </div>
  </LoaderContainer>
);
