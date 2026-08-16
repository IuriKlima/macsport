"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Moon, Sun } from "lucide-react";

export function TopBar() {
  const { t, language, setLanguage } = useLanguage();
  const { isHighContrast, toggleHighContrast, increaseFontSize, decreaseFontSize } = useAccessibility();

  return (
    <div className="w-full bg-[#1A1A1A] text-[#CCCCCC] text-xs py-1.5 px-4 md:px-8 z-50 relative border-b border-[#333333]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-[#333333] pr-4">
            <button onClick={decreaseFontSize} className="hover:text-white transition-colors px-1" title="Diminuir Fonte">A-</button>
            <button onClick={increaseFontSize} className="hover:text-white transition-colors px-1 font-bold text-sm" title="Aumentar Fonte">A+</button>
          </div>
          <button onClick={toggleHighContrast} className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            {isHighContrast ? <Sun size={14} /> : <Moon size={14} />}
            {isHighContrast ? 'Modo Claro' : 'Alto Contraste'}
          </button>
        </div>

        <div className="flex items-center gap-6 mt-2 sm:mt-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLanguage('pt')} 
              className={`flex items-center gap-1.5 hover:text-white transition-colors ${language === 'pt' ? 'text-white font-medium' : ''}`}
            >
              <span className="fi fi-br"></span> Português
            </button>
            <button 
              onClick={() => setLanguage('en')} 
              className={`flex items-center gap-1.5 hover:text-white transition-colors ${language === 'en' ? 'text-white font-medium' : ''}`}
            >
              <span className="fi fi-us"></span> English
            </button>
            <button 
              onClick={() => setLanguage('es')} 
              className={`flex items-center gap-1.5 hover:text-white transition-colors ${language === 'es' ? 'text-white font-medium' : ''}`}
            >
              <span className="fi fi-es"></span> Español
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
