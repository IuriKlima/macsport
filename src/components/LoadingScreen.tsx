"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Hide the loading screen after a short delay to allow content to render
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => setIsLoading(false), 700); // Wait for fade out animation
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F5C400] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isFading ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="relative animate-pulse">
        <img
          src="/Logo Macsport preto.png"
          alt="Macsport Loading"
          className="w-48 md:w-64 h-auto object-contain"
        />
      </div>
      <div className="mt-8 flex gap-2">
        <div className="w-2.5 h-2.5 bg-black rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2.5 h-2.5 bg-black rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-2.5 h-2.5 bg-black rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
    </div>
  );
}
