"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type MentalState = "LOW_AROUSAL" | "HIGH_AROUSAL";

export const useMentalState = () => {
  // Start in HIGH_AROUSAL by default so modal NEVER shows on initial page load
  const [mentalState, setMentalState] = useState<MentalState>("HIGH_AROUSAL");
  const lastScrollPosRef = useRef(0);
  const lastInteractionTimeRef = useRef(Date.now());

  const handleInteraction = useCallback(() => {
    lastInteractionTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollPos = window.scrollY;
          const scrollDelta = Math.abs(currentScrollPos - lastScrollPosRef.current);
          
          if (scrollDelta > 50) {
            setMentalState("HIGH_AROUSAL");
          }
          
          lastScrollPosRef.current = currentScrollPos;
          lastInteractionTimeRef.current = Date.now();
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleIdle = () => {
      const timeSinceLastInteraction = Date.now() - lastInteractionTimeRef.current;
      
      // Trigger LOW_AROUSAL modal ONLY after 20 minutes (1,200,000 ms) of total inactivity
      if (timeSinceLastInteraction > 1200000) {
        setMentalState("LOW_AROUSAL");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleInteraction, { passive: true });
    window.addEventListener("click", handleInteraction, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });
    window.addEventListener("keydown", handleInteraction, { passive: true });
    
    const idleInterval = setInterval(handleIdle, 10000); // Check every 10s instead of every 1s

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      clearInterval(idleInterval);
    };
  }, [handleInteraction]);

  return { mentalState, setMentalState, handleInteraction };
};
