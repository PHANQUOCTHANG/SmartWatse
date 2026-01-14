import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { TaskBin } from "../../types/task-detail.type";
import { useEffect } from 'react';
import clsx from 'clsx';
import 'leaflet/dist/leaflet.css';

// --- PHẦN QUAN TRỌNG: HÀM TẠO ICON SỌT RÁC TỰ CHẾ ---
const createBinIcon = (bin: TaskBin, isActive: boolean) => {
  // 1. Xác định màu sắc dựa trên trạng thái
  const colors = {
    OVERLOADED: 'bg-red-500',
    PENDING: 'bg-amber-500',
    COMPLETED: 'bg-green-500',
    INCIDENT: 'bg-orange-500',
  };

  const statusColor = colors[bin.status as keyof typeof colors] || colors.PENDING;
  const iconName = bin.status === 'COMPLETED' ? 'check' : 'delete';

  // 2. Trả về mã HTML cho Icon (Sử dụng Tailwind)
  return L.divIcon({
    className: 'custom-bin-icon', // Xóa bỏ style mặc định của leaflet
    html: `
      <div class="relative flex items-center justify-center">
        ${isActive ? `<span class="absolute inset-0 size-8 animate-ping rounded-full ${statusColor} opacity-40"></span>` : ''}
        <div class="relative ${isActive ? 'size-9' : 'size-7'} ${statusColor} rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all">
          <span class="material-symbols-outlined text-white" style="font-size: ${isActive ? '18px' : '14px'}">
            ${iconName}
          </span>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20], // Căn giữa icon vào tọa độ
  });
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

type Props = {
  bins: TaskBin[];
  activeBinId: string | null;
};

export default function TaskMapPanel({ bins, activeBinId }: Props) {
  const activeBin = bins.find(b => b.id === activeBinId);
  const centerPosition: [number, number] = activeBin?.location || [10.776, 106.701];

  return (
    <div className="flex-1 h-full relative z-0">
      <MapContainer 
        center={centerPosition} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activeBin && <ChangeView center={activeBin.location} />}

        {bins.map((bin) => {
          const isActive = bin.id === activeBinId;
          
          return (
            <Marker 
              key={bin.id} 
              position={bin.location}
              // SỬ DỤNG ICON TỰ CHẾ Ở ĐÂY
              icon={createBinIcon(bin, isActive)}
            >
              <Popup offset={[0, -10]}>
                <div className="p-1">
                  <div className="font-bold text-sm">Thùng ${bin.name}</div>
                  <div className="text-[10px] text-gray-500">${bin.address}</div>
                  <div class="mt-1 text-[10px] font-bold uppercase text-primary">${bin.status}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button className="size-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 text-gray-600">
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>
    </div>
  );
}