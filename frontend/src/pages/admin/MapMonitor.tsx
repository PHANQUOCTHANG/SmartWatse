import AdminMap from "@/features/map-monitor/components/real-time-map/AdminMap";
import React from "react";

const MapMonitorPage = () => {
  return (
    // 🚩 SỬA:
    // 1. w-full: Chiếm hết chiều ngang
    // 2. h-[calc(100vh-64px)]: Chiều cao màn hình TRỪ đi chiều cao Header (giả sử Header cao 64px)
    // 3. overflow-hidden: Cắt bỏ mọi phần thừa gây scroll
    <div className="flex flex-col w-full h-[calc(100vh-100px)] overflow-hidden bg-background">
      {/* Container của Map chiếm hết không gian còn lại */}
      <div className="flex-1 w-full h-full relative">
        <AdminMap />
      </div>
    </div>
  );
};

export default MapMonitorPage;
