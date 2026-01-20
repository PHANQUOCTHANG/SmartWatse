import { CitizenNotification } from "../types/notification.type";

export const useCitizenNotifications = () => {
  const notifications: CitizenNotification[] = [
    {
      id: "1",
      type: "REMINDER",
      title: "Xe thu gom sắp đến",
      message: "Xe thu gom rác hữu cơ sẽ đến trong 15 phút",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      type: "STATUS",
      title: "Xe đang đến",
      message: "Xe đã vào khu vực Phường Bến Nghé",
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      type: "EXCEPTION",
      title: "Thay đổi lịch thu gom",
      message: "Lịch thu gom hôm nay dời sang 18:30",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      type: "ALERT",
      title: "Cảnh báo quá tải",
      message: "Thùng rác khu vực bạn đang quá tải",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      type: "FEEDBACK",
      title: "Phản ánh đã xử lý",
      message: "Phản ánh về mùi hôi đã được xử lý",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return { notifications };
};
