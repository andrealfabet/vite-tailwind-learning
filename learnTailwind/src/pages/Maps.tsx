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
const LS_KEY_PINS = "geo_pins_v1";

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
type LocationError = "denied" | "unavailable" | "timeout" | null;

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

function escHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

interface Pin {
  id: string;
  name: string;
  color: string;
  lat: number;
  lng: number;
}

function loadPins(): Pin[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY_PINS) ?? "[]");
  } catch {
    return [];
  }
}

function savePinsToLS(pins: Pin[]): void {
  localStorage.setItem(LS_KEY_PINS, JSON.stringify(pins));
}

function createPinIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.5))">
      <div style="width:22px;height:22px;background:${escHtml(color)};border:3px solid #fff;border-radius:50%;"></div>
      <div style="width:2px;height:10px;background:#fff;"></div>
    </div>`,
    iconSize: [22, 32],
    iconAnchor: [11, 32],
    popupAnchor: [0, -34],
  });
}

function Maps() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const zonesGroupRef = useRef<L.LayerGroup | null>(null);
  const drawGroupRef = useRef<L.LayerGroup | null>(null);

  // Drawing state refs
  const drawModeRef = useRef(false);
  const drawingPtsRef = useRef<[number, number][]>([]);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingClickRef = useRef<L.LatLng | null>(null);
  const drawPolylineRef = useRef<L.Polyline | null>(null);
  const previewLineRef = useRef<L.Polyline | null>(null);
  const locationMarkerRef = useRef<L.Marker | null>(null);

  const actionsRef = useRef({
    toggleDrawMode: () => {},
    finishDrawing: () => {},
    cancelDrawing: () => {},
  });

  const pinsGroupRef = useRef<L.LayerGroup | null>(null);
  const pinModeRef = useRef(false);
  const pinClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinActionsRef = useRef({
    togglePinMode: () => {},
    cancelPinMode: () => {},
  });

  // UI state
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
  const [locationError, setLocationError] = useState<LocationError>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [pins, setPins] = useState<Pin[]>(loadPins);
  const [pinMode, setPinMode] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingPin, setPendingPin] = useState<{ lat: number; lng: number } | null>(null);
  const [pinFormName, setPinFormName] = useState("");
  const [pinFormColor, setPinFormColor] = useState(PRESET_COLORS[0]);
  const [copiedPinId, setCopiedPinId] = useState<string | null>(null);

  // Check geolocation permission state on mount
  useEffect(() => {
    if (!globalThis.navigator?.permissions) return;
    globalThis.navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "denied") {
          setLocationError("denied");
          setLocationStatus("error");
        }
        result.onchange = () => {
          if (result.state === "denied") {
            setLocationError("denied");
            setLocationStatus("error");
          } else if (result.state === "granted" || result.state === "prompt") {
            setLocationStatus("idle");
            setLocationError(null);
          }
        };
      })
      .catch(() => {/* permissions API not supported, ignore */});
  }, []);

  // ── Map init + drawing events ─────────────────────────────────────────────
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
    const pinsGroup = L.layerGroup().addTo(map);
    zonesGroupRef.current = zonesGroup;
    drawGroupRef.current = drawGroup;
    pinsGroupRef.current = pinsGroup;
    mapRef.current = map;

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

    const cancelPinMode = () => {
      if (pinClickTimerRef.current) {
        clearTimeout(pinClickTimerRef.current);
        pinClickTimerRef.current = null;
      }
      pinModeRef.current = false;
      setPinMode(false);
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
        cancelPinMode();
        drawModeRef.current = true;
        setDrawMode(true);
        map.getContainer().style.cursor = "crosshair";
        map.doubleClickZoom.disable();
      }
    };

    actionsRef.current = { toggleDrawMode, finishDrawing, cancelDrawing };

    const togglePinMode = () => {
      if (pinModeRef.current) {
        cancelPinMode();
      } else {
        cancelDrawing();
        pinModeRef.current = true;
        setPinMode(true);
        map.getContainer().style.cursor = "crosshair";
        map.doubleClickZoom.disable();
      }
    };

    pinActionsRef.current = { togglePinMode, cancelPinMode };

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (pinModeRef.current) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        if (pinClickTimerRef.current) clearTimeout(pinClickTimerRef.current);
        pinClickTimerRef.current = setTimeout(() => {
          pinClickTimerRef.current = null;
          pinModeRef.current = false;
          setPinMode(false);
          map.getContainer().style.cursor = "";
          map.doubleClickZoom.enable();
          setPendingPin({ lat, lng });
          setPinFormName("");
          setPinFormColor(PRESET_COLORS[0]);
          setShowPinModal(true);
        }, 250);
        return;
      }
      if (!drawModeRef.current) return;
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
      if (pinModeRef.current) {
        if (pinClickTimerRef.current) {
          clearTimeout(pinClickTimerRef.current);
          pinClickTimerRef.current = null;
        }
        return;
      }
      if (!drawModeRef.current) return;
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
      pinsGroupRef.current = null;
    };
  }, []);

  // ── Escape cancels drawing ────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (drawModeRef.current) actionsRef.current.cancelDrawing();
        else if (pinModeRef.current) pinActionsRef.current.cancelPinMode();
      }
    };
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, []);

  // ── Re-render saved zones ─────────────────────────────────────────────────
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

  // ── Re-render saved pins ──────────────────────────────────────────────────
  useEffect(() => {
    const group = pinsGroupRef.current;
    if (!group) return;
    group.clearLayers();
    pins.forEach((pin) => {
      L.marker([pin.lat, pin.lng], { icon: createPinIcon(pin.color) })
        .bindPopup(
          `<div style="color:#111;font-size:12px;line-height:1.6">
            <strong>${escHtml(pin.name)}</strong><br/>
            <span style="color:#666">${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}</span>
          </div>`
        )
        .addTo(group);
    });
  }, [pins]);

  // ── Handlers ──────────────────────────────────────────────────────────────
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
    mapRef.current?.fitBounds(L.polygon(zone.coordinates).getBounds(), { padding: [50, 50] });
  };

  const handleCopyCoords = (zone: Zone) => {
    navigator.clipboard.writeText(JSON.stringify(zone.coordinates, null, 2)).then(() => {
      setCopiedId(zone.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const handleSavePin = () => {
    if (!pinFormName.trim() || !pendingPin) return;
    const newPin: Pin = {
      id: Date.now().toString(),
      name: pinFormName.trim(),
      color: pinFormColor,
      lat: pendingPin.lat,
      lng: pendingPin.lng,
    };
    const updated = [...pins, newPin];
    setPins(updated);
    savePinsToLS(updated);
    setShowPinModal(false);
    setPendingPin(null);
  };

  const handleDeletePin = (id: string) => {
    const updated = pins.filter((p) => p.id !== id);
    setPins(updated);
    savePinsToLS(updated);
  };

  const handleZoomToPin = (pin: Pin) => {
    mapRef.current?.setView([pin.lat, pin.lng], 17, { animate: true });
  };

  const handleCopyPinCoords = (pin: Pin) => {
    navigator.clipboard
      .writeText(JSON.stringify({ lat: pin.lat, lng: pin.lng }, null, 2))
      .then(() => {
        setCopiedPinId(pin.id);
        setTimeout(() => setCopiedPinId(null), 1500);
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
    setLocationError(null);

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
        //   radius: 50,
        //   color: "#2dd4bf",
        //   fillColor: "#2dd4bf",
        //   fillOpacity: 0.08,
        //   weight: 1,
        // }).addTo(map);

        map.flyTo([lat, lng], 16, { duration: 1.5 });
        setCoords({ lat, lng });
        setLocationStatus("success");
      },
      (err) => {
        let errorType: LocationError = "unavailable";
        if (err.code === 1) errorType = "denied";
        else if (err.code === 3) errorType = "timeout";
        setLocationError(errorType);
        setLocationStatus("error");
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <style>{`.maps-page .leaflet-top.leaflet-left { top: 52px; }`}</style>

      {/* Back button */}
      <div className="absolute top-3 left-3 z-[1001]">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-black/70 border border-white/10 text-white/60 text-sm font-semibold rounded-xl backdrop-blur-md hover:text-teal-400! hover:border-teal-500/30 transition-all duration-200"
        >
          ← Back
        </Link>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001]">
        <div className="px-4 py-2 bg-black/70 border border-white/10 text-teal-400 text-sm font-semibold rounded-xl backdrop-blur-md whitespace-nowrap">
          GeoFence Map · Zone Manager
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
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm">Zones</span>
            <span className="px-1.5 py-0.5 bg-teal-500/20 text-teal-400 text-xs rounded-full font-mono">
              {zones.length}
            </span>
          </div>

          {drawMode ? (
            <div className="flex flex-col gap-2">
              <div className="px-3 py-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl">
                <p className="text-teal-400 text-xs font-bold mb-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse inline-block" />{" "}
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

          <div className="border-t border-white/5" />

          {zones.length === 0 ? (
            <div className="text-white/20 text-xs text-center py-6 leading-relaxed">
              No zones saved yet.<br />Draw one to get started.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="group flex flex-col gap-1.5 p-2.5 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.07] transition-all duration-150"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-1 ring-white/20"
                      style={{ background: zone.color }}
                    />
                    <button
                      onClick={() => handleZoomToZone(zone)}
                      className="flex-1 text-left text-white/80 text-xs font-semibold hover:text-white transition-colors truncate"
                      title="Click to zoom to zone"
                    >
                      {zone.name}
                    </button>
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
          <div className="border-t border-white/5" />

          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm">Pins</span>
            <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full font-mono">
              {pins.length}
            </span>
          </div>

          {pinMode ? (
            <div className="flex flex-col gap-2">
              <div className="px-3 py-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <p className="text-purple-400 text-xs font-bold mb-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse inline-block" />{" "}
                  Pin Mode Active
                </p>
                <p className="text-purple-300/70 text-xs leading-relaxed">
                  Click on the map to place a pin
                </p>
                <p className="text-white/25 text-xs mt-1.5">Esc to cancel</p>
              </div>
              <button
                onClick={() => pinActionsRef.current.cancelPinMode()}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 text-sm font-semibold rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => pinActionsRef.current.togglePinMode()}
              className="w-full py-2.5 bg-purple-500 hover:bg-purple-400 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/20 active:scale-95"
            >
              📍 Place New Pin
            </button>
          )}

          {pins.length === 0 ? (
            <div className="text-white/20 text-xs text-center py-4 leading-relaxed">
              No pins saved yet.<br />Click "Place New Pin" to add one.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {pins.map((pin) => (
                <div
                  key={pin.id}
                  className="group flex flex-col gap-1.5 p-2.5 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.07] transition-all duration-150"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-1 ring-white/20"
                      style={{ background: pin.color }}
                    />
                    <button
                      onClick={() => handleZoomToPin(pin)}
                      className="flex-1 text-left text-white/80 text-xs font-semibold hover:text-white transition-colors truncate"
                      title="Click to zoom to pin"
                    >
                      {pin.name}
                    </button>
                    <button
                      onClick={() => handleDeletePin(pin.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 text-xs px-0.5 transition-all duration-150 flex-shrink-0"
                      title="Delete pin"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center gap-3 pl-5">
                    <span className="text-white/25 text-xs font-mono">
                      {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
                    </span>
                    <button
                      onClick={() => handleCopyPinCoords(pin)}
                      className="text-white/25 hover:text-purple-400 text-xs transition-colors"
                      title="Copy coordinates as JSON"
                    >
                      {copiedPinId === pin.id ? "✓ Copied!" : "⍘ Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}        </aside>
      )}

      {/* Save modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-[22rem] shadow-2xl">
            <h3 className="text-white font-bold text-base mb-0.5">Save Zone</h3>
            <p className="text-white/30 text-xs mb-5">
              {pendingCoords.length} vertices captured
            </p>

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

            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">
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

            <div
              className="w-full h-8 rounded-xl mb-5 border"
              style={{ background: `${formColor}30`, borderColor: formColor }}
            />

            <div className="flex gap-2">
              <button
                onClick={() => { setShowSaveModal(false); setPendingCoords([]); }}
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

      {/* Pin save modal */}
      {showPinModal && pendingPin && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 w-[22rem] shadow-2xl">
            <h3 className="text-white font-bold text-base mb-0.5">Save Pin</h3>
            <p className="text-white/30 text-xs mb-5 font-mono">
              {pendingPin.lat.toFixed(5)}, {pendingPin.lng.toFixed(5)}
            </p>

            <label
              htmlFor="pin-name"
              className="block text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1.5"
            >
              Pin Name
            </label>
            <input
              id="pin-name"
              type="text"
              value={pinFormName}
              onChange={(e) => setPinFormName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSavePin()}
              placeholder="e.g. Meeting point, Office, Home…"
              maxLength={50}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-purple-500/60 focus:bg-white/[0.07] mb-5 transition-colors"
              autoFocus
            />

            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">
              Pin Color
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setPinFormColor(c)}
                  className="w-8 h-8 rounded-full border-2 transition-all duration-150 active:scale-90"
                  style={{
                    background: c,
                    borderColor: pinFormColor === c ? "#fff" : "transparent",
                    transform: pinFormColor === c ? "scale(1.18)" : "scale(1)",
                    boxShadow: pinFormColor === c ? `0 0 0 3px ${c}55` : "none",
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 mb-5">
              <input
                type="color"
                value={pinFormColor}
                onChange={(e) => setPinFormColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                title="Pick a custom color"
              />
              <span className="text-white/30 text-xs">Custom color</span>
              <span className="ml-auto text-white/50 text-xs font-mono">
                {pinFormColor.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setShowPinModal(false); setPendingPin(null); }}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 text-sm font-semibold rounded-xl transition-all duration-200"
              >
                Discard
              </button>
              <button
                onClick={handleSavePin}
                disabled={!pinFormName.trim()}
                className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-400 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-95"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locate Me — bottom-left so it doesn't overlap the sidebar */}
      <div className="absolute bottom-8 left-4 z-[1000] flex flex-col items-start gap-2">
        {locationStatus === "error" && (
          <div className="px-3 py-2 bg-red-900/80 border border-red-500/30 text-red-300 text-xs rounded-lg backdrop-blur-md max-w-[220px] leading-relaxed">
            {locationError === "denied" && (
              <>
                <div className="font-semibold mb-1">Location access denied</div>
                <div className="text-red-400">
                  Safari: <span className="text-red-300">Settings → Websites → Location</span> → allow this site.
                  <br />
                  macOS: <span className="text-red-300">System Settings → Privacy → Location Services → Safari</span>.
                </div>
              </>
            )}
            {locationError === "timeout" && "Location request timed out — try again"}
            {locationError === "unavailable" && "Location unavailable on this device"}
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
      <div ref={mapContainerRef} className="maps-page w-full h-full" />
    </div>
  );
}

export default Maps;
