"use client";

import Image from 'next/image';

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
  // Pegar os 8 primeiros produtos
  const displayProducts = products.slice(0, 8);

  const getWhatsAppUrl = (productName: string) => {
    if (!resellerPhone) return '#';
    const msg = `Olá! Gostaria de um orçamento para o equipamento Macsport: ${productName}`;
    return `https://wa.me/55${resellerPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayProducts.map((item) => {
        const productName = item.nome || item.title || 'Equipamento Macsport';
        return (
          <div key={item.id} className="bg-background rounded-2xl overflow-hidden group flex flex-col h-full border border-border hover:border-[#F5C400] transition-colors relative shadow-sm">
            <div className="relative w-full h-48 bg-card-bg p-4 flex items-center justify-center">
              {(item.imagem_url || item.imageUrl) ? (
                <Image src={(item.imagem_url || item.imageUrl) as string} alt={productName} fill className="object-contain p-2" sizes="(max-width: 768px) 100vw, 25vw" />
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
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-[#F5C400] font-bold tracking-wider uppercase line-clamp-1">
                  Linha {item.linha || item.category || 'Macsport'}
                </span>
                {(item.codigo || item.sku) && (
                  <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                    Cód: {item.codigo || item.sku}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-foreground mb-4 line-clamp-2 leading-tight">{productName}</h3>
              
              <div className="mt-auto pt-4 border-t border-border">
                <a 
                  href={getWhatsAppUrl(productName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white hover:bg-[#128C7E] py-3 px-4 rounded-xl text-sm font-bold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                  Cotar com {resellerName.split(' ')[0]}
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
