"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface LuxuryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "gold";
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
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        px-6 sm:px-10 py-3 sm:py-4
        text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em]
        transition-all duration-700
        ${variant === "gold" ? "border border-oro-antiguo" : "border border-verde-ebano"} rounded-none
        ${variant === "primary" 
          ? "bg-transparent text-verde-ebano hover:bg-verde-ebano hover:text-hueso-seda" 
          : variant === "secondary"
            ? "bg-verde-ebano text-hueso-seda hover:bg-transparent hover:text-verde-ebano"
            : "bg-transparent text-oro-antiguo hover:bg-oro-antiguo hover:text-verde-ebano"}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

import Link from "next/link";
import { Heart } from "lucide-react";

import { Product } from "../constants/products";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  if (!product) return null;
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isFlipped, setIsFlipped] = React.useState(false);
  
  const { name, price, images, category, id, currency } = product;
  const imageFront = images[0];
  const imageBack = images[1] || images[0];

  return (
    <div 
      className="flex flex-col gap-4 arousal-low rounded-none relative group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsFavorite(!isFavorite);
        }}
        className={`absolute top-4 right-4 z-20 transition-colors ${isFavorite ? "text-oro-antiguo" : "text-verde-ebano/40 hover:text-oro-antiguo"}`}
      >
        <Heart size={18} strokeWidth={1.5} className={isFavorite ? "fill-oro-antiguo" : ""} />
      </button>

      <Link href={`/product/${id}`} className="flex flex-col gap-4 flex-1">
        <div className="relative aspect-[3/4] overflow-hidden cursor-pointer rounded-none bg-plata-niebla/5 perspective-1000">
          <motion.div 
            className="w-full h-full relative"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            whileTap={{ scale: 0.98 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front Face - Studio (Jewel Only) */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <Image 
                src={imageFront} 
                alt={`${name} Estudio`} 
                fill 
                className="object-cover" 
              />
            </div>
            
            {/* Back Face - Lifestyle (On Model) */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden"
              style={{ transform: "rotateY(180deg)" }}
            >
               <Image 
                src={imageBack} 
                alt={`${name} Modelo`} 
                fill 
                className="object-cover" 
              />
            </div>
          </motion.div>

          {/* Mobile Flip Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:hidden bg-hueso-seda/20 backdrop-blur-md px-3 py-1 text-[8px] uppercase tracking-widest text-verde-ebano/60 border border-verde-ebano/5">
             {isFlipped ? "Ver Pieza" : "Ver en Modelo"}
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/50">{category}</span>
          <div className="flex flex-col gap-1">
            <h3 className="text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] font-display text-verde-ebano uppercase leading-relaxed">{name}</h3>
            <span className="text-[9px] sm:text-[10px] text-oro-profundo tracking-[0.1em] sm:tracking-[0.2em] font-medium">
              ${price.toLocaleString()} {currency}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
