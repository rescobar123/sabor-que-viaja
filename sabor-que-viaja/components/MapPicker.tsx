"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Loader2, Search, X } from "lucide-react";

interface Props {
  onAddressChange: (address: string) => void;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`,
    { headers: { "Accept-Language": "es" } }
  );
  const data = await res.json();
  if (!data.address) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

  const a = data.address;
  const parts = [
    a.road || a.pedestrian || a.footway,
    a.house_number,
    a.neighbourhood || a.suburb || a.city_district,
    a.city || a.town || a.village || a.municipality,
    a.state,
  ].filter(Boolean);

  return parts.join(", ");
}

export default function MapPicker({ onAddressChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [mapLoading, setMapLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [address, setAddress] = useState("");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateAddress(addr: string) {
    setAddress(addr);
    onAddressChange(addr);
  }

  function moveMarker(lat: number, lng: number) {
    leafletMap.current?.setView([lat, lng], 16);
    markerRef.current?.setLatLng([lat, lng]);
  }

  // Búsqueda con debounce
  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    setResults([]);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!q.trim()) return;

    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=es&countrycodes=gt&viewbox=-92.2,17.8,-88.2,13.7&bounded=0`
        );
        const data: SearchResult[] = await res.json();
        setResults(data);
      } finally {
        setSearching(false);
      }
    }, 500);
  }, []);

  async function selectResult(r: SearchResult) {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    moveMarker(lat, lng);
    setQuery(r.display_name.split(",")[0]);
    setResults([]);
    const addr = await reverseGeocode(lat, lng);
    updateAddress(addr);
  }

  async function goToMyLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        moveMarker(latitude, longitude);
        const addr = await reverseGeocode(latitude, longitude);
        updateAddress(addr);
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  useEffect(() => {
    if (!mapRef.current) return;
    // Limpiar instancia previa si React StrictMode reinicializó el efecto
    if ((mapRef.current as any)._leaflet_id) {
      (mapRef.current as any)._leaflet_id = undefined;
    }
    if (leafletMap.current) {
      leafletMap.current.remove();
      leafletMap.current = null;
    }

    const defaultLat = 14.6349;
    const defaultLng = -90.5069;

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, { zoomControl: false }).setView([defaultLat, defaultLng], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap", maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

      marker.on("dragend", async () => {
        const { lat, lng } = marker.getLatLng();
        const addr = await reverseGeocode(lat, lng);
        updateAddress(addr);
      });

      map.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        const addr = await reverseGeocode(lat, lng);
        updateAddress(addr);
      });

      leafletMap.current = map;
      markerRef.current = marker;
      setMapLoading(false);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            const { latitude, longitude } = coords;
            map.setView([latitude, longitude], 16);
            marker.setLatLng([latitude, longitude]);
            const addr = await reverseGeocode(latitude, longitude);
            updateAddress(addr);
          },
          () => {}
        );
      }
    });

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  return (
    <div className="space-y-2">
      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar dirección..."
          className="w-full border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-verde-principal/30 focus:border-verde-principal transition"
        />
        {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />}
        {query && !searching && (
          <button type="button" onClick={() => { setQuery(""); setResults([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown resultados */}
        {results.length > 0 && (
          <ul className="absolute z-[2000] top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {results.map((r) => (
              <li key={r.place_id}>
                <button
                  type="button"
                  onClick={() => selectResult(r)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-start gap-2 border-b last:border-0 border-gray-100"
                >
                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    {r.display_name.split(", Guatemala")[0].split(", América Central")[0]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa */}
      <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ height: 200 }}>
        {mapLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        )}
        <div ref={mapRef} className="h-full w-full" />

        <button
          type="button"
          onClick={goToMyLocation}
          className="absolute top-3 right-3 z-[1000] bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-600 shadow-sm hover:border-verde-principal hover:text-verde-principal flex items-center gap-1.5 transition-colors"
        >
          {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
          Mi ubicación
        </button>
      </div>

      {/* Dirección detectada — solo lectura */}
      {address ? (
        <div className="flex items-start gap-2 bg-verde-principal/5 border border-verde-principal/20 rounded-xl px-3 py-2.5">
          <MapPin className="w-3.5 h-3.5 text-verde-principal mt-0.5 flex-shrink-0" />
          <p className="text-xs text-verde-principal leading-relaxed">{address}</p>
        </div>
      ) : (
        <p className="text-xs text-gray-400 px-1">Toca el mapa o busca tu dirección para confirmar la ubicación.</p>
      )}
    </div>
  );
}
