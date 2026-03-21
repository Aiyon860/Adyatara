"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { CardImage, type CardImageProps } from "@/components/card-level-select";
import { NavbarMap } from "@/components/navbar-map";
import type { StyleSpecification } from "maplibre-gl";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  type MapViewport,
} from "@/components/ui/map";

// ─── Custom colour palette ─────────────────────────────────────────────────
const SEA = "#080407"; // ocean / water fill
const LAND = "#7C444F"; // continent / island fill
const EDGE = "#E16A54"; // coastline / border stroke
const LABEL = "#E8C0A8"; // place-name text
// ──────────────────────────────────────────────────────────────────────────

const CUSTOM_MAP_STYLE: StyleSpecification = {
  version: 8,
  name: "Visual Novel",
  sources: {
    carto: {
      type: "vector",
      url: "https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json",
    },
  },
  glyphs: "https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf",
  sprite: "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/sprite",
  layers: [
    // ── Land (everything that is not water) ──────────────────────────────
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": LAND,
        "background-opacity": 1,
      },
    } as StyleSpecification["layers"][number],

    // ── Ocean / sea / lake fill ───────────────────────────────────────────
    {
      id: "water",
      type: "fill",
      source: "carto",
      "source-layer": "water",
      filter: ["==", "$type", "Polygon"],
      paint: {
        "fill-color": SEA,
        "fill-antialias": true,
        "fill-opacity": 1,
      },
    } as StyleSpecification["layers"][number],

    // ── Coastline – outline where water meets land ────────────────────────
    {
      id: "coastline",
      type: "line",
      source: "carto",
      "source-layer": "water",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": EDGE,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          0.5,
          4,
          0.8,
          6,
          1.0,
          10,
          1.5,
        ],
        "line-opacity": 1,
      },
    } as StyleSpecification["layers"][number],

    // ── Waterways (rivers, canals) ────────────────────────────────────────
    {
      id: "waterway",
      type: "line",
      source: "carto",
      "source-layer": "waterway",
      minzoom: 8,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": SEA,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          0.5,
          12,
          1.5,
          16,
          3,
        ],
        "line-opacity": 0.9,
      },
    } as StyleSpecification["layers"][number],

    // ── Country / admin-level-2 border ────────────────────────────────────
    {
      id: "boundary_country",
      type: "line",
      source: "carto",
      "source-layer": "boundary",
      minzoom: 0,
      filter: ["all", ["==", "admin_level", 2], ["==", "maritime", 0]],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": EDGE,
        "line-opacity": 0.55,
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          0.5,
          6,
          1.0,
          10,
          1.2,
        ],
      },
    } as StyleSpecification["layers"][number],

    // ── Continent labels (zoom 0-2) ───────────────────────────────────────
    {
      id: "place_continent",
      type: "symbol",
      source: "carto",
      "source-layer": "place",
      minzoom: 0,
      maxzoom: 2,
      filter: ["==", "class", "continent"],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": [
          "Montserrat Medium",
          "Open Sans Bold",
          "Noto Sans Regular",
        ],
        "text-transform": "uppercase",
        "text-size": 16,
        "text-letter-spacing": 0.1,
        "text-max-width": 9,
      },
      paint: {
        "text-color": EDGE,
        "text-halo-color": SEA,
        "text-halo-width": 1,
      },
    } as StyleSpecification["layers"][number],

    // ── Country labels – major nations (zoom 2-7) ─────────────────────────
    {
      id: "place_country_1",
      type: "symbol",
      source: "carto",
      "source-layer": "place",
      minzoom: 2,
      maxzoom: 7,
      filter: ["all", ["==", "class", "country"], ["<=", "rank", 2]],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": [
          "Montserrat Medium",
          "Open Sans Bold",
          "Noto Sans Regular",
        ],
        "text-size": ["interpolate", ["linear"], ["zoom"], 3, 13, 6, 16],
        "text-transform": "uppercase",
        "text-max-width": 9,
      },
      paint: {
        "text-color": EDGE,
        "text-halo-color": SEA,
        "text-halo-width": 1,
      },
    } as StyleSpecification["layers"][number],

    // ── Country labels – smaller nations (zoom 3-10) ──────────────────────
    {
      id: "place_country_2",
      type: "symbol",
      source: "carto",
      "source-layer": "place",
      minzoom: 3,
      maxzoom: 10,
      filter: ["all", ["==", "class", "country"], [">=", "rank", 3]],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": [
          "Montserrat Medium",
          "Open Sans Bold",
          "Noto Sans Regular",
        ],
        "text-size": ["interpolate", ["linear"], ["zoom"], 3, 12, 8, 15],
        "text-transform": "uppercase",
      },
      paint: {
        "text-color": EDGE,
        "text-halo-color": SEA,
        "text-halo-width": 1,
      },
    } as StyleSpecification["layers"][number],

    // ── Major city dots (zoom 4-8) ────────────────────────────────────────
    {
      id: "place_city_dot",
      type: "symbol",
      source: "carto",
      "source-layer": "place",
      minzoom: 4,
      maxzoom: 8,
      filter: ["all", ["==", "class", "city"], ["<=", "rank", 4]],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": [
          "Montserrat Medium",
          "Open Sans Bold",
          "Noto Sans Regular",
        ],
        "text-size": 16,
        "text-anchor": "right",
        "text-max-width": 8,
        "text-offset": [0.2, 0.2],
      },
      paint: {
        "text-color": LABEL,
        "text-halo-color": SEA,
        "text-halo-width": 1,
      },
    } as StyleSpecification["layers"][number],

    // ── City labels at closer zoom (zoom 8-15) ────────────────────────────
    {
      id: "place_city",
      type: "symbol",
      source: "carto",
      "source-layer": "place",
      minzoom: 8,
      maxzoom: 15,
      filter: ["==", "class", "city"],
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": [
          "Montserrat Medium",
          "Open Sans Bold",
          "Noto Sans Regular",
        ],
        "text-size": ["interpolate", ["linear"], ["zoom"], 8, 14, 14, 20],
        "text-transform": "uppercase",
        "text-max-width": 10,
        "text-offset": [0.2, 0.2],
      },
      paint: {
        "text-color": LABEL,
        "text-halo-color": SEA,
        "text-halo-width": 1,
      },
    } as StyleSpecification["layers"][number],
  ],
};

// ─── Location data ─────────────────────────────────────────────────────────
type Location = {
  id: number;
  name: string;
  lng: number;
  lat: number;
  card: CardImageProps;
};

const locations: Location[] = [
  {
    id: 1,
    name: "Jawa Tengah",
    lng: 110.1402,
    lat: -7.15,
    card: {
      image: "https://placehold.co/600x400",
      imageAlt: "Jawa Tengah",
      badge: "Level 1",
      title: "Jawa Tengah",
      description: "Jantung budaya Jawa dengan warisan keraton dan batik.",
    },
  },
  {
    id: 2,
    name: "Kalimantan",
    lng: 114.5908,
    lat: -3.3194,
    card: {
      image: "https://placehold.co/600x400",
      imageAlt: "Kalimantan",
      badge: "Level 2",
      title: "Kalimantan",
      description: "Hutan hujan tropis terluas di Indonesia, rumah orangutan.",
    },
  },
  {
    id: 3,
    name: "Papua",
    lng: 140.7181,
    lat: -2.5337,
    card: {
      image: "https://placehold.co/600x400",
      imageAlt: "Papua",
      badge: "Level 3",
      title: "Papua",
      description: "Tanah yang kaya budaya asli dan keindahan alam terpencil.",
    },
  },
  {
    id: 4,
    name: "Sulawesi",
    lng: 119.4124,
    lat: -5.1477,
    card: {
      image: "https://placehold.co/600x400",
      imageAlt: "Sulawesi",
      badge: "Level 4",
      title: "Sulawesi",
      description: "Pulau unik berbentuk K dengan tradisi Toraja yang megah.",
    },
  },
  {
    id: 5,
    name: "Sumatera Barat",
    lng: 100.3543,
    lat: -0.9471,
    card: {
      image: "https://placehold.co/600x400",
      imageAlt: "Sumatera Barat",
      badge: "Level 5",
      title: "Sumatera Barat",
      description: "Negeri Minangkabau dengan adat matrilineal dan rendang.",
    },
  },
  {
    id: 6,
    name: "Jawa Barat",
    lng: 107.6191,
    lat: -6.9175,
    card: {
      image: "https://placehold.co/600x400",
      imageAlt: "Jawa Barat",
      badge: "Level 6",
      title: "Jawa Barat",
      description: "Tanah Sunda dengan seni angklung dan pesona alam Priangan.",
    },
  },
];

// ─── Component ─────────────────────────────────────────────────────────────
export function ControlledMapExample() {
  const [viewport, setViewport] = useState<MapViewport>({
    center: [118.872, -1.392],
    zoom: 4.7,
    bearing: 0,
    pitch: 0,
  });

  return (
    <div className="h-screen bg-[#080407]">
      <NavbarMap />
      <div className="absolute top-28 left-0 right-0 z-10 flex flex-col items-center pt-4 pointer-events-none">
        <p className="text-base text-[#E16A54] mt-1 tracking-widest uppercase">
          Peta Nusantara
        </p>
        <h1 className="text-4xl font-bold text-white tracking-wide font-kurale">
          Pilih Provinsi
        </h1>
      </div>
      <div className="h-full pt-28 p-4">
        <Map
          viewport={viewport}
          onViewportChange={setViewport}
          styles={{ dark: CUSTOM_MAP_STYLE, light: CUSTOM_MAP_STYLE }}
        >
          {locations.map((location) => (
            <MapMarker
              key={location.id}
              longitude={location.lng}
              latitude={location.lat}
            >
              <MarkerContent>
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute rounded-full bg-primary"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    style={{ width: 48, height: 48 }}
                  />
                  <motion.div
                    className="absolute rounded-full bg-primary"
                    animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.6,
                    }}
                    style={{ width: 48, height: 48 }}
                  />
                  <div className="relative size-12 rounded-full border-2 border-white bg-primary shadow-lg flex items-center justify-center">
                    <MapPin className="size-5 text-white" />
                  </div>
                </div>
              </MarkerContent>
              <MarkerTooltip className="text-base">
                {location.name}
              </MarkerTooltip>
              <MarkerPopup className="bg-transparent p-0 shadow-none border-0 w-80">
                <CardImage {...location.card} />
              </MarkerPopup>
            </MapMarker>
          ))}
        </Map>
      </div>
    </div>
  );
}
