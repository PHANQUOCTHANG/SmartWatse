import React, { useState } from "react";
import {
  AlertTriangle,
  Truck,
  Trash2,
  Filter,
  Zap,
  LayoutDashboard,
  Megaphone,
  MapPin,
  Send,
  Users,
  ChevronUp,
  ChevronDown,
  Phone,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- TYPES ---
interface Alert {
  id: string;
  type: "CRITICAL" | "WARNING" | "INFO";
  message: string;
  timestamp: string;
  targetId?: string;
}
interface ManagerStats {
  totalVehicles: number;
  activeVehicles: number;
  totalBins: number;
  fullBins: number;
  efficiency: number;
}
interface VehicleInfo {
  id: string;
  plate: string;
  driverName?: string;
  status?: string;
}
interface BinInfo {
  id: string;
  code: string;
}
interface StaffInfo {
  id: string;
  fullName?: string;
  name?: string;
  phoneNumber?: string;
  phone?: string;
  avatar?: string;
  isOnline?: boolean;
  role: string;
}

interface Props {
  areaName: string;
  stats: ManagerStats;
  alerts: Alert[];
  availableVehicles?: VehicleInfo[];
  criticalBins?: BinInfo[];
  staffs?: StaffInfo[];
  onFocusTarget: (targetId: string) => void;
  onFilterChange: (filter: {
    showFullBins: boolean;
    showIdleVehicles: boolean;
  }) => void;
  onDispatch?: (vehicleId: string, binId: string) => void;
}

// Tách component ra để bọc Memo
const ManagerMapControlsComponent = ({
  areaName,
  stats,
  alerts,
  availableVehicles = [],
  criticalBins = [],
  staffs = [],
  onFocusTarget,
  onFilterChange,
  onDispatch,
}: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState({
    showFullBins: true,
    showIdleVehicles: false,
  });
  const [selectedBin, setSelectedBin] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");

  const handleToggleFilter = (key: keyof typeof filters) => {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDispatch = () => {
    if (onDispatch && selectedBin && selectedVehicle) {
      onDispatch(selectedVehicle, selectedBin);
      setSelectedBin("");
      setSelectedVehicle("");
    }
  };

  const handleCallStaff = (phone?: string) => {
    if (phone) window.open(`tel:${phone}`);
    else toast.error("Nhân viên chưa cập nhật số điện thoại");
  };

  return (
    <Card className="w-80 max-h-[85vh] bg-white/95 backdrop-blur-md shadow-2xl border-slate-200 overflow-hidden flex flex-col transition-all duration-300 animate-in slide-in-from-left-2 z-[1000] relative pointer-events-auto">
      {/* HEADER */}
      <div
        className="p-3 bg-gradient-to-r flex-none from-slate-50 to-white border-b flex justify-between items-center cursor-pointer hover:bg-slate-50/80 transition-colors group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-600 text-white rounded-md shadow-sm">
            <MapPin size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-tight">
              Quản lý khu vực
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">{areaName}</p>
          </div>
        </div>
        <button className="text-slate-400 group-hover:text-emerald-600 transition-colors">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isOpen && (
        <Tabs
          defaultValue="overview"
          className="w-full flex-1 flex flex-col min-h-0"
        >
          <div className="px-4 pt-3 flex-none">
            <TabsList className="grid w-full grid-cols-2 h-9 bg-slate-100 p-1">
              <TabsTrigger
                value="overview"
                className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
              >
                <LayoutDashboard size={12} className="mr-1.5" /> Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="dispatch"
                className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
              >
                <Zap size={12} className="mr-1.5" /> Điều phối
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-0">
            {/* === TAB 1: OVERVIEW === */}
            <TabsContent value="overview" className="p-4 space-y-5 mt-0">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Hiệu suất
                </span>
                <Badge
                  variant={stats.efficiency >= 80 ? "default" : "destructive"}
                  className={cn(
                    "text-xs font-bold",
                    stats.efficiency >= 80
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "",
                  )}
                >
                  {stats.efficiency}%
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-1.5 text-blue-600 mb-2">
                    <Truck size={14} />{" "}
                    <span className="text-[10px] font-extrabold uppercase">
                      Xe hoạt động
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-800">
                      {stats.activeVehicles}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      / {stats.totalVehicles}
                    </span>
                  </div>
                  <div className="mt-1 w-full h-1 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${stats.totalVehicles ? (stats.activeVehicles / stats.totalVehicles) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-xl border",
                    stats.fullBins > 0
                      ? "bg-red-50/50 border-red-100"
                      : "bg-green-50/50 border-green-100",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-1.5 mb-2",
                      stats.fullBins > 0 ? "text-red-600" : "text-green-600",
                    )}
                  >
                    <Trash2 size={14} />{" "}
                    <span className="text-[10px] font-extrabold uppercase">
                      Thùng đầy
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-800">
                      {stats.fullBins}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      / {stats.totalBins}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "mt-1 w-full h-1 rounded-full overflow-hidden",
                      stats.fullBins > 0 ? "bg-red-200" : "bg-green-200",
                    )}
                  >
                    <div
                      className={cn(
                        "h-full rounded-full",
                        stats.fullBins > 0 ? "bg-red-600" : "bg-green-600",
                      )}
                      style={{
                        width: `${stats.totalBins ? (stats.fullBins / stats.totalBins) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Bộ lọc nhanh
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 block" />{" "}
                      Chỉ hiện thùng đầy
                    </label>
                    <Switch
                      checked={filters.showFullBins}
                      onCheckedChange={() => handleToggleFilter("showFullBins")}
                      className="scale-75 data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 block" />{" "}
                      Chỉ hiện xe đang dừng
                    </label>
                    <Switch
                      checked={filters.showIdleVehicles}
                      onCheckedChange={() =>
                        handleToggleFilter("showIdleVehicles")
                      }
                      className="scale-75 data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Megaphone size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Thông báo
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {alerts.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {alerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-2 rounded-lg border text-xs cursor-pointer hover:shadow-sm transition-all",
                        alert.type === "CRITICAL"
                          ? "bg-red-50 border-red-100 text-red-800"
                          : "bg-slate-50 border-slate-100 text-slate-600",
                      )}
                      onClick={() =>
                        alert.targetId && onFocusTarget(alert.targetId)
                      }
                    >
                      <div className="flex justify-between font-bold mb-1">
                        <span>{alert.type}</span>
                        <span className="opacity-70 font-mono">
                          {alert.timestamp}
                        </span>
                      </div>
                      <div className="line-clamp-2">{alert.message}</div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="text-center text-xs text-slate-400 italic py-2">
                      Không có thông báo mới
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* === TAB 2: DISPATCH === */}
            <TabsContent value="dispatch" className="p-4 space-y-5 mt-0">
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Send size={14} className="text-emerald-600" />
                    <span className="text-xs font-bold text-slate-700 uppercase">
                      Điều phối nhanh
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 mb-1 block pl-1">
                      Chọn điểm cần gom
                    </label>
                    <Select value={selectedBin} onValueChange={setSelectedBin}>
                      <SelectTrigger className="h-9 text-xs bg-white">
                        <SelectValue placeholder="Chọn thùng rác..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="header_bins"
                          disabled
                          className="text-slate-400 text-[10px] font-bold"
                        >
                          --- THÙNG RÁC QUÁ TẢI ---
                        </SelectItem>
                        {criticalBins.map((bin) => (
                          <SelectItem
                            key={bin.id}
                            value={bin.id}
                            className="text-xs"
                          >
                            🗑️ {bin.code}
                          </SelectItem>
                        ))}
                        {criticalBins.length === 0 && (
                          <SelectItem
                            value="empty"
                            disabled
                            className="text-xs italic"
                          >
                            Không có thùng cần xử lý
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 mb-1 block pl-1">
                      Chọn xe thực hiện
                    </label>
                    <Select
                      value={selectedVehicle}
                      onValueChange={setSelectedVehicle}
                    >
                      <SelectTrigger className="h-9 text-xs bg-white">
                        <SelectValue placeholder="Chọn xe..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="header_veh"
                          disabled
                          className="text-slate-400 text-[10px] font-bold"
                        >
                          --- XE TRONG KHU VỰC ---
                        </SelectItem>
                        {availableVehicles.map((veh) => (
                          <SelectItem
                            key={veh.id}
                            value={veh.id}
                            className="text-xs"
                          >
                            🚚 {veh.plate}
                          </SelectItem>
                        ))}
                        {availableVehicles.length === 0 && (
                          <SelectItem
                            value="empty"
                            disabled
                            className="text-xs italic"
                          >
                            Không có xe khả dụng
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs font-bold shadow-sm"
                    disabled={!selectedBin || !selectedVehicle}
                    onClick={handleDispatch}
                  >
                    Gửi lệnh điều phối
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Nhân viên ({staffs.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {staffs.length > 0 ? (
                      staffs.map((staff) => (
                        <div
                          key={staff.id}
                          className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden border border-slate-100">
                              {staff.avatar ? (
                                <img
                                  src={staff.avatar}
                                  alt={staff.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                (staff.fullName || staff.name || "S")
                                  .charAt(0)
                                  .toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-700">
                                {staff.fullName || staff.name}
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                {staff.phoneNumber || staff.phone || "No Phone"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                              onClick={() =>
                                handleCallStaff(
                                  staff.phoneNumber || staff.phone,
                                )
                              }
                            >
                              <Phone size={12} />
                            </Button>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[9px] border-none px-1.5",
                                staff.isOnline
                                  ? "text-emerald-600 bg-emerald-50"
                                  : "text-slate-400 bg-slate-100",
                              )}
                            >
                              {staff.isOnline ? "Online" : "Offline"}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-400 italic bg-slate-50 rounded-lg border border-dashed">
                        Không tìm thấy nhân viên nào.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      )}
    </Card>
  );
};

// 🔥 FIX RE-RENDER: Dùng React.memo để chặn render thừa
export const ManagerMapControls = React.memo(ManagerMapControlsComponent);
