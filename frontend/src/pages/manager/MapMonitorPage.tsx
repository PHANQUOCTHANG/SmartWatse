import MapContainer from "@/features/map-monitor/components/MapContainer";
import MapFilterBar from "@/features/map-monitor/components/MapFilterBar";
import BinDetailDrawer from "@/features/map-monitor/components/bin/BinDetailDrawer";

export default function MapMonitorPage() {
  return (
    <div className="relative h-full">
      {/* Filter */}
      <MapFilterBar />

      {/* Map */}
      <MapContainer />

      {/* Right drawer */}
      <BinDetailDrawer />
    </div>
  );
}
