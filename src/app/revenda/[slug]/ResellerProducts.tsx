"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  nome?: string;
  title?: string;
  imagem_url?: string;
  imageUrl?: string;
  linha?: string;
  category?: string;
  codigo?: string;
  sku?: string;
  beneficios?: string | string[];
  descricao?: string;
  description?: string;
}

export default function ResellerProducts({ 
  products, 
  resellerPhone, 
  resellerName 
}: { 
  products: Product[], 
  resellerPhone: string,
  resellerName: string
}) {
  const INITIAL_COUNT = 12;
  const LOAD_MORE_COUNT = 8;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Extract unique categories (linhas)
  const categories = Array.from(new Set(products.map(p => (p.linha || p.category || 'Macsport').toUpperCase())));

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [searchTerm, activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, products.length));
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
  }, [products.length]);

  const filteredProducts = products.filter((item) => {
    // Filter by Category
    if (activeCategory && (item.linha || item.category || 'Macsport').toUpperCase() !== activeCategory) {
      return false;
    }
    
    // Filter by Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const nome = (item.nome || item.title || '').toLowerCase();
      const codigo = (item.codigo || item.sku || '').toLowerCase();
      return nome.includes(term) || codigo.includes(term);
    }
    
    return true;
  });

  const displayProducts = filteredProducts.slice(0, visibleCount);

  const getWhatsAppUrl = (productName: string) => {
    if (!resellerPhone) return '#';
    const msg = `Olá! Gostaria de um orçamento para o equipamento Macsport: ${productName}`;
    return `https://wa.me/55${resellerPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div>
      {/* Barra de Busca e Filtro */}
      <div className="mb-8">
        <div className="flex items-center bg-card-bg border border-border rounded-full px-5 py-2 mb-6 focus-within:border-[#F5C400] transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted shrink-0 mr-3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Buscar equipamento por nome ou código..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none py-2 text-foreground focus:outline-none"
          />
        </div>

        {/* Filtro de Categorias (Linhas) */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${!activeCategory ? 'bg-[#F5C400] text-black' : 'bg-transparent text-text-muted border border-border hover:border-[#F5C400]'}`}
          >
            Todos
          </button>
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveCategory(cat as string)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeCategory === cat ? 'bg-[#F5C400] text-black' : 'bg-transparent text-text-muted border border-border hover:border-[#F5C400]'}`}
            >
              Linha {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-card-bg rounded-[2rem] border border-border">
          <p className="text-text-muted text-lg">Nenhum equipamento encontrado com este filtro.</p>
          <button onClick={() => { setSearchTerm(''); setActiveCategory(null); }} className="inline-block mt-4 text-[#F5C400] hover:underline font-bold">
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {displayProducts.map((item) => {
            const productName = item.nome || item.title || 'Equipamento Macsport';
            return (
              <div key={item.id} className="bg-background rounded-2xl overflow-hidden group flex flex-col h-full border border-border hover:border-[#F5C400] transition-colors relative shadow-sm">
                <div className="relative w-full h-32 md:h-48 bg-card-bg p-2 md:p-4 flex items-center justify-center">
                  {(item.imagem_url || item.imageUrl) ? (
                    <Image src={(item.imagem_url || item.imageUrl) as string} alt={productName} fill className="object-contain p-2" sizes="(max-width: 768px) 50vw, 25vw" />
                  ) : (
                    <div className="w-16 h-16 opacity-50">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-gray-500">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] md:text-xs text-[#F5C400] font-bold tracking-wider uppercase line-clamp-1">
                      Linha {item.linha || item.category || 'Macsport'}
                    </span>
                    {(item.codigo || item.sku) && (
                      <span className="text-[9px] md:text-[10px] text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                        Cód: {item.codigo || item.sku}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground mb-4 line-clamp-2 leading-tight">{productName}</h3>
                  
                  <div className="mt-auto pt-4 border-t border-border">
                    <a 
                      href={getWhatsAppUrl(productName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 md:gap-2 w-full bg-[#25D366] text-white hover:bg-[#128C7E] py-2 px-2 md:py-3 md:px-4 rounded-xl text-xs md:text-sm font-bold transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                      Cotar <span className="hidden md:inline">com {resellerName.split(' ')[0]}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alvo do Infinite Scroll */}
      {visibleCount < filteredProducts.length && (
        <div ref={observerTarget} className="h-10 mt-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F5C400]"></div>
        </div>
      )}
    </div>
  );
}
