"use client";

import { useEffect, useState } from "react";
import { MapContainer, GeoJSON, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Region definitions matching the screenshot
const regions = [
  { id: "sumatra", name: "SUMATRA", coords: [-0.5897, 101.3431], status: "aktif" }, // Aktif = Glowing red circle
  { id: "jawa", name: "JAWA", coords: [-7.6145, 110.7128], status: "aktif" },
  { id: "kalimantan", name: "KALIMANTAN", coords: [0.9619, 114.5548], status: "aktif" },
  { id: "sulawesi", name: "SULAWESI", coords: [-2.8441, 120.8718], status: "aktif" },
  { id: "bali-nusa", name: "BALI & NUSA TENGGARA", coords: [-8.6500, 117.1000], status: "aktif" },
  { id: "papua", name: "PAPUA", coords: [-4.2699, 138.0803], status: "aktif" }
];

export default function DashboardMap() {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("/indonesia.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON", err));
  }, []);

  const createCustomIcon = (status: string, name: string) => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="relative flex flex-col items-center justify-center translate-y-[-50%] translate-x-[-50%]">
          <!-- Glow effects -->
          <div class="absolute w-20 h-20 rounded-full bg-[#E86B52] opacity-20 blur-xl"></div>
          <div class="absolute w-12 h-12 rounded-full bg-[#E86B52] opacity-30 shadow-[0_0_15px_rgba(232,107,82,0.8)]"></div>
          <!-- Inner circle -->
          <div class="relative w-8 h-8 rounded-full border border-[#E86B52] bg-[#0A0705] flex items-center justify-center z-10 hover:scale-110 transition-transform cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E86B52" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="absolute -bottom-6 text-[9px] tracking-[0.2em] text-[#E86B52] font-semibold whitespace-nowrap drop-shadow-md">${name}</div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  if (!geoData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-[#E86B52] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <MapContainer
        center={[-2.5, 118]} // Center of Indonesia
        zoom={5}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
        dragging={true}
        className="w-full h-full bg-[#0A0705]"
        style={{
            background: "#0A0705"
        }}
      >
        <GeoJSON
          data={geoData}
          style={{
            color: "#6b332b", // slightly darker than the marker
            weight: 1,
            fillColor: "#170c09",
            fillOpacity: 0.6,
          }}
          onEachFeature={(feature, layer) => {
            layer.on({
                mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                        color: "#E86B52",
                        weight: 1.5,
                        fillColor: "#2a1410",
                    });
                    layer.bringToFront();
                },
                mouseout: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                        color: "#6b332b",
                        weight: 1,
                        fillColor: "#170c09",
                    });
                }
            });
          }}
        />

        {regions.map((region) => (
          <Marker
            key={region.id}
            position={region.coords as [number, number]}
            icon={createCustomIcon(region.status, region.name)}
            eventHandlers={{
                click: () => {
                    window.location.href = `/game?region=${region.id}`;
                }
            }}
          />
        ))}

      </MapContainer>
    </div>
  );
}