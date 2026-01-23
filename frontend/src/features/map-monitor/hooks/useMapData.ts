import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMapData } from "../slice/mapSlice";

export const useMapData = () => {
  const dispatch = useAppDispatch();

  // 1. Lấy toàn bộ dữ liệu từ Redux Store
  const {
    vehicles,
    bins,
    areas,
    points,
    isLoading,
    layers,
    activeRoute,
    isBinModalOpen,
    selectedBin,
    isPickingLocation,
    tempLocation,
  } = useAppSelector((state) => state.map);

  // 2. Tự động gọi API khi component mount (nếu data chưa có)
  useEffect(() => {
    // Chỉ fetch khi chưa có khu vực nào (hoặc logic reload tùy bạn)
    if (areas.length === 0 && !isLoading) {
      dispatch(fetchMapData());
    }
  }, [dispatch, areas.length]); // Bỏ isLoading khỏi dep để tránh loop

  // 3. Trả về dữ liệu đã format (Record -> Array) để Map dễ render
  return {
    isLoading,
    areas,
    points,
    // Chuyển Record thành Array cho component Map
    binsList: Object.values(bins),
    vehiclesList: Object.values(vehicles),

    // Config & State khác
    layers,
    activeRoute,
    isBinModalOpen,
    selectedBin,
    isPickingLocation,
    tempLocation,
  };
};
