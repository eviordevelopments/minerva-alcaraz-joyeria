"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, User, Heart, ShoppingBag } from "lucide-react";
import { CartSidebar } from "./CartSidebar";
import Link from "next/link";

export const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 header-glass px-8 py-4 flex justify-between items-center">
        {/* Navigation Icons Left */}
        <div className="flex gap-6 items-center">
          <button className="text-verde-ebano hover:text-oro-antiguo transition-colors nav-link">
            <Search size={20} strokeWidth={1} />
          </button>
          <Link href="/auth" className="text-verde-ebano hover:text-oro-antiguo transition-colors nav-link">
            <User size={20} strokeWidth={1} />
          </Link>
        </div>

        {/* Centered Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Minerva Alcaraz Logo" 
              width={120} 
              height={40} 
              className="object-contain"
            />
          </Link>
        </div>

        {/* Navigation Icons Right */}
        <div className="flex gap-6 items-center">
          <Link href="/favorites" className="text-verde-ebano hover:text-oro-antiguo transition-colors nav-link">
            <Heart size={20} strokeWidth={1} />
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-verde-ebano hover:text-oro-antiguo transition-colors nav-link"
          >
            <ShoppingBag size={20} strokeWidth={1} />
          </button>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
