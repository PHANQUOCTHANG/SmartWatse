// src/components/form-inputs/MapCollectionPointSelect.tsx

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
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useCollectionPoints } from "@/features/collection-points/hooks/useCollectionPoints";
import { MapPin, Search, Box, XCircle, Loader2, X } from "lucide-react";
import L from "leaflet";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import { ICollectionPoint } from "@/features/collection-points/types";

// --- ICONS ---
const defaultIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style='background-color: #7c3aed; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;'><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const selectedIcon = L.divIcon({
  className: "custom-marker-selected",
  html: `<div style='background-color: #16a34a; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; animation: bounce 0.5s;'><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
});

// Component Fix lỗi Map xám & Auto Zoom
const MapFixer = ({
  center,
  points,
}: {
  center: [number, number] | null;
  points: ICollectionPoint[];
}) => {
  const map = useMap();
  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();

      if (center) {
        // Nếu có điểm chọn -> Bay tới đó
        map.flyTo(center, 16, { animate: true });
      } else if (points.length > 0) {
        // Nếu chưa chọn gì -> Zoom fit tất cả các điểm
        try {
          const bounds = L.latLngBounds(
            points.map((p) => [p.latitude, p.longitude]),
          );
          map.fitBounds(bounds, { padding: [50, 50], animate: true });
        } catch (e) {
          console.error("Map bounds error", e);
        }
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [map, center, points]); // Re-run khi data thay đổi
  return null;
};

interface Props {
  value?: string;
  onChange: (id: string | null) => void; // Cho phép null để clear
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const MapCollectionPointSelect: React.FC<Props> = ({
  value,
  onChange,
  error,
  placeholder = "Chọn điểm trên bản đồ...",
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { collectionPoints, isLoading } = useCollectionPoints(1000); // Tăng limit lên để lấy hết điểm

  const selectedPoint = useMemo(
    () => collectionPoints.find((p) => p.id === value),
    [collectionPoints, value],
  );

  const filteredPoints = useMemo(
    () =>
      collectionPoints.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.address?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [collectionPoints, searchTerm],
  );

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn mở dialog
    onChange(null);
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
                "w-full justify-between h-10 px-3 font-normal text-left shadow-sm bg-white hover:bg-slate-50 border-slate-200 pr-8", // pr-8 cho nút X
                error && "border-red-500 text-red-600 ring-1 ring-red-100",
                !value && "text-muted-foreground",
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {selectedPoint ? (
                  <>
                    <Box className="size-4 text-purple-600 shrink-0" />
                    <span className="font-semibold text-slate-700 truncate">
                      {selectedPoint.name}
                    </span>
                  </>
                ) : (
                  <>
                    <MapPin className="size-4 shrink-0" />
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

            {/* 🔥 NÚT CLEAR (X) */}
            {value && !disabled && (
              <div
                onClick={handleClear}
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors z-10"
                title="Bỏ chọn"
              >
                <X size={14} />
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 flex flex-col gap-0 overflow-hidden rounded-xl z-[1000]">
          <DialogHeader className="px-4 py-3 border-b bg-white z-10 flex flex-row items-center justify-between shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-5 text-purple-600" /> Chọn Điểm Tập Kết
            </DialogTitle>
            <div className="relative w-full max-w-xs hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm tên đường..."
                className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus-visible:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </DialogHeader>

          <div className="flex-1 relative bg-slate-100">
            {isOpen && (
              <MapContainer
                center={[10.762, 106.66]} // Mặc định HCM
                zoom={13}
                className="h-full w-full z-0"
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

                {/* Render Markers */}
                {filteredPoints.map((point) => {
                  const isSelected = point.id === value;
                  return (
                    <Marker
                      key={point.id}
                      position={[point.latitude, point.longitude]}
                      icon={isSelected ? selectedIcon : defaultIcon}
                      zIndexOffset={isSelected ? 1000 : 0}
                      eventHandlers={{ click: () => handleSelect(point.id) }}
                    >
                      <Popup closeButton={false} offset={[0, -10]}>
                        <div className="text-center p-1 font-sans">
                          <h4 className="font-bold text-sm text-purple-700">
                            {point.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 mb-2 truncate max-w-[150px]">
                            {point.address || "Chưa có địa chỉ"}
                          </p>
                          <Button
                            size="sm"
                            className="w-full h-7 text-xs bg-purple-600 hover:bg-purple-700"
                            onClick={() => handleSelect(point.id)}
                          >
                            Chọn
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

                {/* Auto Zoom & Fix Map */}
                <MapFixer
                  center={
                    selectedPoint
                      ? [selectedPoint.latitude, selectedPoint.longitude]
                      : null
                  }
                  points={filteredPoints}
                />
              </MapContainer>
            )}

            {filteredPoints.length === 0 && !isLoading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl flex flex-col items-center gap-2 z-[2000]">
                <XCircle className="size-8 text-red-400" />
                <span className="text-sm font-medium text-slate-600">
                  Không tìm thấy!
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}

            {/* Mobile Search Bar */}
            <div className="absolute top-4 left-4 right-4 sm:hidden z-[2000]">
              <Input
                placeholder="Tìm kiếm..."
                className="shadow-lg border-0 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="px-4 py-2 bg-slate-50 text-[10px] text-slate-500 border-t flex justify-between shrink-0">
            <span>Hiển thị {filteredPoints.length} điểm</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-600" /> Khả dụng
            </span>
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
