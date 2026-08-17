"use client";

import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { slugify } from '@/lib/products';

// Create a custom icon for the map marker
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map events and update bounds
function MapEventHandler({ setBounds }: { setBounds: (bounds: L.LatLngBounds) => void }) {
  const map = useMapEvents({
    moveend: () => {
      setBounds(map.getBounds());
    },
    zoomend: () => {
      setBounds(map.getBounds());
    }
  });

  useEffect(() => {
    // Initial bounds
    setBounds(map.getBounds());
  }, [map, setBounds]);

  return null;
}

// Component to handle zooming to active marker
function MapController({ activeRevenda, revendas }: { activeRevenda: any | null, revendas: any[] }) {
  const map = useMap();
  
  // Use a ref to prevent fitBounds loop
  const hasFitBounds = useRef(false);
  
  useEffect(() => {
    if (activeRevenda && activeRevenda.lat && activeRevenda.lng) {
      map.flyTo([activeRevenda.lat, activeRevenda.lng], 12, {
        animate: true,
        duration: 1.5
      });
      hasFitBounds.current = false; // Reset if they click something
    } else if (revendas.length > 0 && !activeRevenda && !hasFitBounds.current) {
      // Fit all markers only once when loading
      const validRevendas = revendas.filter(r => r.lat && r.lng);
      if (validRevendas.length > 0) {
        const bounds = L.latLngBounds(validRevendas.map(r => [r.lat, r.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
        hasFitBounds.current = true;
      }
    }
  }, [activeRevenda, map, revendas]);
  
  return null;
}

export default function MapComponent({ 
  revendas, 
  activeRevenda, 
  setActiveRevenda,
  setBounds
}: { 
  revendas: any[], 
  activeRevenda: any | null, 
  setActiveRevenda: (rev: any) => void,
  setBounds: (bounds: L.LatLngBounds) => void
}) {
  const validRevendas = useMemo(() => revendas.filter(r => r.lat && r.lng), [revendas]);
  
  // Default center (Brazil) if no revendas
  const defaultCenter: [number, number] = [-14.235, -51.925];
  const defaultZoom = 4;

  return (
    <div className="w-full lg:w-2/3 bg-card-bg rounded-[2rem] border border-border min-h-[500px] relative overflow-hidden z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%', minHeight: '500px', zIndex: 1 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEventHandler setBounds={setBounds} />
        <MapController activeRevenda={activeRevenda} revendas={validRevendas} />
        
        {validRevendas.map((rev) => (
          <Marker 
            key={rev.id} 
            position={[rev.lat, rev.lng]} 
            icon={customIcon}
            eventHandlers={{
              click: () => setActiveRevenda(rev),
            }}
          >
            <Popup>
              <div className="text-black font-sans">
                <h4 className="font-bold text-lg">{rev.nome}</h4>
                <p className="text-sm font-semibold">{rev.cidade}</p>
                <p className="text-xs text-gray-600 mt-1">{rev.endereco}</p>
                <p className="text-xs text-gray-600 font-bold mb-2">{rev.telefone}</p>
                <a 
                  href={`/revenda/${slugify(rev.nome)}`}
                  className="block text-center w-full bg-[#F5C400] text-black hover:bg-yellow-500 transition-colors py-1.5 px-3 rounded text-xs font-bold"
                >
                  PÁGINA DA REVENDA
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
