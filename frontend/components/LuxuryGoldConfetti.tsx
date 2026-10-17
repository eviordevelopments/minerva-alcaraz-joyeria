"use client";

import React, { useEffect, useRef } from "react";

interface LuxuryGoldConfettiProps {
  durationMs?: number;
  particleCount?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  aspectRatio: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  type: "foil" | "flake" | "sparkle";
  polygonPoints?: { x: number; y: number }[];
}

const GOLD_PALETTE = [
  "#CBB67B", // Oro Antiguo emblemático
  "#D4AF37", // Oro Metálico 24k
  "#F3E5AB", // Champaña Luminoso
  "#E6B8A2", // Oro Rosa Suave
  "#FFFFFF", // Destello Diamante
  "#B3995D", // Oro Bronce Profundo
];

export function LuxuryGoldConfetti({
  durationMs = 9000,
  particleCount = 75,
  className = "",
}: LuxuryGoldConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isRunning = true;
    const startTime = performance.now();

    // Resize canvas with device pixel ratio for retina sharpness
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Helper to generate irregular gold flake polygons
    const generatePolygon = (size: number) => {
      const numPoints = 5 + Math.floor(Math.random() * 3);
      const points = [];
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = (size / 2) * (0.6 + Math.random() * 0.5);
        points.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        });
      }
      return points;
    };

    // Initialize luxury particles
    const particles: Particle[] = [];
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < particleCount; i++) {
      const randType = Math.random();
      const type: "foil" | "flake" | "sparkle" =
        randType < 0.5 ? "foil" : randType < 0.82 ? "flake" : "sparkle";

      const size =
        type === "sparkle"
          ? 4 + Math.random() * 5
          : type === "foil"
          ? 8 + Math.random() * 12
          : 6 + Math.random() * 10;

      particles.push({
        x: Math.random() * width,
        // Distribute from above and middle screen for a lavish initial burst
        y: Math.random() * (height * 0.45) - 80,
        vx: (Math.random() - 0.5) * 3.5,
        vy: 1.2 + Math.random() * 2.8,
        size,
        aspectRatio: type === "foil" ? 1.6 + Math.random() * 1.8 : 1,
        color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        tiltAngle: Math.random() * Math.PI,
        tiltSpeed: 0.04 + Math.random() * 0.06,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.04,
        opacity: 0.85 + Math.random() * 0.15,
        type,
        polygonPoints: type === "flake" ? generatePolygon(size) : undefined,
      });
    }

    // Render loop
    const render = (currentTime: number) => {
      if (!isRunning) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Global fade towards end of duration
      let globalAlpha = 1;
      if (progress > 0.75) {
        globalAlpha = (1 - progress) / 0.25;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        // Physics update
        p.wobble += p.wobbleSpeed;
        p.tiltAngle += p.tiltSpeed;
        p.rotation += p.rotationSpeed;

        p.x += p.vx + Math.sin(p.wobble) * 1.2;
        p.y += p.vy;

        // Subtle air drag
        p.vx *= 0.995;

        // Reset particle if it leaves the bottom
        if (p.y > window.innerHeight + 30) {
          if (progress < 0.75) {
            p.y = -20 - Math.random() * 40;
            p.x = Math.random() * window.innerWidth;
            p.vy = 1.2 + Math.random() * 2.5;
            p.vx = (Math.random() - 0.5) * 2;
          }
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // 3D perspective flip via tilt
        const cosTilt = Math.cos(p.tiltAngle);
        ctx.scale(cosTilt, 1);

        const currentOpacity = p.opacity * globalAlpha * (0.4 + Math.abs(cosTilt) * 0.6);
        ctx.globalAlpha = Math.max(0, Math.min(1, currentOpacity));
        ctx.fillStyle = p.color;

        if (p.type === "sparkle") {
          // Draw 4-point golden star
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.closePath();
          ctx.fill();

          // Small central bright diamond
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(-s * 0.15, -s * 0.15, s * 0.3, s * 0.3);
        } else if (p.type === "flake" && p.polygonPoints) {
          // Organic gold leaf flake
          ctx.beginPath();
          p.polygonPoints.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.closePath();
          ctx.fill();
        } else {
          // Luxury rectangular gold ribbon
          const w = p.size;
          const h = p.size * p.aspectRatio;
          ctx.fillRect(-w / 2, -h / 2, w, h);
        }

        ctx.restore();
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateSize);
    };
  }, [durationMs, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[100065] ${className}`}
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
}
