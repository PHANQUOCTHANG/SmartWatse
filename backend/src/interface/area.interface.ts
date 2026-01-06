// Định nghĩa các cấp bậc hành chính
export enum AreaType {
  DISTRICT = 'DISTRICT',
  WARD = 'WARD'
}

export interface IArea {
  name: string;
  type: AreaType;
  parentId?: number; // Liên kết đến ID của cấp cha (ví dụ: Phường thuộc Quận)
  createdAt: Date;
}