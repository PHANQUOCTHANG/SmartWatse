import React, { useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setRoute, clearRoute } from "@/features/map-monitor/slice/mapSlice";
import { UserRole } from "@/features/user"; // Đảm bảo import đúng
import { BinType } from "@/features/bin/types"; // Import Enum

// Layers
import AreaLayer from "@/features/map-monitor/components/real-time-map/layers/AreaLayer";
import CollectionPointLayer from "@/features/map-monitor/components/real-time-map/layers/CollectionPointLayer";
import BinLayer from "@/features/map-monitor/components/real-time-map/layers/BinLayer";
import VehicleLayer from "@/features/map-monitor/components/real-time-map/layers/VehicleLayer";
import RouteLayer from "@/features/map-monitor/components/real-time-map/layers/RouteLayer";

// Controls
import {
  CitizenMapControls,
  BinFilterType,
} from "@/features/map-monitor/components/real-time-map/control/CitizenMapControls";
import { ManagerMapControls } from "@/features/map-monitor/components/real-time-map/control/ManagerMapControls";
import { AdminMapControls } from "@/features/map-monitor/components/real-time-map/control/AdminMapControls";
import StaffMapControls from "@/features/map-monitor/components/real-time-map/control/StaffMapControls";

export const RoleMapWrapper = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { bins, vehicles, areas, points, activeRoute, layers } = useAppSelector(
    (state) => state.map,
  );
  console.log(bins, vehicles, areas, points); // Convert Object -> Array & Memoize
  const binList = useMemo(() => Object.values(bins), [bins]);
  const vehicleList = useMemo(() => Object.values(vehicles), [vehicles]); // --- HANDLERS CHUNG ---

  const handleSelectVehicle = (vehicle: any) => {
    // Logic mẫu: Vẽ đường từ xe đến điểm tập kết đầu tiên
    let endPoint: [number, number] = [10.7721, 106.6983];
    if (
      points &&
      points.length > 0 &&
      points[0].latitude &&
      points[0].longitude
    ) {
      endPoint = [points[0].latitude, points[0].longitude];
    }

    dispatch(
      setRoute({
        start: [vehicle.coordinates.lat, vehicle.coordinates.lng],
        end: endPoint,
        vehicleId: vehicle.id,
      }),
    );
  }; // =================================================================
  // 1. ADMIN ROLE: Xem Full Data
  // =================================================================

  if (user?.role === UserRole.ADMIN) {
    return (
      <>
        {layers.areas && <AreaLayer data={areas} />}
        <CollectionPointLayer data={points} />{" "}
        {layers.bins && <BinLayer data={binList} />}{" "}
        {layers.vehicles && (
          <VehicleLayer data={vehicleList} onSelect={handleSelectVehicle} />
        )}{" "}
        {activeRoute && (
          <RouteLayer start={activeRoute.start} end={activeRoute.end} />
        )}{" "}
        <div className="absolute top-4 left-4 z-[1000]">
          <AdminMapControls />{" "}
        </div>{" "}
      </>
    );
  } // =================================================================
  // 2. MANAGER ROLE: Quản lý khu vực & Điều phối
  // =================================================================

  if (user?.role === UserRole.MANAGER) {
    const managerAreaId = user.areaId;
    console.log("Manager Area ID:", managerAreaId); // Filter Data theo Area
    const myArea = useMemo(
      () => areas.filter((a) => a.id === managerAreaId),
      [areas, managerAreaId],
    );
    const myVehicles = useMemo(
      () => vehicleList.filter((v) => v.areaId === managerAreaId),
      [vehicleList, managerAreaId],
    );
    const myPoints = useMemo(
      () => points.filter((p) => p.areaId === managerAreaId),
      [points, managerAreaId],
    );
    const validPointIds = new Set(myPoints.map((p) => p.id)); // 4. Lọc Bins dựa trên Points hợp lệ
    // Logic: Thùng rác phải thuộc về một điểm tập kết nằm trong khu vực quản lý

    const filteredBins = binList.filter((b) =>
      validPointIds.has(b.collectionPointId),
    );
    const myBins = useMemo(() => filteredBins, [filteredBins]); // Data cho chức năng Điều phối (Dispatch)

    const criticalBins = myBins
      .filter((b) => b.status === "FULL" || b.status === "OVERFLOW")
      .map((b) => ({ id: b.id, code: b.code }));

    const availableVehicles = myVehicles
      .filter((v) => v.status === "AVAILABLE" || v.status === "IN_USE")
      .map((v) => ({ id: v.id, plate: v.plateNumber })); // Stats

    const stats = {
      totalVehicles: myVehicles.length,
      activeVehicles: myVehicles.filter((v) => v.status === "IN_USE").length,
      totalBins: myBins.length,
      fullBins: criticalBins.length,
      efficiency: 85, // Có thể tính toán thực tế: (bins_collected / total_bins) * 100
    }; // Alerts Generated

    const alerts = [
      ...myBins
        .filter((b) => b.status === "OVERFLOW")
        .map((b) => ({
          id: b.id,
          type: "CRITICAL" as const,
          message: `Thùng ${b.code} quá tải tại ${b.address}!`,
          timestamp: "Vừa xong",
          targetId: b.id,
        })),
      ...myVehicles
        .filter((v) => v.status === "MAINTENANCE")
        .map((v) => ({
          id: v.id,
          type: "WARNING" as const,
          message: `Xe ${v.plateNumber} báo bảo trì`,
          timestamp: "Hôm nay",
          targetId: v.id,
        })),
    ];

    return (
      <>
        <AreaLayer data={myArea} /> {layers.bins && <BinLayer data={myBins} />}{" "}
        {layers.points && <CollectionPointLayer data={myPoints} />}{" "}
        {layers.vehicles && (
          <VehicleLayer data={myVehicles} onSelect={handleSelectVehicle} />
        )}{" "}
        {activeRoute && (
          <RouteLayer start={activeRoute.start} end={activeRoute.end} />
        )}{" "}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {" "}
          <div className="pointer-events-auto">
            {" "}
            <ManagerMapControls
              areaName={user.areaName || "Khu vực quản lý"}
              stats={stats}
              alerts={alerts} // Truyền thêm props cho chức năng điều phối
              availableVehicles={availableVehicles}
              criticalBins={criticalBins}
              onFocusTarget={(id) => {
                // Logic zoom map vào target
                console.log("Zoom to", id);
              }}
              onFilterChange={() => {}}
              onDispatch={(vehId, binId) => {
                console.log(`Dispatch vehicle ${vehId} to bin ${binId}`); // Call API dispatch here
              }}
            />{" "}
          </div>{" "}
        </div>{" "}
      </>
    );
  } // =================================================================
  // 3. STAFF ROLE: Tập trung vào Nhiệm vụ
  // =================================================================

  // =================================================================
  // 3. STAFF ROLE: Tập trung vào Nhiệm vụ
  // =================================================================
  if (user?.role === UserRole.STAFF) {
    const myVehicleId = user.assignedVehicleId;
    const staffAreaId = user.areaId;

    // 1. Tìm xe của mình (Memoize)
    const myVehicle = useMemo(
      () => vehicleList.find((v) => v.id === myVehicleId),
      [vehicleList, myVehicleId],
    );

    // 2. Lọc Points trong khu vực phân công
    const myPoints = useMemo(
      () => points.filter((p) => !staffAreaId || p.areaId === staffAreaId),
      [points, staffAreaId],
    );

    // Tạo Set ID để tra cứu nhanh
    const myPointIds = useMemo(
      () => new Set(myPoints.map((p) => p.id)),
      [myPoints],
    );

    // 3. Lọc thùng rác nhiệm vụ: (Đầy/Tràn) VÀ (Thuộc khu vực quản lý)
    const myTaskBins = useMemo(() => {
      return binList.filter((b) => {
        const isCritical = b.status === "FULL" || b.status === "OVERFLOW";
        // Nếu staff không có area (quản lý chung) thì lấy hết, ngược lại check ID point
        const isInArea = !staffAreaId || myPointIds.has(b.collectionPointId);

        return isCritical && isInArea;
      });
    }, [binList, myPointIds, staffAreaId]);

    // Effect: Tự động zoom vào xe của mình khi mới vào (UX)
    // Giả sử bạn có hàm flyToTarget và getLatLng ở scope ngoài
    /*
    useEffect(() => {
        if (myVehicle && myVehicle.coordinates) {
             // map.flyTo(...)
        }
    }, [myVehicle]); 
    */

    return (
      <>
        {/* Chỉ hiện thùng cần gom */}
        <BinLayer data={myTaskBins} />

        {/* Chỉ hiện xe mình */}
        {myVehicle && <VehicleLayer data={[myVehicle]} onSelect={() => {}} />}

        {/* Hiện Route nếu đang di chuyển */}
        {activeRoute && (
          <RouteLayer
            start={activeRoute.start}
            end={activeRoute.end}
            color="#3b82f6" // Màu xanh dương cho Staff
          />
        )}

        {/* StaffMapControls */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="pointer-events-auto">
            <StaffMapControls />
          </div>
        </div>
      </>
    );
  } // =================================================================
  // 4. CITIZEN ROLE: Khám phá & Báo cáo
  // =================================================================

  if (user?.role === UserRole.CITIZEN) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [filterType, setFilterType] = useState<BinFilterType>("ALL"); // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedBinId, setSelectedBinId] = useState<string | null>(null); // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isNavigating, setIsNavigating] = useState(false); // Filter Logic

    const filteredBins = binList.filter((b) => {
      if (b.status === "MAINTENANCE") return false;
      if (filterType === "ALL") return true;
      return b.binType === filterType; // Giả sử b.binType khớp với Enum
    });

    const selectedBinData = selectedBinId ? bins[selectedBinId] : null; // Chuẩn bị data cho Control Panel khi chọn thùng

    const controlBinData = selectedBinData
      ? {
          id: selectedBinData.id,
          address: selectedBinData.address || "Vị trí chưa xác định",
          type: selectedBinData.binType || "Thùng rác",
          status: selectedBinData.status as any,
          distance: "150m", // Mock distance
          walkTime: "2 phút", // Mock time
        }
      : null;

    return (
      <>
        {" "}
        <BinLayer
          data={filteredBins}
          onBinClick={(bin) => {
            setSelectedBinId(bin.id);
            setIsNavigating(false); // Reset nav khi chọn thùng mới
          }}
        />
        <CollectionPointLayer data={points} />{" "}
        {isNavigating && activeRoute && (
          <RouteLayer
            start={activeRoute.start}
            end={activeRoute.end}
            color="#2563eb"
          />
        )}{" "}
        <CitizenMapControls
          selectedBin={controlBinData}
          isNavigating={isNavigating}
          onFilterChange={(type) => {
            setFilterType(type);
            setSelectedBinId(null); // Clear selection khi filter
          }}
          onLocateMe={() => console.log("Locate Me")}
          onReportIssue={() => console.log("Open Report Modal")}
          onNavigateToBin={() => {
            if (isNavigating) {
              setIsNavigating(false);
              dispatch(clearRoute());
            } else if (selectedBinData) {
              setIsNavigating(true); // Giả lập vị trí user
              const userLocation: [number, number] = [10.762622, 106.660172];
              dispatch(
                setRoute({
                  start: userLocation,
                  end: [selectedBinData.latitude, selectedBinData.longitude],
                }),
              );
            }
          }}
        />{" "}
      </>
    );
  }

  return null;
};
