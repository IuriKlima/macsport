"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en' | 'es';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  pt: {
    'accessibility': 'Acessibilidade A+ | A- |',
    'high_contrast': 'Alto contraste',
    'restricted_access': 'Acesso: Restrito',
    'about': 'Sobre a Macsport',
    'equipments': 'Equipamentos',
    'news': 'Notícias',
    'resellers': 'Revendas',
    'contact': 'Fale Conosco',
    'quote': 'Orçamento',
    'work_with_us': 'Trabalhe Conosco',
    'whatsapp_greeting': 'Seja bem vindo(a) à Macsport, sou Maia assistente virtual, como podemos ajudá-lo? 👩‍💻',
  },
  en: {
    'accessibility': 'Accessibility A+ | A- |',
    'high_contrast': 'High contrast',
    'restricted_access': 'Restricted Access',
    'about': 'About Macsport',
    'equipments': 'Equipment',
    'news': 'News',
    'resellers': 'Resellers',
    'contact': 'Contact Us',
    'quote': 'Get Quote',
    'work_with_us': 'Careers',
    'whatsapp_greeting': 'Welcome to Macsport, I am Maia, your virtual assistant. How can I help you? 👩‍💻',
  },
  es: {
    'accessibility': 'Accesibilidad A+ | A- |',
    'high_contrast': 'Alto contraste',
    'restricted_access': 'Acceso Restringido',
    'about': 'Sobre Macsport',
    'equipments': 'Equipos',
    'news': 'Noticias',
    'resellers': 'Distribuidores',
    'contact': 'Contáctenos',
    'quote': 'Presupuesto',
    'work_with_us': 'Trabaja con Nosotros',
    'whatsapp_greeting': 'Bienvenido a Macsport, soy Maia, tu asistente virtual. ¿Cómo puedo ayudarte? 👩‍💻',
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt');

  // Recuperar idioma salvo, se houver, garantindo que rode só no client
  useEffect(() => {
    const saved = localStorage.getItem('macsport_lang') as Language;
    if (saved && (saved === 'pt' || saved === 'en' || saved === 'es')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('macsport_lang', lang);

    // Google Translate integration
    const domainPart = window.location.hostname === 'localhost' ? '' : `; domain=${window.location.hostname}`;
    if (lang === 'pt') {
      document.cookie = `googtrans=/pt/pt; path=/${domainPart}; SameSite=Lax`;
      document.cookie = `googtrans=/pt/pt; path=/; SameSite=Lax`;
    } else {
      document.cookie = `googtrans=/pt/${lang}; path=/${domainPart}; SameSite=Lax`;
      document.cookie = `googtrans=/pt/${lang}; path=/; SameSite=Lax`;
    }
    window.location.reload();
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
