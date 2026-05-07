"use client";

import React from "react";
import { motion } from "framer-motion";

interface LuxuryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({ 
  children, 
  onClick, 
  variant = "primary",
  className = ""
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        px-8 py-3 
        text-xs uppercase tracking-[0.2em] 
        transition-all duration-500
        border border-verde-ebano rounded-none
        ${variant === "primary" 
          ? "bg-transparent text-verde-ebano hover:bg-verde-ebano hover:text-hueso-seda" 
          : "bg-verde-ebano text-hueso-seda hover:bg-transparent hover:text-verde-ebano"}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

interface ProductCardProps {
  title: string;
  price: string;
  imageFront: string;
  imageBack: string;
  category: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  imageFront,
  imageBack,
  category
}) => {
  return (
    <div className="group flex flex-col gap-4 arousal-low rounded-none">
      <div className="relative aspect-[3/4] overflow-hidden hover-flip cursor-pointer rounded-none">
        <div className="w-full h-full hover-flip-inner relative rounded-none">
          {/* Front Image */}
          <div className="absolute inset-0 bg-plata-niebla/10 flex items-center justify-center">
            <span className="text-[10px] tracking-widest opacity-30">{title} FRONT</span>
          </div>
          
          {/* Back Image (Shown on Hover via CSS rotate in globals.css) */}
          <div className="absolute inset-0 bg-plata-niebla/20 flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
             <span className="text-[10px] tracking-widest opacity-30">{title} BACK</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-widest text-plata-niebla">{category}</span>
        <div className="flex justify-between items-end">
          <h3 className="text-sm tracking-widest font-display">{title}</h3>
          <span className="text-xs text-plata-niebla">{price}</span>
        </div>
      </div>
    </div>
  );
};
