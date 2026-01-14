import React, { useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const routesSample = [
  {
    id: "R-01",
    name: "Tuyến Bắc Hà",
    stops: 12,
    status: "Đang chạy",
    coords: [
      [21.036, 105.834],
      [21.04, 105.845],
      [21.05, 105.855],
    ],
  },
  {
    id: "R-02",
    name: "Tuyến Trung Tâm",
    stops: 8,
    status: "Chờ",
    coords: [
      [21.028, 105.82],
      [21.025, 105.83],
      [21.022, 105.835],
    ],
  },
  {
    id: "R-03",
    name: "Tuyến Nam Hà",
    stops: 15,
    status: "Hoàn thành",
    coords: [
      [21.01, 105.84],
      [21.005, 105.85],
      [21.0, 105.86],
    ],
  },
];

export default function StaffMapPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [wheelZoomEnabled, setWheelZoomEnabled] = useState(true);
  const mapRef = useRef<any>(null);

  const filtered = useMemo(() => {
    return routesSample.filter((r) => {
      const matchText = (r.name + r.id)
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [query, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: routesSample.length };
    routesSample.forEach(
      (r) => (counts[r.status] = (counts[r.status] || 0) + 1)
    );
    return counts;
  }, []);

  function fitToRoute(coords: [number, number][]) {
    if (!mapRef.current) return;
    try {
      const map = mapRef.current;
      const bounds = L.latLngBounds(coords as any);
      map.fitBounds(bounds, { padding: [40, 40] });
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
            Bản đồ tuyến đường
          </h1>
          <p className="text-sm text-gray-500">
            Theo dõi và quản lý lộ trình thu gom.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-100 rounded shadow-sm px-3 py-2">
            <input
              className="outline-none text-sm w-48"
              placeholder="Tìm theo tên hoặc mã tuyến"
            />
            <button className="px-3 py-1 bg-primary text-white rounded">
              Tìm
            </button>
          </div>
          <button className="px-3 py-2 bg-green-50 text-green-700 rounded text-sm font-semibold">
            Tạo lộ trình mới
          </button>
        </div>
      </header>

      <main
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <section className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50 rounded-lg border border-gray-100 shadow-sm flex flex-col h-full min-h-0">
          <div
            className="w-full flex-none"
            style={{ height: "60%", position: "relative" }}
          >
            <MapContainer
              whenCreated={(map) => (mapRef.current = map)}
              center={[21.0278, 105.8342]}
              zoom={12}
              scrollWheelZoom={wheelZoomEnabled}
              className="w-full h-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {filtered.map((r) => (
                <React.Fragment key={r.id}>
                  <Polyline
                    positions={r.coords as any}
                    pathOptions={{
                      color:
                        r.status === "Đang chạy"
                          ? "#f59e0b"
                          : r.status === "Hoàn thành"
                          ? "#10b981"
                          : r.status === "Chờ"
                          ? "#6b7280"
                          : "#ef4444",
                      weight: 5,
                    }}
                  />
                  {r.coords.map((c: any, idx: number) => (
                    <CircleMarker
                      key={`${r.id}-stop-${idx}`}
                      center={c}
                      radius={5}
                      pathOptions={{ color: "#2563eb", fillColor: "#2563eb" }}
                    >
                      <Popup>
                        <div className="text-sm font-semibold">{r.name}</div>
                        <div className="text-xs">Điểm {idx + 1}</div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </React.Fragment>
              ))}
            </MapContainer>
            <button
              onClick={() => setWheelZoomEnabled((v) => !v)}
              title="Toggle wheel zoom"
              className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded shadow-sm text-sm border border-gray-100"
            >
              Wheel: {wheelZoomEnabled ? "On" : "Off"}
            </button>
          </div>

          <div className="p-4 overflow-auto flex-1">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="flex items-center gap-2 bg-white border border-gray-100 rounded shadow-sm px-2 py-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="outline-none text-sm w-40"
                  placeholder="Tìm theo tên hoặc mã tuyến"
                />
                <button
                  onClick={() => setQuery("")}
                  className="px-2 py-1 text-sm text-gray-600"
                >
                  X
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm px-2 py-1 border rounded"
              >
                <option value="ALL">Tất cả ({statusCounts.ALL})</option>
                <option value="Đang chạy">
                  Đang chạy ({statusCounts["Đang chạy"] || 0})
                </option>
                <option value="Chờ">Chờ ({statusCounts["Chờ"] || 0})</option>
                <option value="Hoàn thành">
                  Hoàn thành ({statusCounts["Hoàn thành"] || 0})
                </option>
                <option value="Trễ">Trễ ({statusCounts["Trễ"] || 0})</option>
              </select>

              <button className="ml-auto px-3 py-1 bg-green-50 text-green-700 rounded text-sm font-semibold">
                Tạo lộ trình mới
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                >
                  <div>
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="text-xs text-gray-500">
                      {r.stops} điểm dừng • {r.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        r.status === "Đang chạy"
                          ? "bg-amber-100 text-amber-700"
                          : r.status === "Hoàn thành"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {r.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fitToRoute(r.coords as any)}
                        className="px-2 py-1 bg-primary text-white rounded text-sm"
                      >
                        Tập trung
                      </button>
                      <button className="px-2 py-1 bg-white border rounded text-sm">
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="lg:col-span-1 bg-white border border-gray-100 rounded-lg p-4 shadow-sm h-full overflow-auto">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Thông tin nhanh
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex justify-between">
              <span>Tổng tuyến:</span>
              <span className="font-semibold">{routesSample.length}</span>
            </li>
            <li className="flex justify-between">
              <span>Đang chạy:</span>
              <span className="font-semibold text-amber-700">
                {statusCounts["Đang chạy"] || 0}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Hoàn thành:</span>
              <span className="font-semibold text-green-700">
                {statusCounts["Hoàn thành"] || 0}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Trễ:</span>
              <span className="font-semibold text-red-600">
                {statusCounts["Trễ"] || 0}
              </span>
            </li>
          </ul>

          <div className="mt-4">
            <button className="w-full px-3 py-2 bg-primary text-white rounded">
              Xuất báo cáo
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
