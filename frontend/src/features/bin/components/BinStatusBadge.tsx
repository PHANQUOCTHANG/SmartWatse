import { BinStatus } from "../types";

export const BinStatusBadge = ({ status }: { status: BinStatus }) => {
  const base = "px-2 py-1 rounded-full text-xs font-semibold";
  switch (status) {
    case BinStatus.FULL:
      return (
        <span className={`${base} bg-yellow-100 text-yellow-800`}>Đầy</span>
      );
    case BinStatus.OVERLOAD:
      return <span className={`${base} bg-red-100 text-red-800`}>Quá tải</span>;
    case BinStatus.BROKEN:
      return <span className={`${base} bg-gray-100 text-gray-800`}>Hỏng</span>;
    default:
      return (
        <span className={`${base} bg-green-100 text-green-800`}>Hoạt động</span>
      );
  }
};
