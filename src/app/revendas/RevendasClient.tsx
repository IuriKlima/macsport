"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/products';
import 'leaflet/dist/leaflet.css';

// Dynamically import the map component with no SSR to avoid window is not defined errors
const MapComponent = dynamic(
  () => import('./MapComponent'),
  { ssr: false, loading: () => (
    <div className="w-full lg:w-2/3 bg-card-bg rounded-[2rem] border border-border min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1a1a1a] opacity-80" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      <div className="z-10 text-center text-[#F5C400]">Carregando Mapa...</div>
    </div>
  ) }
);

export default function RevendasClient({ revendas }: { revendas: any[] }) {
  const router = useRouter();
  const [activeRevenda, setActiveRevenda] = useState<any | null>(null);
  const [mapBounds, setMapBounds] = useState<any | null>(null);

  // Filter revendas based on map bounds and limit to 3
  const visibleRevendas = revendas.filter(rev => {
    if (!mapBounds) return true; // If map hasn't loaded bounds yet, show all
    if (!rev.lat || !rev.lng) return true; // Keep items without coordinates so they aren't hidden forever
    
    // Check if revenda is within current map bounds
    return mapBounds.contains([rev.lat, rev.lng]);
  }).slice(0, 2); // Mostrar no maximo 2 revendas

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-12">
      {/* Mapa dinâmico */}
      <MapComponent 
        revendas={revendas} 
        activeRevenda={activeRevenda} 
        setActiveRevenda={setActiveRevenda} 
        setBounds={setMapBounds}
      />

      {/* Lista de Revendas */}
      <div className="w-full lg:w-1/3">
        <div className="bg-card-bg p-6 rounded-[2rem] border border-border h-full">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border pb-4">
            <MapPin className="text-[#F5C400]" size={20} />
            Distribuidores Autorizados
          </h3>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {visibleRevendas.map((rev, idx) => (
              <div 
                key={rev.id || idx} 
                onClick={() => setActiveRevenda(rev)}
                className={`p-5 rounded-[2rem] border transition-colors cursor-pointer group ${activeRevenda?.id === rev.id ? 'bg-[#F5C400]/10 border-[#F5C400]' : 'bg-background border-border hover:border-[#F5C400]'}`}
              >
                <div className="text-[#F5C400] text-xs font-bold uppercase tracking-wider mb-1">{rev.cidade}</div>
                <h4 className="text-foreground font-bold text-lg mb-2 group-hover:text-[#F5C400] transition-colors">{rev.nome}</h4>
                <p className="text-text-muted text-sm mb-2">{rev.endereco}</p>
                <div className="flex flex-col gap-3 mt-3">
                  <p className="text-text-muted text-sm font-semibold">{rev.telefone}</p>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/revenda/${slugify(rev.nome)}`);
                    }}
                    className="flex items-center justify-center gap-2 bg-transparent text-foreground border border-border hover:border-[#F5C400] hover:text-[#F5C400] transition-colors py-2 px-4 rounded-full text-sm font-bold w-full"
                  >
                    Visitar Página da Revenda
                  </button>

                  {rev.telefone && (
                    <a 
                      href={`https://wa.me/55${rev.telefone.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors py-2 px-4 rounded-full text-sm font-bold w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                      Fale no WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <Link href="/seja-uma-revenda" className="w-full flex items-center justify-center border border-[#F5C400] text-[#F5C400] hover:bg-[#F5C400] hover:text-black font-bold py-3 rounded-[2rem] transition-colors">
              SEJA UM REVENDEDOR
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
