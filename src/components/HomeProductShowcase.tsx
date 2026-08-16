"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/lib/products";

const CATEGORIAS = [
  { nome: 'New Evo', slug: 'New Evo', logo: '/new-evo.png' },
  { nome: 'Sigma', slug: 'Sigma', logo: '/sigma.png' },
  { nome: 'Uranos', slug: 'Uranos', logo: '/uranos.png' },
  { nome: 'Cromus', slug: 'Cromus', logo: '/cromus.png' },
  { nome: 'Evo', slug: 'Evo', logo: '/evo.png' }
];

export function HomeProductShowcase({ products }: { products: any[] }) {
  // Use strictly the defined order, only showing them if they have products in the DB
  const linhasNoBanco = Array.from(new Set(products.map((p: any) => p.linha || p.category))).filter(Boolean) as string[];
  
  const categoriasAtivas = CATEGORIAS.filter(cat => 
    linhasNoBanco.some(linha => linha.toLowerCase() === cat.slug.toLowerCase())
  );

  const [activeTab, setActiveTab] = useState(categoriasAtivas[0]?.slug || 'Todos');

  const filteredProducts = products.filter((p: any) => {
    const cat = ((p.linha || p.category) || '').toLowerCase();
    const sub = ((p.categoria || p.subcategory) || '').toLowerCase();
    const search = activeTab.toLowerCase();
    return cat === search || sub === search;
  }).slice(0, 6);

  return (
    <div className="w-full">
      {/* 5 Categories Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-16">
        {categoriasAtivas.map((cat, idx) => (
          <div 
            key={cat.slug} 
            className={`bg-card-bg border ${activeTab === cat.slug ? 'border-[#F5C400] ring-2 ring-[#F5C400]/50' : 'border-border'} rounded-[2rem] overflow-hidden group cursor-pointer hover:border-[#F5C400] transition-all shadow-sm flex flex-col h-32 md:h-48 relative justify-center items-center`}
            onClick={() => setActiveTab(cat.slug)}
          >
            <div className="relative z-20 w-full h-full flex items-center justify-center">
              {cat.logo ? (
                <Image src={cat.logo} alt={cat.nome} width={300} height={200} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <span className="text-2xl font-bold text-center text-foreground group-hover:scale-105 transition-transform duration-500">{cat.nome}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categoriasAtivas.map((cat) => (
          <button
            key={`tab-${cat.slug}`}
            onClick={() => setActiveTab(cat.slug)}
            className={`px-5 py-2 rounded-full font-semibold transition-colors text-sm md:text-base ${
              activeTab === cat.slug
                ? 'bg-[#F5C400] text-black'
                : 'bg-card-bg text-text-muted border border-border hover:bg-border'
            }`}
          >
            {cat.nome}
          </button>
        ))}
      </div>

      {/* Product Grid (2 cols mobile, 3 cols desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 mb-12">
        {filteredProducts.map((item: any) => (
          <div key={item.id} className="bg-card-bg rounded-[2rem] overflow-hidden group flex flex-col h-full border border-border hover:border-[#F5C400] transition-colors relative shadow-sm">
            <div className="relative w-full h-40 md:h-56 bg-card-bg p-4 flex items-center justify-center">
              {(item.imagem_url || item.imageUrl) ? (
                <Image src={(item.imagem_url || item.imageUrl)} alt={(item.nome || item.title)} width={400} height={300} className="w-full h-full object-contain mix-blend-multiply" />
              ) : (
                <div className="w-20 h-20 md:w-32 md:h-32 opacity-20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
              )}
            </div>
            <div className="p-3 md:p-5 flex flex-col flex-grow">
              <span className="text-[10px] md:text-xs text-[#F5C400] font-bold tracking-wider uppercase mb-1 md:mb-2">{(item.categoria || item.subcategory) || (item.linha || item.category) || 'Macsport'}</span>
              <h3 className="text-sm md:text-lg font-bold text-foreground mb-3 md:mb-4 line-clamp-2 leading-tight">{(item.nome || item.title)}</h3>
              <div className="mt-auto pt-3 md:pt-4 border-t border-border">
                <Link href={`/produto/${slugify(item.linha || 'macsport')}/${slugify((item.nome || item.title))}`} className="block text-center w-full bg-transparent group-hover:bg-[#F5C400] text-[#F5C400] group-hover:text-black border border-[#F5C400] py-2 px-2 md:px-4 rounded-full text-xs md:text-sm font-bold transition-colors before:absolute before:inset-0">
                  VER DETALHES
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-card-bg rounded-[2rem] border border-border mb-12">
          <p className="text-text-muted">Nenhum equipamento cadastrado nesta linha ainda.</p>
        </div>
      )}

      {/* Botão Ver Mais */}
      <div className="flex justify-center">
        <Link 
          href={`/equipamentos?linha=${encodeURIComponent(activeTab)}`}
          className="bg-black text-[#F5C400] font-bold px-8 py-3.5 rounded-full hover:bg-gray-900 transition-colors shadow-md text-sm md:text-base"
        >
          VER TODOS EM {categoriasAtivas.find(c => c.slug === activeTab)?.nome.toUpperCase() || 'DESTAQUES'}
        </Link>
      </div>
    </div>
  );
}
