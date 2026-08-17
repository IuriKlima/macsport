'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { slugify } from '@/lib/products';

interface EquipamentosGridProps {
  produtosFiltrados: any[];
}

export function EquipamentosGrid({ produtosFiltrados }: EquipamentosGridProps) {
  const INITIAL_COUNT = 12;
  const LOAD_MORE_COUNT = 6;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset when products change
    setVisibleCount(INITIAL_COUNT);
  }, [produtosFiltrados]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, produtosFiltrados.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [produtosFiltrados.length]);

  const visibleProducts = produtosFiltrados.slice(0, visibleCount);

  if (produtosFiltrados.length === 0) {
    return (
      <div className="text-center py-20 bg-card-bg rounded-[2rem] border border-border">
        <p className="text-text-muted text-lg">Nenhum equipamento encontrado nesta linha.</p>
        <Link href="/equipamentos" className="inline-block mt-4 text-[#F5C400] hover:underline">
          Limpar filtro
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
        {visibleProducts.map((item: any) => (
          <div key={item.id} className="bg-card-bg rounded-[2rem] overflow-hidden group flex flex-col h-full border border-border hover:border-[#F5C400] transition-colors relative shadow-sm">
            <div className="relative w-full h-32 md:h-56 bg-card-bg p-2 md:p-4 flex items-center justify-center">
              {(item.imagem_url || item.imageUrl) ? (
                <img src={(item.imagem_url || item.imageUrl)} alt={(item.nome || item.title)} className="w-full h-full object-contain mix-blend-multiply" />
              ) : (
                <div className="w-32 h-32 opacity-50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-gray-500">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="p-3 md:p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <span className="text-[10px] md:text-xs text-[#F5C400] font-bold tracking-wider uppercase line-clamp-1">
                  Linha {item.linha || item.category || 'Macsport'}
                </span>
                {item.sku && (
                  <span className="text-[9px] md:text-[10px] text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                    Cód: {item.sku}
                  </span>
                )}
              </div>
              <h3 className="text-sm md:text-lg font-bold text-foreground mb-2 md:mb-4 line-clamp-2 leading-tight">{(item.nome || item.title)}</h3>
              <div className="mt-auto pt-2 md:pt-4 border-t border-border">
                <Link href={`/produto/${slugify(item.linha || 'macsport')}/${slugify((item.nome || item.title))}`} className="block text-center w-full bg-transparent group-hover:bg-[#F5C400] text-[#F5C400] group-hover:text-background border border-[#F5C400] py-1.5 md:py-2 px-2 md:px-4 rounded-[2rem] text-xs md:text-sm font-bold transition-colors before:absolute before:inset-0">
                  VER DETALHES
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Target for infinite scroll */}
      {visibleCount < produtosFiltrados.length && (
        <div ref={observerTarget} className="h-10 mt-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F5C400]"></div>
        </div>
      )}
    </>
  );
}
