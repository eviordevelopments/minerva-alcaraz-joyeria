"use client";

import React, { useEffect } from "react";
import { useAccessibilityStore } from "../lib/store/useAccessibilityStore";

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { theme, fontSize, highContrast, voiceReader } = useAccessibilityStore();

  // Apply CSS classes to body
  useEffect(() => {
    if (typeof window === "undefined") return;

    const body = document.body;
    
    // Theme
    if (theme === 'dark') body.classList.add('theme-dark');
    else body.classList.remove('theme-dark');

    // Font size
    if (fontSize === 'large') body.classList.add('text-large');
    else body.classList.remove('text-large');

    // High Contrast
    if (highContrast) body.classList.add('high-contrast');
    else body.classList.remove('high-contrast');

  }, [theme, fontSize, highContrast]);

  // Voice Reader Logic
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleVoiceClick = (e: MouseEvent) => {
      if (!voiceReader) return;
      
      // Prevent reading if clicking on the accessibility panel itself
      const target = e.target as HTMLElement;
      if (target.closest('#a11y-panel') || target.closest('#a11y-fab')) {
        return;
      }

      // Read text content
      const textToRead = target.innerText || target.textContent;
      if (textToRead && textToRead.trim().length > 0) {
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = "es-MX";
        window.speechSynthesis.speak(utterance);
      }
    };

    if (voiceReader) {
      document.addEventListener("click", handleVoiceClick);
      // Change cursor to indicate reading mode
      document.body.style.cursor = "help";
    } else {
      window.speechSynthesis.cancel();
      document.body.style.cursor = "default";
    }

    return () => {
      document.removeEventListener("click", handleVoiceClick);
      document.body.style.cursor = "default";
    };
  }, [voiceReader]);

  return (
    <>
      {children}
      
      {/* DOM Overlay for Dark Mode - Placed at the end of the tree so it reliably covers sibling stacking contexts */}
      {theme === 'dark' && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            pointerEvents: 'none',
            backdropFilter: highContrast ? 'invert(1) hue-rotate(180deg) contrast(140%) saturate(130%)' : 'invert(1) hue-rotate(180deg)',
            WebkitBackdropFilter: highContrast ? 'invert(1) hue-rotate(180deg) contrast(140%) saturate(130%)' : 'invert(1) hue-rotate(180deg)'
          }}
        />
      )}

      {/* DOM Overlay for High Contrast without Dark Mode */}
      {highContrast && theme !== 'dark' && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            pointerEvents: 'none',
            backdropFilter: 'contrast(140%) saturate(130%)',
            WebkitBackdropFilter: 'contrast(140%) saturate(130%)'
          }}
        />
      )}
    </>
  );
}
