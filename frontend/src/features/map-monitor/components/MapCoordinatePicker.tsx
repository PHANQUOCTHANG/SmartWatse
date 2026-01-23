import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  MapPin,
  Search,
  Crosshair,
  Loader2,
  Check,
  Navigation,
} from "lucide-react";
import L from "leaflet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";

// --- TYPES ---
export interface MapLocation {
  lat: number;
  lng: number;
  address?: string; // 🔥 Thêm field address
}

interface Props {
  value?: MapLocation;
  onChange: (value: MapLocation) => void;
  error?: string;
  placeholder?: string;
}

// --- ICONS ---
const pinIcon = L.divIcon({
  className: "custom-pin-marker",
  html: `<div style='background-color: #ef4444; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;'><div style='width: 8px; height: 8px; background-color: white; border-radius: 50%;'></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

// --- SUB COMPONENTS ---
// 1. Click Handler: Gọi API lấy địa chỉ ngay khi click
const MapEvents = ({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// 2. Map Fixer: Chống lỗi map xám
const MapFixer = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
      if (center) map.flyTo(center, 16, { animate: true });
    }, 200);
    return () => clearTimeout(timeout);
  }, [map, center]);
  return null;
};

export const MapCoordinatePicker: React.FC<Props> = ({
  value,
  onChange,
  error,
  placeholder = "Chọn tọa độ...",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // State nội bộ
  const [tempPos, setTempPos] = useState<MapLocation | null>(value || null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  // Loading states
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Sync value khi mở modal
  useEffect(() => {
    if (isOpen) {
      if (value && value.lat && value.lng) {
        setTempPos(value);
        setMapCenter([value.lat, value.lng]);
      } else {
        setMapCenter([10.762622, 106.660172]); // Mặc định HCM
      }
    }
  }, [isOpen, value]);

  // --- HANDLERS ---

  // 1. Tìm kiếm địa điểm (Forward Geocoding)
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=1`,
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const address = data[0].display_name;

        setTempPos({ lat, lng, address });
        setMapCenter([lat, lng]);
        toast.success("Đã tìm thấy địa điểm");
      } else {
        toast.error("Không tìm thấy");
      }
    } catch (e) {
      toast.error("Lỗi kết nối");
    } finally {
      setIsSearching(false);
    }
  };

  // 2. Click trên Map (Reverse Geocoding)
  const handleMapClick = async (lat: number, lng: number) => {
    setTempPos({ lat, lng, address: "Đang lấy địa chỉ..." }); // Optimistic update
    setIsLoadingAddress(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await res.json();
      const address = data.display_name || "Vị trí không xác định";
      setTempPos({ lat, lng, address });
    } catch (error) {
      setTempPos({ lat, lng, address: "" });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // 3. Lấy vị trí GPS
  const handleLocateMe = () => {
    if (!navigator.geolocation)
      return toast.error("Trình duyệt không hỗ trợ GPS");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handleMapClick(latitude, longitude); // Gọi hàm click để lấy luôn địa chỉ
        setMapCenter([latitude, longitude]);
      },
      () => toast.error("Không thể lấy vị trí"),
    );
  };

  const handleConfirm = () => {
    if (tempPos) {
      onChange(tempPos); // Trả về full {lat, lng, address}
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-1">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-between h-10 px-3 font-normal text-left shadow-sm bg-white hover:bg-slate-50 border-slate-200",
              error && "border-red-500 text-red-600 ring-1 ring-red-100",
              !value && "text-muted-foreground",
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {value && value.lat ? (
                <>
                  <Crosshair className="size-4 text-red-500 shrink-0" />
                  <span className="font-mono text-xs font-semibold text-slate-700">
                    {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
                  </span>
                </>
              ) : (
                <>
                  <MapPin className="size-4 shrink-0" />
                  <span>{placeholder}</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              PICK
            </span>
          </Button>
        </DialogTrigger>

        {/* 🔥 FIX Z-INDEX: 1000 để đè lên Modal cha */}
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 flex flex-col gap-0 overflow-hidden rounded-xl z-[1000]">
          <DialogHeader className="px-4 py-3 border-b bg-white z-10 flex flex-row items-center justify-between shrink-0 gap-4">
            <DialogTitle className="flex items-center gap-2 text-base shrink-0">
              <MapPin className="size-5 text-red-600" /> Chọn Tọa Độ
            </DialogTitle>

            {/* Search Bar */}
            <div className="flex-1 max-w-md relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm địa chỉ (VD: Chợ Bến Thành)..."
                  className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus-visible:ring-red-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleSearch}
                disabled={isSearching}
                className="h-9 px-3"
              >
                {isSearching ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Tìm"
                )}
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 relative bg-slate-100">
            {isOpen && (
              <MapContainer
                center={mapCenter || [10.762, 106.66]}
                zoom={13}
                className="h-full w-full z-0"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Sự kiện click & Fix map */}
                <MapEvents onSelect={handleMapClick} />
                <MapFixer center={mapCenter} />

                {tempPos && (
                  <Marker position={[tempPos.lat, tempPos.lng]} icon={pinIcon}>
                    <Popup
                      offset={[0, -20]}
                      closeButton={false}
                      className="font-sans"
                    >
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-500 mb-1">
                          Vị trí chọn
                        </p>
                        <p className="font-mono text-xs font-bold text-red-600 mb-1">
                          {tempPos.lat.toFixed(5)}, {tempPos.lng.toFixed(5)}
                        </p>
                        {isLoadingAddress ? (
                          <div className="flex items-center justify-center gap-1 text-[10px] text-blue-500">
                            <Loader2 className="size-3 animate-spin" /> Đang lấy
                            địa chỉ...
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-600 max-w-[150px] leading-tight">
                            {tempPos.address}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            )}

            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
              <Button
                size="icon"
                className="rounded-full shadow-md bg-white text-slate-700 hover:bg-slate-100 h-10 w-10"
                onClick={handleLocateMe}
                title="Vị trí của tôi"
              >
                <Navigation className="size-5" />
              </Button>
            </div>
          </div>

          <DialogFooter className="px-4 py-3 bg-white border-t flex justify-between items-center sm:justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-2 max-w-[60%] truncate">
              {tempPos ? (
                <>
                  <Check className="size-4 text-green-500 shrink-0" />
                  <span className="truncate">
                    <span className="font-bold text-slate-800">
                      Đang chọn:{" "}
                    </span>
                    {tempPos.address ||
                      `${tempPos.lat.toFixed(5)}, ${tempPos.lng.toFixed(5)}`}
                  </span>
                </>
              ) : (
                <span>Vui lòng click map để chọn</span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white gap-2"
                onClick={handleConfirm}
                disabled={!tempPos}
              >
                <MapPin className="size-4" /> Xác nhận
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {error && (
        <p className="text-[10px] text-red-500 font-medium animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
