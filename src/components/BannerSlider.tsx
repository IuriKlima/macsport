"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const DEFAULT_BANNERS = [
  {
    image: "/macsport-maia-whatsapp-web-1920x640.png",
    imageMobile: "/macsport-maia-whatsapp-mobile-1080x1920.png",
    title: "Bem-vindo à Macsport",
    order: 1
  }
];

export function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banners, setBanners] = useState<any[]>(DEFAULT_BANNERS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function loadSlides() {
      try {
        const snap = await getDocs(collection(db, "slides"));
        if (!snap.empty) {
          const data = snap.docs.map(d => d.data()).sort((a, b) => a.order - b.order);
          setBanners(data);
        }
      } catch (err) {
        console.error("Failed to load slides", err);
      }
    }
    loadSlides();
  }, []);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  return (
    <div 
      className="relative w-full overflow-hidden bg-macsport"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {banners.map((banner, index) => {
        const titleLower = (banner.title || "").toLowerCase();
        let linkHref = banner.link || "/equipamentos";
        
        if (!banner.link) {
          if (titleLower.includes('new evo')) linkHref = "/equipamentos?linha=New%20Evo";
          else if (titleLower.includes('evo')) linkHref = "/equipamentos?linha=Evo";
          else if (titleLower.includes('uranos')) linkHref = "/equipamentos?linha=Uranos";
          else if (titleLower.includes('sigma')) linkHref = "/equipamentos?linha=Sigma";
          else if (titleLower.includes('cromus')) linkHref = "/equipamentos?linha=Cromus";
        }

        return (
        <div
          key={index}
          className={`w-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          } ${index === 0 ? "relative" : "absolute inset-0 h-full"}`}
        >
          <Link href={linkHref} className="block w-full h-full relative">
            
            {/* Imagem Mobile */}
            <Image
              src={banner.imageMobile || banner.image}
              alt={banner.title || 'Banner Macsport'}
              width={750}
              height={500}
              priority={index === 0}
              className="w-full min-h-[500px] object-cover block md:hidden"
            />
            
            {/* Imagem Desktop */}
            <Image
              src={banner.image}
              alt={banner.title || 'Banner Macsport'}
              width={1920}
              height={600}
              priority={index === 0}
              className="w-full h-auto min-h-[500px] object-cover hidden md:block"
            />
          </Link>
        </div>
      )})}

      {/* Indicadores estilo Cimed */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-10 z-20 flex items-center justify-between gap-4 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white font-medium shadow-lg w-32">
        <button 
          onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
          className="text-macsport hover:scale-110 transition-transform flex items-center justify-center"
          aria-label="Slide anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        
        <span className="text-[15px] font-semibold tracking-wide">
          {currentIndex + 1}/{banners.length}
        </span>
        
        <button 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
          className="text-macsport hover:scale-110 transition-transform flex items-center justify-center"
          aria-label="Próximo slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
