import { ClusterMap } from "@/features/map-monitor";
import React from "react";

const MapCard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bản đồ giám sát</h1>

      {/* Chỉ cần 1 dòng này là có nguyên cái map xịn */}
      <ClusterMap height="600px" />
    </div>
  );
};

export default MapCard;
