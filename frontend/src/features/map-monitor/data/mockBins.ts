import { Bin } from "../types/types";

export const mockBins: Bin[] = [
  {
    id: "VN-1024",
    lat: 10.776889,
    lng: 106.700806,
    fillLevel: 95,
    status: "OVERFLOW",
    address: "Nguyễn Huệ, Quận 1",
  },
  {
    id: "VN-1025",
    lat: 10.781234,
    lng: 106.695678,
    fillLevel: 70,
    status: "NEARLY_FULL",
    address: "Lê Lợi, Quận 1",
  },
  {
    id: "VN-1026",
    lat: 10.772345,
    lng: 106.710234,
    fillLevel: 20,
    status: "EMPTY",
    address: "Hai Bà Trưng, Quận 3",
  },
];
