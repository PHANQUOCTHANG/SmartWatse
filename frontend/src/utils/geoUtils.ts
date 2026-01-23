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
