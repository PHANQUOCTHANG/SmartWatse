import { TaskDetail } from "../types/task-detail.type";

export const useTaskDetailMock = (routeId: string) => {
  const data: TaskDetail = {
    id: routeId,
    name: "Quận 1 - Khu vực 4",
    progress: {
      collected: 5,
      total: 12,
    },
    bins: [
      {
        id: "B-103",
        name: "Thùng #B-103",
        address: "123 Nguyễn Huệ, P. Bến Nghé",
        status: "INCIDENT",
        location: { lat: 10.773, lng: 106.703 },
      },
      {
        id: "B-104",
        name: "Thùng #B-104",
        address: "45 Lê Lợi, P. Bến Nghé",
        status: "PENDING",
        location: { lat: 10.774, lng: 106.701 },
      },
      {
        id: "B-101",
        name: "Thùng #B-101",
        address: "2 Công Xã Paris",
        status: "COMPLETED",
        location: { lat: 10.776, lng: 106.705 },
      },
    ],
  };

  return { data };
};
