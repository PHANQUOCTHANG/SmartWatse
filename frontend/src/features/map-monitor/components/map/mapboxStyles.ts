import { BinStatus } from "../../types/types";

export const MAPBOX_STYLE = "mapbox://styles/mapbox/streets-v12";
// Gợi ý khác:
// mapbox://styles/mapbox/dark-v11
// mapbox://styles/mapbox/light-v11
// mapbox://styles/mapbox/satellite-streets-v12

export const getMarkerColor = (status: BinStatus) => {
  switch (status) {
    case "OVERFLOW":
      return "#ef4444"; // red
    case "NEARLY_FULL":
      return "#facc15"; // yellow
    case "EMPTY":
      return "#22c55e"; // green
    default:
      return "#64748b"; // slate
  }
};
