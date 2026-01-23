import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet";
import {
  Map as MapIcon,
  Search,
  Check,
  XCircle,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { areaApi } from "@/features/area/api/areaApi";
import { AreaType } from "@/features/area/types";
import { swapLngLat } from "@/features/map-monitor/utils/mapIcons";
import "leaflet/dist/leaflet.css";

// 1. Auto Zoom Component
const BoundsFitter = ({ bounds }: { bounds: any }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      try {
        map.fitBounds(bounds, { padding: [20, 20], animate: true });
      } catch (e) {
        /* ignore */
      }
    }
  }, [bounds, map]);
  return null;
};

// 2. Fix Map Display in Modal
const MapFixer = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

interface Props {
  value?: string;
  onChange: (id: string | null) => void;
  error?: string;
  placeholder?: string;
  typeToSelect?: AreaType; // Ví dụ: Chỉ hiện DISTRICT
  disabled?: boolean;
}

export const MapAreaSelect: React.FC<Props> = ({
  value,
  onChange,
  error,
  placeholder = "Chọn khu vực...",
  typeToSelect,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch danh sách Area (Lọc theo type nếu cần)
  const { data, isLoading } = useQuery({
    queryKey: ["areas", "select-list", typeToSelect],
    queryFn: () => areaApi.getAll({ limit: 1000, type: typeToSelect }),
    staleTime: 5 * 60 * 1000,
    enabled: isOpen,
  });

  const areas = data?.data || [];

  const selectedArea = useMemo(
    () => areas.find((a: any) => a.id === value),
    [areas, value],
  );

  const filteredAreas = useMemo(
    () =>
      areas.filter((a: any) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [areas, searchTerm],
  );

  const mapBounds = useMemo(() => {
    const target = selectedArea || filteredAreas[0];
    return target?.boundary ? swapLngLat(target.boundary) : null;
  }, [selectedArea, filteredAreas]);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Chặn sự kiện click lan ra ngoài (để không mở modal)
    onChange(null); // Reset value về null
  };
  return (
    <div className="space-y-1">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative group">
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                "w-full justify-between h-10 px-3 font-normal text-left shadow-sm bg-white hover:bg-slate-50 border-slate-200",
                error && "border-red-500 ring-1 ring-red-100",
                !value && "text-muted-foreground",
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {selectedArea ? (
                  <>
                    <MapIcon className="size-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-700">
                      {selectedArea.name}
                    </span>
                  </>
                ) : (
                  <>
                    <Search className="size-4 shrink-0" />
                    <span>{placeholder}</span>
                  </>
                )}
              </div>
              {isLoading ? (
                <Loader2 className="size-3 animate-spin text-slate-400" />
              ) : (
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  MAP
                </span>
              )}
            </Button>
            {value && !disabled && (
              <div
                onClick={handleClear}
                className="absolute right-20 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors z-10"
                title="Bỏ chọn"
              >
                <X size={14} />
              </div>
            )}
          </div>
        </DialogTrigger>

        {/* 🔥 Z-Index 1000 để đè lên Modal cha */}
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 flex flex-col gap-0 overflow-hidden rounded-xl z-[1000]">
          <DialogHeader className="px-4 py-3 border-b bg-white z-10 shrink-0 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base">
              <MapIcon className="size-5 text-blue-600" /> Chọn{" "}
              {typeToSelect === AreaType.DISTRICT ? "Quận/Huyện" : "Khu vực"}
            </DialogTitle>
            <div className="relative w-full max-w-xs hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-9 h-9 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </DialogHeader>

          <div className="flex-1 relative bg-slate-100">
            {isOpen && (
              <MapContainer
                center={[10.762, 106.66]}
                zoom={11}
                className="h-full w-full z-0"
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <MapFixer />

                {filteredAreas.map((area: any) => {
                  const positions = swapLngLat(area.boundary);
                  if (!positions) return null;
                  const isSelected = area.id === value;

                  return (
                    <Polygon
                      key={area.id}
                      positions={positions}
                      pathOptions={{
                        color: isSelected ? "#2563eb" : "#64748b",
                        fillColor: isSelected ? "#3b82f6" : "#cbd5e1",
                        fillOpacity: isSelected ? 0.6 : 0.2,
                        weight: isSelected ? 2 : 1,
                      }}
                      eventHandlers={{ click: () => handleSelect(area.id) }}
                    >
                      <Tooltip
                        direction="center"
                        permanent={isSelected}
                        className="bg-transparent border-none shadow-none font-bold text-slate-700"
                      >
                        {area.name} {isSelected && "✅"}
                      </Tooltip>
                    </Polygon>
                  );
                })}
                <BoundsFitter bounds={mapBounds} />
              </MapContainer>
            )}

            {filteredAreas.length === 0 && !isLoading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-xl shadow-lg z-[2000] flex flex-col items-center gap-2">
                <XCircle className="size-8 text-slate-300" />
                <span className="text-sm text-slate-500">
                  Không tìm thấy khu vực nào
                </span>
              </div>
            )}
          </div>
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
