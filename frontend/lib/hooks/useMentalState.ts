"use client";

import { useState, useEffect, useCallback } from "react";

export type MentalState = "LOW_AROUSAL" | "HIGH_AROUSAL";

export const useMentalState = () => {
  // Start in HIGH_AROUSAL by default so modal NEVER shows on initial page load
  const [mentalState, setMentalState] = useState<MentalState>("HIGH_AROUSAL");
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  const handleInteraction = useCallback(() => {
    setLastInteractionTime(Date.now());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollDelta = Math.abs(currentScrollPos - lastScrollPos);
      
      if (scrollDelta > 50) {
        setMentalState("HIGH_AROUSAL");
      }
      
      setLastScrollPos(currentScrollPos);
      handleInteraction();
    };

    const handleIdle = () => {
      const timeSinceLastInteraction = Date.now() - lastInteractionTime;
      
      // Trigger LOW_AROUSAL modal ONLY after 20 minutes (1,200,000 ms) of total inactivity
      if (timeSinceLastInteraction > 1200000) {
        setMentalState("LOW_AROUSAL");
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    
    const idleInterval = setInterval(handleIdle, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      clearInterval(idleInterval);
    };
  }, [lastScrollPos, lastInteractionTime, handleInteraction]);

  return { mentalState, setMentalState, handleInteraction };
};
