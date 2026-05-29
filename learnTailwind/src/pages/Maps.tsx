import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

const TILE_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/" target="_blank" rel="noopener noreferrer">Stadia Maps</a> ' +
  '&copy; <a href="https://openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> ' +
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

// Default center: Bandung, Indonesia
const DEFAULT_CENTER: L.LatLngTuple = [-6.9175, 107.6191];
const DEFAULT_ZOOM = 13;

function Maps() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-black/70 hover:bg-black/90 border border-white/10 hover:border-teal-500/40 text-white text-sm font-medium rounded-xl backdrop-blur-md transition-all duration-200"
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

      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

export default Maps;
