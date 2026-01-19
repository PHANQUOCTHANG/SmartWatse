import { Popup } from "react-leaflet";
import { IBinLocation, BinStatus } from "../types/types";
import { Truck, AlertTriangle, Navigation } from "lucide-react";

interface Props {
  bin: IBinLocation;
}

export const BinPopup = ({ bin }: Props) => {
  const isCritical =
    bin.status === BinStatus.OVERLOAD || bin.status === BinStatus.FULL;

  return (
    <Popup className="custom-popup-clean" closeButton={false}>
      <div className="w-[240px] p-1 font-sans">
        {/* Header */}
        <div className="flex justify-between items-start mb-2 border-b pb-2">
          <div>
            <h4 className="font-bold text-gray-800 text-sm">{bin.code}</h4>
            <p className="text-xs text-gray-500 truncate w-32">{bin.address}</p>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              isCritical
                ? "bg-red-100 text-red-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {bin.status}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Dung tích</span>
            <span className="font-semibold">{bin.currentLevel}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                bin.currentLevel > 90
                  ? "bg-red-500"
                  : bin.currentLevel > 70
                    ? "bg-yellow-500"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${bin.currentLevel}%` }}
            />
          </div>
        </div>

        {/* Actions Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-1.5 rounded text-xs font-medium transition-colors">
            <Navigation size={12} />
            Chỉ đường
          </button>

          {isCritical ? (
            <button className="flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 py-1.5 rounded text-xs font-medium transition-colors">
              <AlertTriangle size={12} />
              Xử lý gấp
            </button>
          ) : (
            <button className="flex items-center justify-center gap-1 bg-gray-50 text-gray-600 hover:bg-gray-100 py-1.5 rounded text-xs font-medium transition-colors">
              <Truck size={12} />
              Thu gom
            </button>
          )}
        </div>
      </div>
    </Popup>
  );
};
