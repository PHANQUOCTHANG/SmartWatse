import L from "leaflet";

function createBinIcon(color: string, active = false) {
  return L.divIcon({
    className: "bin-marker",
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
      ">
        ${
          active
            ? `<div style="
                position:absolute;
                inset:0;
                border-radius:50%;
                background:${color};
                opacity:0.3;
                filter: blur(6px);
              "></div>`
            : ""
        }

        <div style="
          position:absolute;
          inset:6px;
          border-radius:50%;
          background:${color};
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12.5A2 2 0 0 1 15.5 23h-7a2 2 0 0 1-2-1.5L5 9zm5-5h4l1 1H9l1-1z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export function getBinIcon(
  status: "OVERLOAD" | "PENDING" | "COMPLETED",
  active: boolean
) {
  switch (status) {
    case "OVERLOAD":
      return createBinIcon("#ef4444", active); // đỏ
    case "COMPLETED":
      return createBinIcon("#22c55e", active); // xanh
    default:
      return createBinIcon("#facc15", active); // vàng
  }
}
