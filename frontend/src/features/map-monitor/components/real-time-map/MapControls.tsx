import React, { useState, useMemo } from "react";
import {
  Layers,
  Truck,
  Trash2,
  Map as MapIcon,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  EyeOff,
  Crosshair,
  Navigation,
  MapPin,
  ArrowRight,
  Settings2,
  Milestone,
  LocateFixed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  toggleLayer,
  fetchMapData,
  clearRoute,
  setRoute,
} from "@/features/map-monitor/slice/mapSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- HELPER: Haversine Distance ---
const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Earth radius (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// --- TYPES ---
type RouteMode = "QUICK" | "ADVANCED";
type StartPointType = "USER" | "VEHICLE";
type EndPointType = "NEAREST_BIN" | "NEAREST_POINT" | "NEAREST_VEHICLE";

const MapControls = () => {
  const dispatch = useAppDispatch();
  const map = useMap();
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"LAYERS" | "ROUTE">("LAYERS");

  // Route State
  const [startType, setStartType] = useState<StartPointType>("USER");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [isLocating, setIsLocating] = useState(false);

  // Redux Data
  const { layers, vehicles, bins, points, areas, isLoading } = useAppSelector(
    (state) => state.map,
  );

  // --- STATS ---
  const vehicleList = Object.values(vehicles);
  const activeVehicles = vehicleList.filter((v) => v.status === "IN_USE");

  // --- HANDLERS ---

  // 1. Get User Location
  const handleLocateMe = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ Geolocation");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserLocation(coords);
        map.flyTo(coords, 16);
        setIsLocating(false);
      },
      () => {
        alert("Không thể lấy vị trí.");
        setIsLocating(false);
      },
    );
  };

  // 2. Advanced Routing (A -> B)
  const handleCalculateRoute = (targetType: EndPointType) => {
    // A. Xác định điểm bắt đầu (Start Point)
    let startCoords: [number, number] | null = null;
    let startEntityId: string | undefined = undefined;

    if (startType === "USER") {
      if (!userLocation) {
        alert("Vui lòng lấy vị trí của bạn trước!");
        return;
      }
      startCoords = userLocation;
    } else if (startType === "VEHICLE") {
      const vehicle = vehicles[selectedVehicleId];
      if (!vehicle) {
        alert("Vui lòng chọn xe để bắt đầu!");
        return;
      }
      startCoords = [vehicle.coordinates.lat, vehicle.coordinates.lng];
      startEntityId = vehicle.id;
    }

    if (!startCoords) return;

    // B. Tìm điểm đích gần nhất (Nearest Neighbor Search)
    let nearestItem: any = null;
    let minDistance = Infinity;
    let itemsToScan: any[] = [];

    switch (targetType) {
      case "NEAREST_BIN":
        // Chỉ tìm thùng đầy
        itemsToScan = Object.values(bins).filter((b) => b.status === "FULL");
        break;
      case "NEAREST_POINT":
        itemsToScan = points;
        break;
      case "NEAREST_VEHICLE":
        // Tìm xe khác (trừ chính nó)
        itemsToScan = Object.values(vehicles).filter(
          (v) => v.id !== startEntityId,
        );
        break;
    }

    if (itemsToScan.length === 0) {
      alert("Không tìm thấy mục tiêu phù hợp (VD: Không có thùng rác đầy).");
      return;
    }

    // Quét tìm min distance
    itemsToScan.forEach((item) => {
      const lat = item.latitude || item.coordinates?.lat;
      const lng = item.longitude || item.coordinates?.lng;
      if (lat && lng) {
        const dist = getDistance(startCoords![0], startCoords![1], lat, lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearestItem = item;
        }
      }
    });

    // C. Dispatch Route
    if (nearestItem) {
      const targetLat = nearestItem.latitude || nearestItem.coordinates.lat;
      const targetLng = nearestItem.longitude || nearestItem.coordinates.lng;

      dispatch(
        setRoute({
          start: startCoords,
          end: [targetLat, targetLng],
          vehicleId: startType === "VEHICLE" ? startEntityId : undefined, // Gắn ID xe nếu là xe chạy
        }),
      );

      // Zoom fit bounds
      map.fitBounds([startCoords, [targetLat, targetLng]], {
        padding: [80, 80],
      });
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 w-80 overflow-hidden flex flex-col font-sans transition-all duration-300">
      {/* HEADER WITH TABS */}
      <div className="bg-slate-50 border-b">
        <div
          className="p-3 flex justify-between items-center cursor-pointer hover:bg-slate-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 text-white rounded-md shadow-sm">
              <Settings2 size={16} />
            </div>
            <span className="font-bold text-sm text-slate-800">
              Control Panel
            </span>
          </div>
          <button className="text-slate-400">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {isOpen && (
          <div className="flex px-1">
            <TabButton
              active={activeTab === "LAYERS"}
              onClick={() => setActiveTab("LAYERS")}
              label="Lớp bản đồ"
              icon={<Layers size={14} />}
            />
            <TabButton
              active={activeTab === "ROUTE"}
              onClick={() => setActiveTab("ROUTE")}
              label="Điều hướng"
              icon={<Navigation size={14} />}
            />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="p-3 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {/* === TAB 1: LAYERS === */}
          {activeTab === "LAYERS" && (
            <>
              <div className="space-y-3">
                <LayerCard
                  active={layers.vehicles}
                  onClick={() => dispatch(toggleLayer("vehicles"))}
                  icon={<Truck size={16} />}
                  color="bg-blue-500"
                  label="Đội xe"
                  badge={`${activeVehicles.length} đang chạy`}
                />
                <LayerCard
                  active={layers.bins}
                  onClick={() => dispatch(toggleLayer("bins"))}
                  icon={<Trash2 size={16} />}
                  color="bg-green-500"
                  label="Thùng rác"
                  badge={`${Object.values(bins).filter((b) => b.status === "FULL").length} báo đầy`}
                  badgeColor="bg-red-100 text-red-600"
                />
                <LayerCard
                  active={layers.areas}
                  onClick={() => dispatch(toggleLayer("areas"))}
                  icon={<MapIcon size={16} />}
                  color="bg-purple-500"
                  label="Khu vực"
                  badge={`${areas.length} vùng`}
                />
              </div>
              <hr className="border-slate-100" />
              <div className="flex gap-2">
                <ActionButton
                  onClick={() => {
                    dispatch(fetchMapData());
                    dispatch(clearRoute());
                  }}
                  icon={
                    <RefreshCw
                      size={14}
                      className={isLoading ? "animate-spin" : ""}
                    />
                  }
                  label="Làm mới"
                  className="flex-1 bg-slate-100"
                />
                <ActionButton
                  onClick={() => {
                    dispatch(clearRoute());
                  }}
                  icon={<EyeOff size={14} />}
                  className="w-10 bg-slate-100 hover:text-red-600"
                />
              </div>
            </>
          )}

          {/* === TAB 2: ROUTING (NEW) === */}
          {activeTab === "ROUTE" && (
            <div className="space-y-4">
              {/* START POINT SELECTION */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <LocateFixed size={12} /> Điểm xuất phát (A)
                </label>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <TypeButton
                    active={startType === "USER"}
                    onClick={() => setStartType("USER")}
                    label="Vị trí tôi"
                    icon={<Crosshair size={14} />}
                  />
                  <TypeButton
                    active={startType === "VEHICLE"}
                    onClick={() => setStartType("VEHICLE")}
                    label="Chọn xe"
                    icon={<Truck size={14} />}
                  />
                </div>

                {startType === "USER" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-xs",
                      userLocation
                        ? "text-green-600 border-green-200 bg-green-50"
                        : "text-slate-500",
                    )}
                    onClick={handleLocateMe}
                  >
                    <Crosshair
                      size={14}
                      className={cn("mr-2", isLocating && "animate-spin")}
                    />
                    {userLocation
                      ? `Đã lấy: ${userLocation[0].toFixed(4)}, ...`
                      : "Nhấn để lấy GPS hiện tại"}
                  </Button>
                ) : (
                  <Select
                    onValueChange={setSelectedVehicleId}
                    value={selectedVehicleId}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Chọn xe để điều phối..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activeVehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id} className="text-xs">
                          {v.plateNumber} - {v.driverName}
                        </SelectItem>
                      ))}
                      {activeVehicles.length === 0 && (
                        <div className="p-2 text-xs text-slate-400">
                          Không có xe đang hoạt động
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowRight size={16} className="rotate-90" />
              </div>

              {/* END POINT ACTIONS */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Milestone size={12} /> Đích đến (B)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <RouteTargetButton
                    icon={<Trash2 size={14} />}
                    label="Đến thùng đầy gần nhất"
                    sub="Tối ưu thu gom rác"
                    onClick={() => handleCalculateRoute("NEAREST_BIN")}
                  />
                  <RouteTargetButton
                    icon={<MapPin size={14} />}
                    label="Đến điểm tập kết gần nhất"
                    sub="Tối ưu đường về trạm"
                    onClick={() => handleCalculateRoute("NEAREST_POINT")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- SUB COMPONENTS (STYLED) ---

const TabButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold border-b-2 transition-all",
      active
        ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50",
    )}
  >
    {icon} {label}
  </button>
);

const TypeButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-bold transition-all",
      active
        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
    )}
  >
    {icon} {label}
  </button>
);

const RouteTargetButton = ({ icon, label, sub, onClick }: any) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm transition-all group text-left"
  >
    <div className="p-2 bg-slate-100 rounded-full text-slate-600 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
      {icon}
    </div>
    <div>
      <div className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">
        {label}
      </div>
      <div className="text-[10px] text-slate-400">{sub}</div>
    </div>
  </button>
);

const LayerCard = ({
  active,
  onClick,
  icon,
  color,
  label,
  badge,
  badgeColor,
}: any) => (
  <div
    onClick={onClick}
    className={cn(
      "relative flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer select-none",
      active
        ? "bg-white border-slate-200 shadow-sm"
        : "bg-slate-50 border-transparent opacity-60 grayscale-[0.5]",
    )}
  >
    <div
      className={cn(
        "p-1.5 rounded-lg text-white shadow-sm",
        active ? color : "bg-slate-400",
      )}
    >
      {icon}
    </div>
    <div className="flex-1 flex justify-between items-center">
      <span
        className={cn(
          "text-xs font-bold",
          active ? "text-slate-800" : "text-slate-500",
        )}
      >
        {label}
      </span>
      {active && badge && (
        <Badge
          variant="secondary"
          className={cn("text-[10px] px-1.5 h-5", badgeColor)}
        >
          {badge}
        </Badge>
      )}
    </div>
  </div>
);

const ActionButton = ({ icon, label, onClick, className }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-bold transition-all active:scale-95 text-slate-600 hover:bg-slate-200",
      className,
    )}
  >
    {icon} {label && <span>{label}</span>}
  </button>
);

export default MapControls;
