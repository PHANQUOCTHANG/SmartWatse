import booleanContains from "@turf/boolean-contains";
import { polygon } from "@turf/helpers";

/**
 * Kiểm tra Polygon con có nằm trọn trong Polygon cha không
 * @param parentCoords GeoJSON Coordinates [[[Lng, Lat], ...]]
 * @param childCoords GeoJSON Coordinates [[[Lng, Lat], ...]]
 */
export const isPolygonInside = (
  parentCoords: number[][][] | undefined,
  childCoords: number[][][],
): boolean => {
  // Nếu không có cha (ví dụ đang vẽ Quận), thì luôn đúng
  if (!parentCoords || parentCoords.length === 0) return true;

  try {
    const parent = polygon(parentCoords);
    const child = polygon(childCoords);
    return booleanContains(parent, child);
  } catch (error) {
    console.error("Geo Valid Error:", error);
    return false; // Nếu lỗi format thì coi như không hợp lệ
  }
};
// src/utils/geoUtils.ts (Nên tách ra file riêng)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Trả về mét (m) cho chính xác với người đi bộ
};

export const estimateWalkingTime = (distanceInMeters: number) => {
  // Tốc độ đi bộ trung bình: 5km/h ~ 83m/phút
  const minutes = Math.ceil(distanceInMeters / 83);
  return minutes;
};
