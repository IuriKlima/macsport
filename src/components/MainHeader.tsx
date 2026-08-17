"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function MainHeader() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cartItems = useCartStore((state) => state.items);
  
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsDesktopMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDesktopMenuOpen(false);
    }, 150);
  };
  
  // Handle hydration mismatch for zustand store
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full py-4 md:py-6 px-4 md:px-8 bg-[#F5C400] sticky top-0 z-40 shadow-sm">
      <div className="max-w-[90rem] mx-auto flex items-center justify-between gap-4 xl:gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center z-10 shrink-0">
          <Image src="/Logo Macsport preto.png" alt="Macsport" width={180} height={56} className="h-10 md:h-14 w-auto object-contain" priority={true} />
        </Link>
        
        {/* Nav Links (Centered - Desktop) */}
        <nav className="hidden lg:flex flex-1 justify-center items-center gap-4 xl:gap-8 text-[13px] xl:text-[15px] font-semibold text-black whitespace-nowrap">
          <Link href="/quem-somos" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
            {t('about')}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </Link>
          <div 
            className="group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link href="/equipamentos" onClick={() => setIsDesktopMenuOpen(false)} className="flex items-center gap-1 hover:opacity-70 transition-opacity py-6 -my-6">
              {t('equipments')}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isDesktopMenuOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
            </Link>
            
            {isDesktopMenuOpen && (
              <div className="absolute top-full left-0 w-full bg-[#F5C400] border-t border-black/10 shadow-2xl min-h-[350px] cursor-default flex">
                {/* Right Side Two-Tone Background */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#E5B500] -z-10 hidden lg:block"></div>
                
                <div className="flex w-full max-w-7xl mx-auto">
                  <div className="w-full lg:w-1/2 py-12 px-8 grid grid-cols-2 gap-8">
                    {/* Categorias */}
                    <div>
                      <div className="flex items-center gap-3 font-bold text-black text-lg mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6Z"/></svg>
                        Categorias
                      </div>
                      <div className="flex flex-col gap-4 text-black/80 font-medium text-[15px]">
                        <Link href="/equipamentos?categoria=Musculação" onClick={() => setIsDesktopMenuOpen(false)} className="hover:text-black hover:translate-x-1 transition-transform flex items-center gap-2">
                          <span className="text-black/40 font-bold">&gt;</span> Musculação
                        </Link>
                        <Link href="/equipamentos?categoria=Bateria de Peso" onClick={() => setIsDesktopMenuOpen(false)} className="hover:text-black hover:translate-x-1 transition-transform flex items-center gap-2">
                          <span className="text-black/40 font-bold">&gt;</span> Bateria de Peso
                        </Link>
                        <Link href="/equipamentos?categoria=Cardio" onClick={() => setIsDesktopMenuOpen(false)} className="hover:text-black hover:translate-x-1 transition-transform flex items-center gap-2">
                          <span className="text-black/40 font-bold">&gt;</span> Cardio
                        </Link>
                        <Link href="/equipamentos?categoria=Peso Livre" onClick={() => setIsDesktopMenuOpen(false)} className="hover:text-black hover:translate-x-1 transition-transform flex items-center gap-2">
                          <span className="text-black/40 font-bold">&gt;</span> Peso Livre
                        </Link>
                      </div>
                    </div>
                    
                    {/* Linhas */}
                    <div>
                      <div className="flex items-center gap-3 font-bold text-black text-lg mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                        Linhas
                      </div>
                      <div className="flex flex-col gap-4 text-black/80 font-medium text-[15px]">
                        <Link href="/equipamentos?linha=New Evo" onClick={() => setIsDesktopMenuOpen(false)} className="hover:text-black hover:translate-x-1 transition-transform flex items-center gap-2">
                          <span className="text-black/40 font-bold">&gt;</span> New Evo
                        </Link>
                        <Link href="/equipamentos?linha=Sigma" onClick={() => setIsDesktopMenuOpen(false)} className="hover:text-black hover:translate-x-1 transition-transform flex items-center gap-2">
                          <span className="text-black/40 font-bold">&gt;</span> Sigma
                        </Link>
                        <Link href="/equipamentos?linha=Uranos" onClick={() => setIsDesktopMenuOpen(false)} className="hover:text-black hover:translate-x-1 transition-transform flex items-center gap-2">
                          <span className="text-black/40 font-bold">&gt;</span> Uranos
                        </Link>
                        <Link href="/equipamentos?linha=Cromus" onClick={() => setIsDesktopMenuOpen(false)} className="hover:text-black hover:translate-x-1 transition-transform flex items-center gap-2">
                          <span className="text-black/40 font-bold">&gt;</span> Cromus
                        </Link>
                        <Link href="/equipamentos?linha=Evo" onClick={() => setIsDesktopMenuOpen(false)} className="hover:text-black hover:translate-x-1 transition-transform flex items-center gap-2">
                          <span className="text-black/40 font-bold">&gt;</span> Evo
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Destaque (Lado Direito) */}
                  <div className="hidden lg:flex w-1/2 py-12 px-12 flex-col justify-center">
                    <div className="bg-black/5 rounded-3xl p-8 border border-black/10 flex items-center gap-6">
                      <div className="flex-1">
                        <h3 className="text-black font-bold text-2xl mb-2">Engenharia Brasileira</h3>
                        <p className="text-black/70 mb-4 font-medium text-sm">Nossos equipamentos são desenhados para máxima biomecânica e durabilidade.</p>
                        <Link href="/quem-somos" onClick={() => setIsDesktopMenuOpen(false)} className="text-black font-bold underline hover:no-underline flex items-center gap-1">
                          Conheça nossa fábrica <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </Link>
                      </div>
                      <div className="w-32 h-32 bg-black/10 rounded-full flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black/40"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href="/blog" className="hover:opacity-70 transition-opacity">
            {t('news')}
          </Link>
          <Link href="/revendas" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
            {t('resellers')}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </Link>
          <Link href="/contato" className="hover:opacity-70 transition-opacity">
            {t('contact')}
          </Link>
          <Link href="/trabalhe-conosco" className="hover:opacity-70 transition-opacity">
            {t('work_with_us')}
          </Link>
        </nav>
        
        {/* Right side CTA & Search */}
        <div className="flex items-center gap-2 md:gap-4 z-10 shrink-0">
          <Link href="/equipamentos" className="text-black hover:opacity-70 transition-opacity flex items-center justify-center w-10 h-10" aria-label="Buscar produtos">
            <Search size={22} strokeWidth={2.5} />
          </Link>

          <Link href="/orcamento" className="relative text-black hover:opacity-70 transition-opacity flex items-center justify-center w-10 h-10">
            <ShoppingCart size={24} strokeWidth={2.5} />
            {mounted && cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-black text-[#F5C400] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          <Link 
            href="/orcamento" 
            className="hidden md:inline-flex bg-black text-[#F5C400] font-bold px-6 py-2.5 rounded-full hover:bg-gray-900 transition-colors text-sm"
          >
            {t('quote')}
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-black hover:opacity-70 transition-opacity ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} strokeWidth={2.5} /> : <Menu size={32} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#F5C400] shadow-xl p-6 flex flex-col gap-4 text-black font-bold text-lg z-50">
          <Link href="/quem-somos" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-yellow-500/30 flex justify-between items-center">
            {t('about')}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </Link>
          <div className="py-3 border-b border-yellow-500/30 flex flex-col">
            <Link href="/equipamentos" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-between items-center w-full">
              {t('equipments')}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </Link>
            <div className="mt-4 flex gap-4 text-base font-medium bg-black/5 p-4 rounded-xl">
              <div className="flex-1 flex flex-col gap-3">
                <span className="text-[10px] uppercase text-black/60 font-bold mb-1">Categorias</span>
                <Link href="/equipamentos?categoria=Musculação" onClick={() => setIsMobileMenuOpen(false)}>Musculação</Link>
                <Link href="/equipamentos?categoria=Cardio" onClick={() => setIsMobileMenuOpen(false)}>Cardio</Link>
                <Link href="/equipamentos?categoria=Peso Livre" onClick={() => setIsMobileMenuOpen(false)}>Peso Livre</Link>
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <span className="text-[10px] uppercase text-black/60 font-bold mb-1">Linhas</span>
                <Link href="/equipamentos?linha=New Evo" onClick={() => setIsMobileMenuOpen(false)}>New Evo</Link>
                <Link href="/equipamentos?linha=Sigma" onClick={() => setIsMobileMenuOpen(false)}>Sigma</Link>
                <Link href="/equipamentos?linha=Cromus" onClick={() => setIsMobileMenuOpen(false)}>Cromus</Link>
              </div>
            </div>
          </div>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-yellow-500/30">
            {t('news')}
          </Link>
          <Link href="/revendas" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-yellow-500/30 flex justify-between items-center">
            {t('resellers')}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </Link>
          <Link href="/contato" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-yellow-500/30">
            {t('contact')}
          </Link>
          <Link href="/trabalhe-conosco" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-yellow-500/30">
            Trabalhe Conosco
          </Link>
          <Link 
            href="/orcamento" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-6 bg-black text-[#F5C400] font-bold px-6 py-4 rounded-full text-center hover:bg-gray-900 transition-colors"
          >
            {t('quote')}
          </Link>
        </div>
      )}
    </header>
  );
}
