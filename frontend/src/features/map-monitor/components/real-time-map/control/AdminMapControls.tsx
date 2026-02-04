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
  Activity,
  AlertTriangle,
  Cpu,
  Route,
  Waypoints,
  Calculator,
  Navigation,
  MapPin,
  ArrowRightLeft,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  toggleLayer,
  fetchMapData,
  clearRoute,
  setRoute,
} from "@/features/map-monitor/slice/mapSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMap } from "react-leaflet";
import L from "leaflet";

// UI Components
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// --- HELPER: Haversine Distance ---
const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const AdminMapControls = () => {
  const dispatch = useAppDispatch();
  const map = useMap();
  const [isOpen, setIsOpen] = useState(true);

  // State
  const [selectedStartId, setSelectedStartId] = useState<string>("");
  const [selectedEndId, setSelectedEndId] = useState<string>("");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");

  // Redux Data
  const { layers, vehicles, bins, areas, points, activeRoute, isLoading } =
    useAppSelector((state) => state.map);

  // Stats
  const stats = useMemo(
    () => ({
      totalVehicles: Object.keys(vehicles).length,
      activeVehicles: Object.values(vehicles).filter(
        (v) => v.status === "IN_USE",
      ).length,
      totalBins: Object.keys(bins).length,
      criticalBins: Object.values(bins).filter(
        (b) => b.status === "FULL" || b.status === "OVERFLOW",
      ).length,
      totalAreas: areas.length,
    }),
    [vehicles, bins, areas],
  );

  const activeVehiclesList = useMemo(
    () => Object.values(vehicles).filter((v) => v.status === "IN_USE"),
    [vehicles],
  );
  const fullBinsList = useMemo(
    () =>
      Object.values(bins).filter(
        (b) => b.status === "FULL" || b.status === "OVERFLOW",
      ),
    [bins],
  );

  // --- HANDLERS ---
  const handleCalculateRoute = () => {
    const startObj = vehicles[selectedStartId] || bins[selectedStartId];
    const endObj =
      bins[selectedEndId] ||
      vehicles[selectedEndId] ||
      points?.find((p) => p.id === selectedEndId);

    if (!startObj || !endObj) {
      toast.error("Điểm chọn không hợp lệ!");
      return;
    }

    const getCoords = (obj: any): [number, number] => {
      if (obj.latitude && obj.longitude) return [obj.latitude, obj.longitude];
      if (obj.coordinates?.lat)
        return [obj.coordinates.lat, obj.coordinates.lng];
      if (obj.location?.coordinates)
        return [obj.location.coordinates[1], obj.location.coordinates[0]];
      return [0, 0];
    };

    const startCoords = getCoords(startObj);
    const endCoords = getCoords(endObj);

    if (startCoords[0] === 0 || endCoords[0] === 0) {
      toast.error("Tọa độ không hợp lệ");
      return;
    }

    dispatch(
      setRoute({
        start: startCoords,
        end: endCoords,
        vehicleId: selectedStartId.startsWith("veh")
          ? selectedStartId
          : undefined,
      }),
    );
    map.fitBounds([startCoords, endCoords], { padding: [50, 50] });
  };

  const handleFindNearestFullBin = () => {
    if (!selectedStartId) {
      toast.error("Chọn xe trước!");
      return;
    }
    const startVehicle = vehicles[selectedStartId];
    if (!startVehicle) return;

    const startLat = startVehicle.coordinates.lat;
    const startLng = startVehicle.coordinates.lng;
    let minDistance = Infinity;
    let nearestBinId = "";

    fullBinsList.forEach((bin) => {
      if (bin.latitude && bin.longitude) {
        const dist = getDistance(
          startLat,
          startLng,
          bin.latitude,
          bin.longitude,
        );
        if (dist < minDistance) {
          minDistance = dist;
          nearestBinId = bin.id;
        }
      }
    });

    if (nearestBinId) {
      setSelectedEndId(nearestBinId);
      const targetBin = bins[nearestBinId];
      dispatch(
        setRoute({
          start: [startLat, startLng],
          end: [targetBin.latitude, targetBin.longitude],
          vehicleId: selectedStartId,
        }),
      );
      map.fitBounds(
        [
          [startLat, startLng],
          [targetBin.latitude, targetBin.longitude],
        ],
        { padding: [50, 50] },
      );
      toast.success(`Đã tìm thấy thùng gần nhất: ${minDistance.toFixed(2)}km`);
    } else {
      toast.info("Không có thùng rác đầy nào gần đây.");
    }
  };

  const handleFocusArea = (areaId: string) => {
    setSelectedAreaId(areaId);
    const area = areas.find((a) => a.id === areaId);
    if (area && area.boundary) {
      try {
        const geoJsonData = { type: "Polygon", coordinates: area.boundary };
        const geoJsonLayer = L.geoJSON(geoJsonData as any);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { padding: [20, 20], duration: 1.5 });
          toast.success(`Đang xem khu vực: ${area.name}`);
        }
      } catch (error) {
        toast.error("Lỗi dữ liệu bản đồ khu vực");
      }
    } else {
      toast.warning("Khu vực này chưa có bản đồ boundary");
    }
  };

  return (
    // 🔥 FIX 1: max-h-[85vh] để cao hơn, flex flex-col để layout dọc
    <Card className="w-80 max-h-[85vh] bg-white/95 backdrop-blur-md shadow-2xl border-slate-200 overflow-hidden flex flex-col transition-all duration-300 animate-in slide-in-from-left-2 pointer-events-auto">
      {/* HEADER: flex-none để không bị co lại */}
      <div
        className="p-3 bg-gradient-to-r flex-none from-slate-50 to-white border-b flex justify-between items-center cursor-pointer hover:bg-slate-50/80 transition-colors group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 text-white rounded-md shadow-sm">
            <Cpu size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tight">
              Trung tâm điều hành
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Smart Waste System
            </p>
          </div>
        </div>
        <button className="text-slate-400 group-hover:text-indigo-600 transition-colors">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isOpen && (
        // 🔥 FIX 2: flex-1 flex flex-col min-h-0 để Tabs chiếm hết chiều cao còn lại
        <Tabs
          defaultValue="monitor"
          className="w-full flex-1 flex flex-col min-h-0"
        >
          <div className="px-4 pt-3 flex-none">
            <TabsList className="grid w-full grid-cols-2 h-9 bg-slate-100 p-1">
              <TabsTrigger
                value="monitor"
                className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                <Activity size={12} className="mr-1.5" /> Giám sát
              </TabsTrigger>
              <TabsTrigger
                value="tools"
                className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                <Waypoints size={12} className="mr-1.5" /> Tác nghiệp
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 🔥 FIX 3: ScrollArea flex-1 để tự động cuộn khi nội dung dài */}
          <ScrollArea className="flex-1 p-0">
            {/* TAB 1: MONITOR */}
            <TabsContent value="monitor" className="p-4 space-y-5 mt-0">
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Đội xe"
                  value={stats.activeVehicles}
                  total={stats.totalVehicles}
                  icon={<Truck size={14} />}
                  color="blue"
                />
                <StatCard
                  label="Cảnh báo"
                  value={stats.criticalBins}
                  total={stats.totalBins}
                  icon={<AlertTriangle size={14} />}
                  color={stats.criticalBins > 0 ? "red" : "green"}
                  isAlert={stats.criticalBins > 0}
                />
              </div>
              <Separator />
              <div className="space-y-3">
                <SectionTitle
                  icon={<Target size={14} />}
                  label="Chọn khu vực (Focus)"
                />
                <Select value={selectedAreaId} onValueChange={handleFocusArea}>
                  <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200">
                    <SelectValue placeholder="-- Chọn khu vực --" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem
                        key={area.id}
                        value={area.id}
                        className="text-xs"
                      >
                        📍 {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-3">
                <SectionTitle icon={<Layers size={14} />} label="Lớp bản đồ" />
                <div className="space-y-1 bg-slate-50/50 p-2 rounded-lg border border-slate-100 max-h-50 overflow-auto scroll-auto">
                  <LayerToggle
                    label="Phương tiện"
                    icon={<Truck size={14} className="text-blue-500" />}
                    checked={layers.vehicles}
                    onChange={() => dispatch(toggleLayer("vehicles"))}
                  />
                  <LayerToggle
                    label="Thùng rác"
                    icon={<Trash2 size={14} className="text-green-500" />}
                    checked={layers.bins}
                    onChange={() => dispatch(toggleLayer("bins"))}
                  />
                  <LayerToggle
                    label="Điểm tập kết"
                    icon={<MapPin size={14} className="text-orange-500" />}
                    checked={layers.points}
                    onChange={() => dispatch(toggleLayer("points"))}
                  />
                  <LayerToggle
                    label="Vùng hoạt động"
                    icon={<MapIcon size={14} className="text-purple-500" />}
                    checked={layers.areas}
                    onChange={() => dispatch(toggleLayer("areas"))}
                  />
                  {activeRoute && (
                    <>
                      <Separator className="my-1" />
                      <LayerToggle
                        label="Lộ trình đang chọn"
                        icon={<Route size={14} className="text-red-500" />}
                        checked={true}
                        onChange={() => dispatch(clearRoute())}
                        isDestructive
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => dispatch(fetchMapData())}
                >
                  <RefreshCw
                    size={12}
                    className={cn("mr-2", isLoading && "animate-spin")}
                  />{" "}
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 text-red-600 hover:bg-red-50"
                  onClick={() => dispatch(clearRoute())}
                >
                  <EyeOff size={12} className="mr-2" /> Xóa đường
                </Button>
              </div>
            </TabsContent>

            {/* TAB 2: TOOLS */}
            <TabsContent value="tools" className="p-4 space-y-5 mt-0">
              <div className="space-y-3">
                <SectionTitle
                  icon={<Route size={14} />}
                  label="Lập lộ trình nhanh"
                />
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3 relative">
                  <div className="absolute left-[19px] top-9 bottom-9 w-0.5 bg-slate-300 border-l border-dashed border-slate-400 z-0"></div>
                  <div className="relative z-10">
                    <label className="text-[10px] font-bold text-slate-500 mb-1 block pl-1">
                      Điểm xuất phát (A)
                    </label>
                    <Select
                      onValueChange={setSelectedStartId}
                      value={selectedStartId}
                    >
                      <SelectTrigger className="h-9 text-xs bg-white">
                        <SelectValue placeholder="Chọn xe..." />
                      </SelectTrigger>
                      <SelectContent>
                        {activeVehiclesList.map((v) => (
                          <SelectItem
                            key={v.id}
                            value={v.id}
                            className="text-xs"
                          >
                            🚚 {v.plateNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-center -my-2 relative z-20">
                    <div className="bg-white border p-1 rounded-full text-slate-400">
                      <ArrowRightLeft size={10} className="rotate-90" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <label className="text-[10px] font-bold text-slate-500 mb-1 block pl-1">
                      Điểm đến (B)
                    </label>
                    <Select
                      onValueChange={setSelectedEndId}
                      value={selectedEndId}
                    >
                      <SelectTrigger className="h-9 text-xs bg-white">
                        <SelectValue placeholder="Chọn điểm đến..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="header_bins"
                          disabled
                          className="text-slate-400 text-[10px] font-bold"
                        >
                          --- THÙNG RÁC ĐẦY ---
                        </SelectItem>
                        {fullBinsList.map((b) => (
                          <SelectItem
                            key={b.id}
                            value={b.id}
                            className="text-xs"
                          >
                            🗑️ {b.code} (Đầy)
                          </SelectItem>
                        ))}
                        <SelectItem
                          value="header_points"
                          disabled
                          className="text-slate-400 text-[10px] font-bold mt-2"
                        >
                          --- ĐIỂM TẬP KẾT ---
                        </SelectItem>
                        {points?.map((p: any) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            className="text-xs"
                          >
                            📍 {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-9 text-xs font-bold shadow-md"
                    onClick={handleCalculateRoute}
                    disabled={!selectedStartId || !selectedEndId}
                  >
                    <Navigation size={12} className="mr-2" /> Vẽ đường đi
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <SectionTitle
                  icon={<Calculator size={14} />}
                  label="Gợi ý thông minh"
                />
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-2 px-3 bg-white hover:bg-slate-50 border-slate-200"
                    onClick={handleFindNearestFullBin}
                    disabled={!selectedStartId}
                  >
                    <div className="bg-orange-100 p-1.5 rounded-md mr-3">
                      <AlertTriangle size={14} className="text-orange-600" />
                    </div>
                    <div className="text-left w-full">
                      <div className="text-xs font-bold text-slate-700">
                        Xử lý thùng rác tràn
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Tìm thùng đầy gần xe{" "}
                        <b>
                          {selectedStartId
                            ? vehicles[selectedStartId]?.plateNumber
                            : "..."}
                        </b>{" "}
                        nhất
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      )}
    </Card>
  );
};

// SUB COMPONENTS (Giữ nguyên)
const SectionTitle = ({ icon, label }: any) => (
  <div className="flex items-center gap-2 mb-2">
    {React.cloneElement(icon, { className: "text-slate-400" })}
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
      {label}
    </span>
  </div>
);
const StatCard = ({ label, value, total, icon, color, isAlert }: any) => {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    red: "text-red-600 bg-red-50 border-red-100",
    green: "text-green-600 bg-green-50 border-green-100",
  };
  return (
    <div
      className={cn(
        "p-3 rounded-xl border flex flex-col justify-between transition-colors",
        colorMap[color],
      )}
    >
      <div className="flex items-center gap-1.5 mb-2 font-bold text-[10px] uppercase opacity-90">
        {icon} {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black">{value}</span>
        <span className="text-xs opacity-60 font-bold">/ {total}</span>
      </div>
      {isAlert && (
        <div className="mt-1 w-full h-1 bg-red-200 rounded-full">
          <div className="h-full bg-red-600 rounded-full animate-pulse w-full"></div>
        </div>
      )}
    </div>
  );
};
const LayerToggle = ({
  label,
  icon,
  checked,
  onChange,
  isDestructive,
}: any) => (
  <div className="flex items-center justify-between group py-2 px-2 hover:bg-white rounded-md transition-all">
    <div className="flex items-center gap-3 text-sm text-slate-600 group-hover:text-slate-900">
      <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-100 group-hover:border-slate-300 transition-colors">
        {icon}
      </div>
      <span
        className={cn("font-medium text-xs", isDestructive && "text-red-600")}
      >
        {label}
      </span>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      className={cn(
        "scale-75 data-[state=checked]:bg-indigo-600",
        isDestructive && "data-[state=checked]:bg-red-500",
      )}
    />
  </div>
);

export default AdminMapControls;
