"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("macsport-cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("macsport-cookie-consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm text-white z-[9999] px-4 py-4 border-t border-yellow-500/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-300">
          <p>
            Utilizamos cookies para melhorar sua experiência em nosso site e personalizar conteúdo. Ao continuar navegando, você concorda com a nossa{" "}
            <Link href="/politica-de-privacidade" className="text-macsport hover:underline font-medium">Política de Privacidade</Link> e{" "}
            <Link href="/termos-de-uso" className="text-macsport hover:underline font-medium">Termos de Uso</Link>.
          </p>
        </div>
        <div className="flex-shrink-0 flex gap-3 w-full sm:w-auto">
          <button 
            onClick={acceptCookies}
            className="w-full sm:w-auto px-6 py-2 bg-macsport text-black font-semibold rounded hover:bg-yellow-400 transition-colors"
          >
            Aceitar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
