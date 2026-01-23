import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useSocket } from "@/app/context/SocketContext";
import {
  updateVehicleSocket,
  updateBinSocket,
  addVehicleSocket,
  removeVehicleSocket,
} from "../slice/mapSlice";
import { IVehicle, VehicleStatus } from "@/features/vehicles/types";
import { IBin } from "@/features/bin/types";

export const useMapSocket = () => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    // 1. Xe di chuyển
    const handleVehicleMoved = (data: {
      id: string;
      lat: number;
      lng: number;
      heading: number;
      status: VehicleStatus;
    }) => {
      dispatch(
        updateVehicleSocket({
          id: data.id,
          status: data.status,
          coordinates: {
            lat: data.lat,
            lng: data.lng,
            heading: data.heading ?? 0,
            lastUpdated: new Date().toISOString(),
          },
        }),
      );
    };

    // 2. Thùng rác update (Trạng thái đầy/rỗng)
    const handleBinUpdated = (data: IBin) => {
      dispatch(updateBinSocket(data));
    };

    // 3. Xe mới thêm vào
    const handleVehicleCreated = (data: IVehicle) => {
      dispatch(addVehicleSocket(data));
    };

    // 4. Xe bị xóa
    const handleVehicleDeleted = (data: { id: string }) => {
      dispatch(removeVehicleSocket(data.id));
    };

    // Listeners
    socket.on("vehicle:moved", handleVehicleMoved);
    socket.on("bin:updated", handleBinUpdated);
    socket.on("vehicle:created", handleVehicleCreated);
    socket.on("vehicle:deleted", handleVehicleDeleted);

    // Cleanup
    return () => {
      socket.off("vehicle:moved", handleVehicleMoved);
      socket.off("bin:updated", handleBinUpdated);
      socket.off("vehicle:created", handleVehicleCreated);
      socket.off("vehicle:deleted", handleVehicleDeleted);
    };
  }, [socket, dispatch]);
};
