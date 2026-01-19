import { useState, useEffect, useMemo } from "react";
import { mapApi } from "../api/mapApi";
import {
  BinStatus,
  IBinLocation,
  MapFilterMode,
} from "@/features/map-monitor/types/types";
import { IBin } from "@/features/bin";

export const useMapBins = () => {
  const [bins, setBins] = useState<IBin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<MapFilterMode>("ALL");

  const fetchBins = async () => {
    try {
      const data = await mapApi.getBins();
      setBins(data);
    } catch (error) {
      console.error("Lỗi tải bản đồ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
    // Có thể thêm setInterval để auto-refresh mỗi 30s
    const interval = setInterval(fetchBins, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter Client-side (Nhanh hơn gọi lại API)
  const filteredBins = useMemo(() => {
    if (filterMode === "ALL") return bins;
    if (filterMode === "CRITICAL") {
      return bins.filter(
        (b) => b.status === BinStatus.OVERLOAD || b.status === BinStatus.BROKEN,
      );
    }
    if (filterMode === "FULL") {
      return bins.filter((b) => b.currentLevel >= 80);
    }
    return bins;
  }, [bins, filterMode]);

  return {
    bins: filteredBins,
    totalBins: bins.length,
    loading,
    filterMode,
    setFilterMode,
    refresh: fetchBins,
  };
};
