"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function MainHeader() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  
  // Handle hydration mismatch for zustand store
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full py-4 md:py-6 px-4 md:px-8 bg-[#F5C400] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center z-10 shrink-0">
          <Image src="/Logo Macsport preto.png" alt="Macsport" width={180} height={56} className="h-10 md:h-14 w-auto object-contain" priority={true} />
        </Link>
        
        {/* Nav Links (Centered - Desktop) */}
        <nav className="hidden lg:flex absolute left-0 right-0 justify-center items-center gap-8 text-[15px] font-semibold text-black">
          <Link href="/quem-somos" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
            {t('about')}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </Link>
          <Link href="/equipamentos" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
            {t('equipments')}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </Link>
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
        <div className="flex items-center gap-4 z-10">
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
          <Link href="/equipamentos" onClick={() => setIsMobileMenuOpen(false)} className="py-3 border-b border-yellow-500/30 flex justify-between items-center">
            {t('equipments')}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </Link>
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
