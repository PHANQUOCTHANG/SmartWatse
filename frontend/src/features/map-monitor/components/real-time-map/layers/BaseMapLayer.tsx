import React from "react";
import { LayersControl, TileLayer } from "react-leaflet";

const BaseMapLayer = () => {
  return (
    <LayersControl position="bottomleft">
      {/* 1. Bản đồ Sáng (Mặc định) - Tối ưu cho hiển thị lộ trình & icon màu */}
      <LayersControl.BaseLayer checked name="Bản đồ Sáng (Positron)">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
      </LayersControl.BaseLayer>

      {/* 2. Bản đồ Chi tiết (Voyager) - Giống Google Maps, dễ nhìn đường xá */}
      <LayersControl.BaseLayer name="Bản đồ Chi tiết (Voyager)">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
      </LayersControl.BaseLayer>

      {/* 3. Bản đồ Tối (Dark Matter) - Dành cho Dashboard/Monitor ban đêm */}
      <LayersControl.BaseLayer name="Bản đồ Tối (Dark Mode)">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
      </LayersControl.BaseLayer>

      {/* 4. Bản đồ Vệ tinh (Esri World Imagery) - Kiểm tra thực địa */}
      <LayersControl.BaseLayer name="Vệ tinh (Thực địa)">
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      </LayersControl.BaseLayer>
    </LayersControl>
  );
};

export default React.memo(BaseMapLayer);
