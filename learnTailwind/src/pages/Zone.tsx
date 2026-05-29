import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors ' +
  '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>';
const DEFAULT_CENTER: L.LatLngTuple = [-6.9175, 107.6191];
const DEFAULT_ZOOM = 13;
const LS_KEY = "geo_zones_v1";

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

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

interface Zone {
  id: string;
  name: string;
  color: string;
  coordinates: [number, number][];
}

function loadZones(): Zone[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveZonesToLS(zones: Zone[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(zones));
}

/** Escape HTML entities to prevent XSS in Leaflet popup content */
function escHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export default function ZonePage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const zonesGroupRef = useRef<L.LayerGroup | null>(null);
  const drawGroupRef = useRef<L.LayerGroup | null>(null);

  // Drawing state kept in refs so Leaflet event handlers never go stale
  const drawModeRef = useRef(false);
  const drawingPtsRef = useRef<[number, number][]>([]);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingClickRef = useRef<L.LatLng | null>(null);
  const drawPolylineRef = useRef<L.Polyline | null>(null);
  const previewLineRef = useRef<L.Polyline | null>(null);
  const locationMarkerRef = useRef<L.Marker | null>(null);

  // Imperative actions populated inside the map init effect
  const actionsRef = useRef({
    toggleDrawMode: () => {},
    finishDrawing: () => {},
    cancelDrawing: () => {},
  });

  // React state used purely for UI rendering
  const [zones, setZones] = useState<Zone[]>(loadZones);
  const [drawMode, setDrawMode] = useState(false);
  const [ptCount, setPtCount] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<[number, number][]>([]);
  const [formName, setFormName] = useState("");
  const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // ── Map initialisation + Leaflet event setup (runs once) ─────────────────
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

    const zonesGroup = L.layerGroup().addTo(map);
    const drawGroup = L.layerGroup().addTo(map);
    zonesGroupRef.current = zonesGroup;
    drawGroupRef.current = drawGroup;
    mapRef.current = map;

    // ── Drawing helpers ────────────────────────────────────────────────────
    const addPoint = (latlng: L.LatLng) => {
      const pt: [number, number] = [latlng.lat, latlng.lng];
      drawingPtsRef.current = [...drawingPtsRef.current, pt];
      setPtCount(drawingPtsRef.current.length);

      L.circleMarker(latlng, {
        radius: 5,
        color: "#fff",
        fillColor: "#2dd4bf",
        fillOpacity: 1,
        weight: 2,
      }).addTo(drawGroup);

      if (drawPolylineRef.current) drawPolylineRef.current.remove();
      if (drawingPtsRef.current.length > 1) {
        drawPolylineRef.current = L.polyline(drawingPtsRef.current, {
          color: "#2dd4bf",
          weight: 2,
          dashArray: "6 4",
        }).addTo(drawGroup);
      }
    };

    const clearDraw = () => {
      drawGroup.clearLayers();
      drawingPtsRef.current = [];
      drawPolylineRef.current = null;
      previewLineRef.current = null;
      setPtCount(0);
    };

    const exitDrawMode = () => {
      drawModeRef.current = false;
      setDrawMode(false);
      map.getContainer().style.cursor = "";
      map.doubleClickZoom.enable();
    };

    const finishDrawing = () => {
      if (drawingPtsRef.current.length < 3) return;
      setPendingCoords([...drawingPtsRef.current]);
      setFormName("");
      setFormColor(PRESET_COLORS[0]);
      setShowSaveModal(true);
      clearDraw();
      exitDrawMode();
    };

    const cancelDrawing = () => {
      clearDraw();
      exitDrawMode();
    };

    const toggleDrawMode = () => {
      if (drawModeRef.current) {
        cancelDrawing();
      } else {
        drawModeRef.current = true;
        setDrawMode(true);
        map.getContainer().style.cursor = "crosshair";
        map.doubleClickZoom.disable();
      }
    };

    actionsRef.current = { toggleDrawMode, finishDrawing, cancelDrawing };

    // ── Leaflet event listeners ────────────────────────────────────────────
    const handleClick = (e: L.LeafletMouseEvent) => {
      if (!drawModeRef.current) return;
      // Debounce: ignore if a dblclick is about to cancel this
      pendingClickRef.current = e.latlng;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        if (pendingClickRef.current) {
          addPoint(pendingClickRef.current);
          pendingClickRef.current = null;
        }
      }, 250);
    };

    const handleDblClick = () => {
      if (!drawModeRef.current) return;
      // Cancel the pending single-click before finishing
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
        pendingClickRef.current = null;
      }
      finishDrawing();
    };

    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      if (!drawModeRef.current || drawingPtsRef.current.length === 0) return;
      const lastPt = drawingPtsRef.current.at(-1);
      if (!lastPt) return;
      const pts: L.LatLngTuple[] = [lastPt, [e.latlng.lat, e.latlng.lng]];
      if (previewLineRef.current) {
        previewLineRef.current.setLatLngs(pts);
      } else {
        previewLineRef.current = L.polyline(pts, {
          color: "#2dd4bf",
          weight: 1.5,
          dashArray: "4 4",
          opacity: 0.6,
        }).addTo(drawGroup);
      }
    };

    map.on("click", handleClick);
    map.on("dblclick", handleDblClick);
    map.on("mousemove", handleMouseMove);

    return () => {
      map.remove();
      mapRef.current = null;
      zonesGroupRef.current = null;
      drawGroupRef.current = null;
    };
  }, []);

  // ── Escape key cancels active drawing ─────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && drawModeRef.current) {
        actionsRef.current.cancelDrawing();
      }
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, []);

  // ── Re-render saved zones on the map whenever state changes ───────────────
  useEffect(() => {
    const group = zonesGroupRef.current;
    if (!group) return;
    group.clearLayers();
    zones.forEach((zone) => {
      L.polygon(zone.coordinates, {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.2,
        weight: 2,
      })
        .bindPopup(
          `<div style="color:#111;font-size:12px;line-height:1.6">
            <strong>${escHtml(zone.name)}</strong><br/>
            <span style="color:#666">${zone.coordinates.length} vertices</span>
          </div>`
        )
        .addTo(group);
    });
  }, [zones]);

  // ── React UI handlers ─────────────────────────────────────────────────────
  const handleSaveZone = () => {
    if (!formName.trim() || pendingCoords.length < 3) return;
    const newZone: Zone = {
      id: Date.now().toString(),
      name: formName.trim(),
      color: formColor,
      coordinates: pendingCoords,
    };
    const updated = [...zones, newZone];
    setZones(updated);
    saveZonesToLS(updated);
    setShowSaveModal(false);
    setPendingCoords([]);
  };

  const handleDeleteZone = (id: string) => {
    const updated = zones.filter((z) => z.id !== id);
    setZones(updated);
    saveZonesToLS(updated);
  };

  const handleZoomToZone = (zone: Zone) => {
    const map = mapRef.current;
    if (!map) return;
    map.fitBounds(L.polygon(zone.coordinates).getBounds(), { padding: [50, 50] });
  };

  const handleCopyCoords = (zone: Zone) => {
    const text = JSON.stringify(zone.coordinates, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(zone.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const drawingStatusText = (count: number): string => {
    if (count === 0) return "Click on the map to place the first vertex";
    if (count === 1) return "1 point — click to add more";
    if (count === 2) return "2 points — need at least 1 more";
    return `${count} points — finish or keep adding`;
  };

  const locateMe = () => {
    const map = mapRef.current;
    if (!map) return;
    setLocationStatus("loading");

    globalThis.navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;

        if (locationMarkerRef.current) locationMarkerRef.current.remove();

        locationMarkerRef.current = L.marker([lat, lng], { icon: locationIcon })
          .addTo(map)
          .bindPopup(
            `<div style="color:#111;font-size:12px;line-height:1.5">
              <strong>Your Location</strong><br/>
              Lat: ${lat.toFixed(5)}<br/>
              Lng: ${lng.toFixed(5)}<br/>
              Accuracy: \xb1${Math.round(accuracy)}m
            </div>`,
            { offset: [0, -6] }
          )
          .openPopup();

        // L.circle([lat, lng], {
        //   radius: 10,
        //   color: "#2dd4bf",
        //   fillColor: "#2dd4bf",
        //   fillOpacity: 0.08,
        //   weight: 1,
        // }).addTo(map);

        map.flyTo([lat, lng], 16, { duration: 1.5 });
        setCoords({ lat, lng });
        setLocationStatus("success");
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Push Leaflet zoom control below the Back button */}
      <style>{`.zone-page .leaflet-top.leaflet-left { top: 52px; }`}</style>

      {/* Back button — above the zoom control */}
      <div className="absolute top-3 left-3 z-[1001]">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-black/70 border border-white/10 text-white/60 text-sm font-semibold rounded-xl backdrop-blur-md hover:text-teal-400! hover:border-teal-500/30 transition-all duration-200"
        >
          ← Back
        </Link>
      </div>

      {/* Page title — centred at the very top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001]">
        <div className="px-4 py-2 bg-black/70 border border-white/10 text-teal-400 text-sm font-semibold rounded-xl backdrop-blur-md whitespace-nowrap">
          Zone Manager · Draw &amp; Save Polygons
        </div>
      </div>

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        className="absolute top-4 right-4 z-[1001] px-3 py-2 bg-black/70 border border-white/10 text-white/60 text-sm rounded-xl backdrop-blur-md hover:text-teal-400 hover:border-teal-500/30 transition-all duration-200"
        title={sidebarOpen ? "Hide panel" : "Show panel"}
      >
        {sidebarOpen ? "✕ Hide" : "☰ Panel"}
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="absolute top-16 right-4 z-[1000] w-72 max-h-[calc(100vh-5.5rem)] flex flex-col gap-3 bg-black/80 border border-white/10 rounded-2xl backdrop-blur-md p-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm">Zones</span>
            <span className="px-1.5 py-0.5 bg-teal-500/20 text-teal-400 text-xs rounded-full font-mono">
              {zones.length}
            </span>
          </div>

          {/* Draw controls */}
          {drawMode ? (
            <div className="flex flex-col gap-2">
              <div className="px-3 py-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl">
                <p className="text-teal-400 text-xs font-bold mb-0.5 flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse inline-block"
                  />{" "}
                  Drawing Mode Active
                </p>
                <p className="text-teal-300/70 text-xs leading-relaxed">
                  {drawingStatusText(ptCount)}
                </p>
                <p className="text-white/25 text-xs mt-1.5">
                  Double-click map to finish · Esc to cancel
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => actionsRef.current.finishDrawing()}
                  disabled={ptCount < 3}
                  className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black text-sm font-bold rounded-xl transition-all duration-200"
                >
                  Finish
                </button>
                <button
                  onClick={() => actionsRef.current.cancelDrawing()}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 text-sm font-semibold rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => actionsRef.current.toggleDrawMode()}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-black text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-teal-500/20 active:scale-95"
            >
              ✏ Draw New Zone
            </button>
          )}

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Zone list */}
          {zones.length === 0 ? (
            <div className="text-white/20 text-xs text-center py-6 leading-relaxed">
              No zones saved yet.
              <br />
              Draw one to get started.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="group flex flex-col gap-1.5 p-2.5 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.07] transition-all duration-150"
                >
                  <div className="flex items-center gap-2">
                    {/* Color dot */}
                    <div
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-1 ring-white/20"
                      style={{ background: zone.color }}
                    />
                    {/* Name → click to zoom */}
                    <button
                      onClick={() => handleZoomToZone(zone)}
                      className="flex-1 text-left text-white/80 text-xs font-semibold hover:text-white transition-colors truncate"
                      title="Click to zoom to zone"
                    >
                      {zone.name}
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteZone(zone.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 text-xs px-0.5 transition-all duration-150 flex-shrink-0"
                      title="Delete zone"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center gap-3 pl-5">
                    <span className="text-white/25 text-xs">
                      {zone.coordinates.length} vertices
                    </span>
                    <button
                      onClick={() => handleCopyCoords(zone)}
                      className="text-white/25 hover:text-teal-400 text-xs transition-colors"
                      title="Copy coordinates as JSON"
                    >
                      {copiedId === zone.id ? "✓ Copied!" : "⎘ Copy coords"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      )}

      {/* Save modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-[22rem] shadow-2xl">
            <h3 className="text-white font-bold text-base mb-0.5">Save Zone</h3>
            <p className="text-white/30 text-xs mb-5">
              {pendingCoords.length} vertices captured
            </p>

            {/* Zone name */}
            <label
              htmlFor="zone-name"
              className="block text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1.5"
            >
              Zone Name
            </label>
            <input
              id="zone-name"
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveZone()}
              placeholder="e.g. Zone A, Perimeter, Restricted…"
              maxLength={50}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-teal-500/60 focus:bg-white/[0.07] mb-5 transition-colors"
              autoFocus
            />

            {/* Color presets */}
            <p className="block text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">
              Zone Color
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setFormColor(c)}
                  className="w-8 h-8 rounded-full border-2 transition-all duration-150 active:scale-90"
                  style={{
                    background: c,
                    borderColor: formColor === c ? "#fff" : "transparent",
                    transform: formColor === c ? "scale(1.18)" : "scale(1)",
                    boxShadow: formColor === c ? `0 0 0 3px ${c}55` : "none",
                  }}
                />
              ))}
            </div>

            {/* Custom color */}
            <div className="flex items-center gap-3 mb-4">
              <input
                type="color"
                value={formColor}
                onChange={(e) => setFormColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                title="Pick a custom color"
              />
              <span className="text-white/30 text-xs">Custom color</span>
              <span className="ml-auto text-white/50 text-xs font-mono">
                {formColor.toUpperCase()}
              </span>
            </div>

            {/* Color preview */}
            <div
              className="w-full h-8 rounded-xl mb-5 border"
              style={{
                background: `${formColor}30`,
                borderColor: formColor,
              }}
            />

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setPendingCoords([]);
                }}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 text-sm font-semibold rounded-xl transition-all duration-200"
              >
                Discard
              </button>
              <button
                onClick={handleSaveZone}
                disabled={!formName.trim()}
                className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed text-black text-sm font-bold rounded-xl transition-all duration-200 active:scale-95"
              >
                Save Zone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locate Me button — bottom-left so it doesn't overlap the sidebar */}
      <div className="absolute bottom-8 left-4 z-[1000] flex flex-col items-start gap-2">
        {locationStatus === "error" && (
          <div className="px-3 py-1.5 bg-red-900/80 border border-red-500/30 text-red-300 text-xs rounded-lg backdrop-blur-md">
            Location access denied
          </div>
        )}
        {locationStatus === "success" && coords && (
          <div className="px-3 py-1.5 bg-black/70 border border-teal-500/30 text-teal-400 text-xs rounded-lg backdrop-blur-md font-mono">
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
      <div ref={mapContainerRef} className="zone-page w-full h-full" />
    </div>
  );
}
