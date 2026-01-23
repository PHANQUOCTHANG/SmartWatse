// Định nghĩa cấu trúc JSON trả về cho Frontend dễ map
export interface DashboardOverviewDto {
  bins: {
    total: number;
    active: number;
    full: number; // Cần xử lý gấp
    maintenance: number;
  };
  vehicles: {
    total: number;
    active: number; // Đang IN_USE
    maintenance: number;
  };
  staff: {
    total: number;
    active: number;
  };
}

export interface ChartDataDto {
  date: string; // "2024-01-20"
  totalWeight: number; // Tổng lượng rác (kg)
  trips: number; // Số chuyến xe
}

export interface AlertDto {
  id: string;
  type: "BIN" | "VEHICLE";
  level: "WARNING" | "CRITICAL";
  message: string;
  timestamp: Date;
}

export interface DashboardResponseDto {
  overview: DashboardOverviewDto;
  chart: ChartDataDto[];
  alerts: AlertDto[];
}
