"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface LuxuryButtonProps {
  children: React.ReactNode;
  onClick?: (e?: any) => void;
  variant?: "primary" | "secondary" | "gold";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({ 
  children, 
  onClick, 
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
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
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "../constants/products";
import { useCartStore } from "../lib/store/useCartStore";
import { useFavoritesStore } from "../lib/store/useFavoritesStore";
import { useAuthStore } from "../lib/store/useAuthStore";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  if (!product) return null;
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [addedFeedback, setAddedFeedback] = React.useState(false);

  const { addItem } = useCartStore();
  const { isFavorite, toggle } = useFavoritesStore();
  const { user } = useAuthStore();

  const { name, price, images, category, id, currency, collection } = product;
  const defaultPlaceholder = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80";
  const validImages = Array.isArray(images) ? images.filter((img) => typeof img === "string" && img.trim().length > 0) : [];
  const imageFront = validImages[0] || defaultPlaceholder;
  const imageBack = validImages[1] || imageFront;
  const favorite = isFavorite(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: id,
      sku: product.sku,
      name,
      collection: collection ?? "",
      category,
      image: imageFront ?? "",
      price,
      currency,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(
      {
        productId: id,
        sku: product.sku,
        name,
        image: imageFront ?? "",
        price,
        currency,
        collection: collection ?? "",
        category,
      },
      user?.id
    );
  };

  return (
    <div
      className="group relative bg-white/5 border border-verde-ebano/5 hover:border-oro-antiguo/20 transition-all duration-700"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Favorite button */}
      <button
        onClick={handleFavorite}
        className={`absolute top-4 right-4 z-20 transition-colors ${
          favorite ? "text-oro-antiguo" : "text-verde-ebano/40 hover:text-oro-antiguo"
        }`}
        title={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        <Heart
          size={18}
          strokeWidth={1.5}
          className={favorite ? "fill-oro-antiguo" : ""}
        />
      </button>

      {/* Add to cart button — visible on hover */}
      <button
        onClick={handleAddToCart}
        className={`absolute bottom-[calc(33%+1rem)] left-1/2 -translate-x-1/2 z-20 
          px-4 py-2 text-[8px] uppercase tracking-widest border transition-all duration-300
          opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
          ${addedFeedback
            ? "bg-verde-ebano text-hueso-seda border-verde-ebano"
            : "bg-hueso-seda/90 backdrop-blur-sm text-verde-ebano border-verde-ebano/30 hover:bg-verde-ebano hover:text-hueso-seda"
          }`}
        title="Añadir a la bolsa"
      >
        <span className="flex items-center gap-1.5">
          <ShoppingBag size={10} />
          {addedFeedback ? "¡Añadido!" : "Añadir"}
        </span>
      </button>

      <Link href={`/product/${id}`} className="flex flex-col gap-4 flex-1">
        <div className="relative aspect-[3/4] overflow-hidden cursor-pointer rounded-none bg-plata-niebla/5 perspective-1000">
          <motion.div
            className="w-full h-full relative"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <Image
                src={imageFront}
                alt={`${name} Estudio`}
                fill
                className="object-cover"
              />
            </div>
            {/* Back */}
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

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:hidden bg-hueso-seda/20 backdrop-blur-md px-3 py-1 text-[8px] uppercase tracking-widest text-verde-ebano/60 border border-verde-ebano/5">
            {isFlipped ? "Ver Pieza" : "Ver en Modelo"}
          </div>
        </div>

        <div className="flex flex-col gap-2 px-1 pb-4">
          <span className="text-[9px] uppercase tracking-[0.4em] text-verde-ebano/50">
            {category}
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] font-display text-verde-ebano uppercase leading-relaxed">
              {name}
            </h3>
            <span className="text-[9px] sm:text-[10px] text-oro-profundo tracking-[0.1em] sm:tracking-[0.2em] font-medium">
              ${price.toLocaleString()} {currency}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
