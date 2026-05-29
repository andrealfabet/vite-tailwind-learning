import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors ' +
  '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>';

// Default center: Bandung, Indonesia
const DEFAULT_CENTER: L.LatLngTuple = [-6.9175, 107.6191];
const DEFAULT_ZOOM = 13;

const locationIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:18px;height:18px;
    background:#2dd4bf;
    border:3px solid #fff;
    border-radius:50%;
    box-shadow:0 0 0 4px rgba(45,212,191,0.35);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

type LocationStatus = "idle" | "loading" | "success" | "error";

function Maps() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      subdomains: ["a", "b", "c", "d"],
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const locateMe = () => {
    if (!mapRef.current) return;
    setLocationStatus("loading");

    globalThis.navigator.geolocation.getCurrentPosition(
      (pos) => {
        const map = mapRef.current;
        if (!map) return;
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;

        // Remove previous marker
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Add marker at user location
        const marker = L.marker([lat, lng], { icon: locationIcon })
          .addTo(map)
          .bindPopup(
            `<div style="color:#111;font-size:12px;line-height:1.5">
              <strong>Your Location</strong><br/>
              Lat: ${lat.toFixed(5)}<br/>
              Lng: ${lng.toFixed(5)}<br/>
              Accuracy: ±${Math.round(accuracy)}m
            </div>`,
            { offset: [0, -6] }
          )
          .openPopup();

        markerRef.current = marker;

        // Add accuracy circle
        L.circle([lat, lng], {
          radius: accuracy,
          color: "#2dd4bf",
          fillColor: "#2dd4bf",
          fillOpacity: 0.08,
          weight: 1,
        }).addTo(map);

        map.flyTo([lat, lng], 16, { duration: 1.5 });
        setCoords({ lat, lng });
        setLocationStatus("success");
      },
      () => {
        setLocationStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Push Leaflet zoom control below the Back button */}
      <style>{`.maps-page .leaflet-top.leaflet-left { top: 52px; }`}</style>

      {/* Back button — above the zoom control */}
      <div className="absolute top-3 left-3 z-[1000]">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-black/70 border border-white/10 text-white/60 text-sm font-semibold rounded-xl backdrop-blur-md hover:text-teal-400! hover:border-teal-500/30 transition-all duration-200"
        >
          ← Back
        </Link>
      </div>

      {/* Map label */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="px-4 py-2 bg-black/70 border border-white/10 text-teal-400 text-sm font-semibold rounded-xl backdrop-blur-md">
          GeoFence Map · OpenStreetMap
        </div>
      </div>

      {/* Locate Me button */}
      <div className="absolute bottom-8 right-4 z-[1000] flex flex-col items-end gap-2">
        {locationStatus === "error" && (
          <div className="px-3 py-1.5 bg-red-900/80 border border-red-500/30 text-red-300 text-xs rounded-lg backdrop-blur-md">
            Location access denied
          </div>
        )}
        {locationStatus === "success" && coords && (
          <div className="px-3 py-1.5 bg-black/70 border border-teal-500/30 text-teal-400 text-xs rounded-lg backdrop-blur-md">
            {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </div>
        )}
        <button
          onClick={locateMe}
          disabled={locationStatus === "loading"}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-60 text-black text-sm font-semibold rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200"
        >
          {locationStatus === "loading" ? (
            <>
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
              Locating…
            </>
          ) : (
            <>⊙ My Location</>
          )}
        </button>
      </div>

      {/* Map container */}
      <div ref={mapContainerRef} className="maps-page w-full h-full" />
    </div>
  );
}

export default Maps;
