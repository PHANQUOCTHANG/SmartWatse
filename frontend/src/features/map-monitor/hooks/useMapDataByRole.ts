// src/features/map-monitor/hooks/useMapDataByRole.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMapData } from "../slice/mapSlice";
import { UserRole } from "@/features/user";

export const useMapDataByRole = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    // Tạo bộ lọc dữ liệu tùy theo Role
    // Lưu ý: Backend API getMapData cần hỗ trợ nhận params này
    const filterParams: any = {};

    switch (user.role) {
      case UserRole.MANAGER:
        // Manager chỉ lấy dữ liệu khu vực mình quản lý
        if (user.areaId) filterParams.areaId = user.areaId;
        break;

      case UserRole.STAFF:
        // Staff ưu tiên lấy xe mình và tuyến đường
        if (user.assignedVehicleId)
          filterParams.vehicleId = user.assignedVehicleId;
        break;

      case UserRole.CITIZEN:
        // Citizen chỉ lấy thùng rác công cộng
        filterParams.isPublic = true;
        break;

      case UserRole.ADMIN:
      default:
        // Admin lấy tất cả
        break;
    }

    // Gọi Async Thunk
    dispatch(fetchMapData(filterParams));
  }, [dispatch, user]);
};
