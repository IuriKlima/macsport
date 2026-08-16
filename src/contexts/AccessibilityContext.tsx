"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type AccessibilityContextType = {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSizeScale: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState(1);

  // Initialize from localStorage if needed, or default
  useEffect(() => {
    const savedContrast = localStorage.getItem("macsport-high-contrast") === "true";
    const savedFontSize = parseFloat(localStorage.getItem("macsport-font-size") || "1");
    
    if (savedContrast) setIsHighContrast(true);
    if (!isNaN(savedFontSize)) setFontSizeScale(savedFontSize);
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("macsport-high-contrast", String(isHighContrast));
    localStorage.setItem("macsport-font-size", String(fontSizeScale));

    // Apply classes to HTML
    if (isHighContrast) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Apply font size scale to HTML
    document.documentElement.style.fontSize = `${fontSizeScale * 100}%`;
  }, [isHighContrast, fontSizeScale]);

  const toggleHighContrast = () => setIsHighContrast((prev) => !prev);
  
  const increaseFontSize = () => setFontSizeScale((prev) => Math.min(prev + 0.1, 1.5));
  const decreaseFontSize = () => setFontSizeScale((prev) => Math.max(prev - 0.1, 0.8));

  return (
    <AccessibilityContext.Provider
      value={{
        isHighContrast,
        toggleHighContrast,
        fontSizeScale,
        increaseFontSize,
        decreaseFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
