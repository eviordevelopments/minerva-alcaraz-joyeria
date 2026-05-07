"use client";

import { useState, useEffect, useCallback } from "react";

export type MentalState = "LOW_AROUSAL" | "HIGH_AROUSAL";

export const useMentalState = () => {
  const [mentalState, setMentalState] = useState<MentalState>("LOW_AROUSAL");
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  const handleInteraction = useCallback(() => {
    setLastInteractionTime(Date.now());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollDelta = Math.abs(currentScrollPos - lastScrollPos);
      
      // High Intent detection: Rapid scrolling (> 50px delta) or zoom (not easily detected, but scroll works)
      if (scrollDelta > 50) {
        setMentalState("HIGH_AROUSAL");
      }
      
      setLastScrollPos(currentScrollPos);
      handleInteraction();
    };

    const handleIdle = () => {
      const timeSinceLastInteraction = Date.now() - lastInteractionTime;
      
      // Low Intent detection: Idle for > 8s or slow movement
      if (timeSinceLastInteraction > 8000) {
        setMentalState("LOW_AROUSAL");
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("click", handleInteraction);
    
    const idleInterval = setInterval(handleIdle, 2000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      clearInterval(idleInterval);
    };
  }, [lastScrollPos, lastInteractionTime, handleInteraction]);

  return { mentalState };
};
