import { useEffect, useState } from "react";
import { areaApi } from "@/features/area/api/areaApi";
import { binApi } from "@/features/bin/api/binApi";
import { collectionPointApi } from "@/features/collection-points/api/collectionPointApi";
import { IArea, IBin } from "../types";
import { ICollectionPoint } from "@/features/collection-points/types";

export const useFeedbackMetadata = () => {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [collectionPoints, setCollectionPoints] = useState<ICollectionPoint[]>(
    [],
  );
  const [bins, setBins] = useState<IBin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch areas on mount
  useEffect(() => {
    const fetchAreas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const areaRes = await areaApi.getAll({ page: 1, limit: 1000 });
        const areasList = Array.isArray(areaRes.data) ? areaRes.data : [];
        const processedAreas: IArea[] = areasList.map((area: any) => ({
          ...area,
          _id: area.id || area._id,
          id: area.id || area._id,
        }));
        setAreas(processedAreas);
      } catch (err) {
        console.error("Failed to fetch areas:", err);
        setError("Không thể tải dữ liệu khu vực");
        setAreas([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAreas();
  }, []);

  // Fetch collection points when areaId changes
  const fetchCollectionPoints = async (areaId: string) => {
    if (!areaId) {
      setCollectionPoints([]);
      return;
    }

    try {
      const pointRes = await collectionPointApi.getAll({
        page: 1,
        limit: 1000,
        areaId,
      });
      const pointsList = Array.isArray(pointRes.data) ? pointRes.data : [];
      const processedPoints: ICollectionPoint[] = pointsList.map(
        (point: any) => ({
          ...point,
          id: point.id || point._id,
        }),
      );
      setCollectionPoints(processedPoints);
    } catch (err) {
      console.error("Failed to fetch collection points:", err);
      setCollectionPoints([]);
    }
  };

  // Fetch bins when collectionPointId changes
  const fetchBins = async (collectionPointId: string) => {
    if (!collectionPointId) {
      setBins([]);
      return;
    }

    try {
      const binRes = await binApi.getAll({
        page: 1,
        limit: 1000,
        collectionPointId,
      });
      const binsList = Array.isArray(binRes.data) ? binRes.data : [];
      const processedBins: IBin[] = binsList.map((bin: any) => ({
        ...bin,
        _id: bin.id || bin._id,
        id: bin.id || bin._id,
      }));
      setBins(processedBins);
    } catch (err) {
      console.error("Failed to fetch bins:", err);
      setBins([]);
    }
  };

  return {
    areas,
    collectionPoints,
    bins,
    isLoading,
    error,
    fetchCollectionPoints,
    fetchBins,
  };
};
