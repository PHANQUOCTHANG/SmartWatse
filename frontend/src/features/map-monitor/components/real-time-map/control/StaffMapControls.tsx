import React, { useState, useEffect, useMemo } from "react";
import {
  Navigation,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Fuel,
  Weight,
  Menu,
  X,
  Crosshair,
  ArrowRight,
  Clock,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setRoute, clearRoute } from "@/features/map-monitor/slice/mapSlice";
import { useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // Giả sử bạn có component này hoặc dùng div

// --- TYPES & MOCK ---
// Giả lập Interface nhiệm vụ
interface StaffTask {
  id: string;
  address: string;
  type: "BIN" | "POINT";
  status: "PENDING" | "FULL";
  priority: "HIGH" | "NORMAL";
  coordinates: [number, number];
}

const StaffMapControls = () => {
  const dispatch = useAppDispatch();
  const map = useMap();
  const [isOpen, setIsOpen] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  // Lấy dữ liệu từ Redux
  const { vehicles, bins, activeRoute } = useAppSelector((state) => state.map);
  const { user } = useAppSelector((state) => state.auth);

  // 1. Giả lập: Lấy xe của Staff đang đăng nhập
  // Trong thực tế: const myVehicle = vehicles[user?.vehicleId];
  const myVehicle =
    Object.values(vehicles).find((v) => v.status === "IN_USE") ||
    Object.values(vehicles)[0];

  // 2. Giả lập: Tìm nhiệm vụ tiếp theo (Thùng rác đầy gần nhất)
  const nextTask: StaffTask | null = useMemo(() => {
    const fullBins = Object.values(bins).filter((b) => b.status === "FULL");
    if (fullBins.length === 0) return null;
    // Lấy thùng đầu tiên làm ví dụ
    const target = fullBins[0];
    return {
      id: target.id,
      address: target.address || "Điểm thu gom chưa định danh",
      type: "BIN",
      status: "FULL",
      priority: "HIGH",
      coordinates: [target.latitude, target.longitude], // Cần đảm bảo data có lat/lng
    };
  }, [bins]);

  // --- HANDLERS ---

  const handleNavigate = () => {
    if (!myVehicle || !nextTask) return;

    setIsNavigating(true);
    // Dispatch vẽ đường từ Xe -> Nhiệm vụ
    dispatch(
      setRoute({
        start: [myVehicle.coordinates.lat, myVehicle.coordinates.lng],
        end: nextTask.coordinates,
        vehicleId: myVehicle.id,
      }),
    );

    // Zoom map để thấy cả 2 điểm
    map.fitBounds(
      [
        [myVehicle.coordinates.lat, myVehicle.coordinates.lng],
        nextTask.coordinates,
      ],
      { padding: [50, 50] },
    );
  };

  const handleCompleteTask = () => {
    // Gọi API update status thùng rác
    alert(`Đã thu gom tại: ${nextTask?.address}`);
    dispatch(clearRoute());
    setIsNavigating(false);
  };

  const handleLocateVehicle = () => {
    if (myVehicle) {
      map.flyTo([myVehicle.coordinates.lat, myVehicle.coordinates.lng], 18);
    }
  };

  if (!myVehicle) return null;

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-3 max-h-[calc(100vh-100px)]">
      {/* 1. VEHICLE HUD (Head-Up Display) */}
      <div className="bg-slate-900/90 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-slate-700 w-80 animate-in slide-in-from-left-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Truck size={16} className="text-white" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">
                Phương tiện
              </div>
              <div className="font-mono font-bold text-sm">
                {myVehicle.plateNumber}
              </div>
            </div>
          </div>
          <Badge
            variant={myVehicle.status === "IN_USE" ? "default" : "secondary"}
            className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
          >
            Online
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Tải trọng */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span className="flex items-center gap-1">
                <Weight size={10} /> Tải trọng
              </span>
              <span>{myVehicle.currentLoad}%</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  myVehicle.currentLoad > 80 ? "bg-red-500" : "bg-blue-500",
                )}
                style={{ width: `${myVehicle.currentLoad}%` }}
              />
            </div>
          </div>

          {/* Nhiên liệu */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span className="flex items-center gap-1">
                <Fuel size={10} /> Nhiên liệu
              </span>
              <span>{myVehicle.fuelLevel}%</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  myVehicle.fuelLevel < 20 ? "bg-orange-500" : "bg-emerald-500",
                )}
                style={{ width: `${myVehicle.fuelLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. TASK PANEL (Collapsible) */}
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 w-80 overflow-hidden font-sans transition-all duration-300">
        {/* Header Toggle */}
        <div
          className="bg-indigo-600 p-3 flex justify-between items-center cursor-pointer text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Menu size={16} />
            <span>Nhiệm vụ hiện tại</span>
          </div>
          {isOpen ? <X size={16} /> : <ArrowRight size={16} />}
        </div>

        {isOpen && (
          <div className="p-3 space-y-4 animate-in slide-in-from-top-2">
            {nextTask ? (
              <>
                {/* Task Info */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 border border-red-200 shadow-sm">
                        <MapPin size={16} fill="currentColor" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 border-red-200 text-red-600 bg-red-50"
                        >
                          QUÁ TẢI
                        </Badge>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> 10:30 AM
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 leading-tight mt-1">
                        {nextTask.address}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Cách đây ~1.2km
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {!isNavigating ? (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md active:scale-95 transition-all"
                      onClick={handleNavigate}
                    >
                      <Navigation size={16} className="mr-2" />
                      Dẫn đường
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      className="w-full font-bold shadow-md active:scale-95 transition-all"
                      onClick={() => {
                        dispatch(clearRoute());
                        setIsNavigating(false);
                      }}
                    >
                      <X size={16} className="mr-2" />
                      Hủy lộ trình
                    </Button>
                  )}

                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md active:scale-95 transition-all"
                    onClick={handleCompleteTask}
                  >
                    <CheckCircle2 size={16} className="mr-2" />
                    Đã xong
                  </Button>
                </div>

                {/* Secondary Actions */}
                <div className="pt-2 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-slate-500 hover:text-orange-600 hover:bg-orange-50 justify-start h-8 px-2"
                  >
                    <AlertTriangle size={14} className="mr-2" />
                    Báo cáo sự cố (Kẹt xe, Hỏng hóc)
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 size={24} className="text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-slate-600">Tuyệt vời!</p>
                <p className="text-xs">Không còn thùng rác nào cần thu gom.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. QUICK MAP ACTIONS (Floating) */}
      <div className="flex gap-2">
        <TooltipButton
          icon={<Crosshair size={18} />}
          label="Vị trí xe"
          onClick={handleLocateVehicle}
        />
        <TooltipButton
          icon={<Layers size={18} />}
          label="Lớp bản đồ"
          onClick={() => {}} // Toggle Layer logic here
        />
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const TooltipButton = ({ icon, label, onClick }: any) => (
  <button
    onClick={onClick}
    className="bg-white p-2.5 rounded-xl shadow-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 active:scale-95 transition-all group relative"
  >
    {icon}
    {/* Tooltip on hover */}
    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {label}
    </span>
  </button>
);

export default StaffMapControls;
