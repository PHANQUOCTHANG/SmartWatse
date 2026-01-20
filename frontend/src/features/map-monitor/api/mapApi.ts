import { BinStatus, BinType, IBin } from "@/features/bin";

// Helper để tạo ngày tháng ISO
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const MOCK_BINS: IBin[] = [
  // -----------------------------------------------------------
  // 1. Thùng Rác Hữu Cơ - Hoạt động tốt (Khu vực Phố đi bộ)
  // -----------------------------------------------------------
  {
    _id: "bin_001",
    id: "bin_001",
    code: "BIN-Q1-001",
    collectionPointId: "cp_01",
    location: {
      type: "Point",
      coordinates: [106.703565, 10.774574], // [Lng, Lat]
    },
    address: "45 Nguyễn Huệ, Bến Nghé, Quận 1",
    binType: BinType.ORGANIC,
    capacity: 120,
    currentLevel: 35, // 35% - Ổn
    status: BinStatus.ACTIVE,
    battery: 92,
    temperature: 28,
    brand: "EcoVina",
    installationDate: "2023-01-15T00:00:00Z",
    coverImage:
      "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=400",
    notes: "Đặt cạnh ghế đá công viên",
    lastCollected: daysAgo(1),
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: daysAgo(0),
  },

  // -----------------------------------------------------------
  // 2. Thùng Rác Tái Chế - Đã Đầy (Khu vực Bitexco)
  // -----------------------------------------------------------
  {
    _id: "bin_002",
    id: "bin_002",
    code: "BIN-Q1-002",
    collectionPointId: "cp_01",
    location: {
      type: "Point",
      coordinates: [106.704257, 10.771918],
    },
    address: "2 Hải Triều, Bến Nghé, Quận 1",
    binType: BinType.RECYCLE,
    capacity: 240,
    currentLevel: 95, // 95% - Đầy
    status: BinStatus.FULL,
    battery: 85,
    temperature: 31,
    brand: "UrbanWaste",
    installationDate: "2023-02-20T00:00:00Z",
    coverImage:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400",
    notes: "Nhiều chai nhựa, cần thu gom gấp",
    lastCollected: daysAgo(2),
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: daysAgo(0),
  },

  // -----------------------------------------------------------
  // 3. Thùng Rác Vô Cơ - Quá Tải/Nguy Hiểm (Chợ Bến Thành)
  // -----------------------------------------------------------
  {
    _id: "bin_003",
    id: "bin_003",
    code: "BIN-Q1-003",
    collectionPointId: "cp_02",
    location: {
      type: "Point",
      coordinates: [106.698354, 10.772535],
    },
    address: "Cửa Nam Chợ Bến Thành",
    binType: BinType.INORGANIC,
    capacity: 120,
    currentLevel: 110, // 110% - Tràn
    status: BinStatus.OVERLOAD,
    battery: 60,
    temperature: 55, // 🔥 Cảnh báo nhiệt độ cao (nguy cơ cháy)
    brand: "SmartBin Pro",
    installationDate: "2023-03-10T00:00:00Z",
    coverImage:
      "https://plus.unsplash.com/premium_photo-1664303847960-586318f59035?auto=format&fit=crop&q=80&w=400",
    notes: "Cảnh báo nhiệt độ cao! Rác tràn ra ngoài.",
    lastCollected: daysAgo(3),
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: daysAgo(0),
  },

  // -----------------------------------------------------------
  // 4. Thùng Rác Hỏng/Mất Tín Hiệu (Công viên Tao Đàn)
  // -----------------------------------------------------------
  {
    _id: "bin_004",
    id: "bin_004",
    code: "BIN-Q3-001",
    collectionPointId: "cp_03",
    location: {
      type: "Point",
      coordinates: [106.691763, 10.774439],
    },
    address: "Trương Định, Phường 6, Quận 3",
    binType: BinType.ORGANIC,
    capacity: 120,
    currentLevel: 0, // Không đọc được dữ liệu
    status: BinStatus.BROKEN,
    battery: 0, // Hết pin hoặc hỏng nguồn
    temperature: 0,
    brand: "TechWaste",
    installationDate: "2022-11-05T00:00:00Z",
    notes: "Cảm biến không phản hồi 24h qua",
    lastCollected: daysAgo(5),
    createdAt: "2022-11-01T00:00:00Z",
    updatedAt: daysAgo(1),
  },

  // -----------------------------------------------------------
  // 5. Thùng Rác Đang Bảo Trì (Dinh Độc Lập)
  // -----------------------------------------------------------
  {
    _id: "bin_005",
    id: "bin_005",
    code: "BIN-Q1-005",
    collectionPointId: "cp_01",
    location: {
      type: "Point",
      coordinates: [106.695349, 10.776991],
    },
    address: "135 Nam Kỳ Khởi Nghĩa",
    binType: BinType.INORGANIC,
    capacity: 240,
    currentLevel: 0,
    status: BinStatus.MAINTENANCE,
    battery: 100,
    temperature: 25,
    brand: "EcoVina",
    installationDate: "2023-05-20T00:00:00Z",
    notes: "Đang thay thế nắp đậy cảm biến",
    lastCollected: daysAgo(1),
    createdAt: "2023-05-01T00:00:00Z",
    updatedAt: daysAgo(0),
  },
];

// -----------------------------------------------------------
// 6. Mock Response Object (Giả lập trả về từ API getAll)
// -----------------------------------------------------------

export const mapApi = {
  // Lấy danh sách thùng rác (có thể truyền bounds để tối ưu tải trang)
  getBins: async (): Promise<IBin[]> => {
    // Gọi endpoint BE: GET /api/v1/bins (hoặc /bins/nearby)
    // const { data } = await api.get("/bins");
    return MOCK_BINS; // Tùy cấu trúc response của BE
  },
};
