-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 00: Extensions, Enums & Custom Types
-- ============================================================
-- Run this FIRST in Supabase SQL Editor

-- UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- pgcrypto for secure tokens
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- For full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
-- For unaccent search (spanish text)
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================
-- CUSTOM ENUM TYPES
-- ============================================================

-- Product categories
CREATE TYPE product_category AS ENUM (
  'Anillos',
  'Collares',
  'Pulseras',
  'Sets',
  'Edición Limitada',
  'Piezas Únicas',
  'Pendientes',
  'Broches'
);

-- Product collections (all current collections)
CREATE TYPE product_collection AS ENUM (
  'Amatista',
  'Chai',
  'Escencia',
  'Etérea',
  'Serpientes',
  'Floral',
  'Ecos de la Tierra',
  'Anillos de Piedras',
  'Diseños de Autor',
  'Piezas Únicas'
);

-- Currency
CREATE TYPE currency_code AS ENUM ('MXN', 'USD', 'EUR');

-- Gender
CREATE TYPE product_gender AS ENUM ('Hombre', 'Mujer', 'Unisex');

-- Order status lifecycle
CREATE TYPE order_status AS ENUM (
  'draft',          -- cart pending
  'pending',        -- placed, awaiting payment
  'paid',           -- payment confirmed
  'processing',     -- being prepared
  'shipped',        -- in transit
  'delivered',      -- completed
  'cancelled',      -- cancelled by user or admin
  'refunded'        -- refunded
);

-- Payment method
CREATE TYPE payment_method AS ENUM (
  'card',
  'oxxo',
  'transfer',
  'conekta',
  'whatsapp_manual'
);

-- Customization request status
CREATE TYPE customization_status AS ENUM (
  'pending_review',
  'in_design',
  'quoted',
  'approved',
  'in_production',
  'ready',
  'delivered',
  'cancelled'
);

-- Circle membership tier
CREATE TYPE circle_tier AS ENUM (
  'Observer',     -- just registered
  'Initiate',     -- 1st purchase
  'Devotee',      -- 3+ purchases or $10,000+ MXN
  'Keeper',       -- 6+ purchases or $25,000+ MXN
  'Eternal'       -- top tier, VIP
);

-- Album visibility
CREATE TYPE album_visibility AS ENUM ('private', 'shared_link', 'public');

-- Newsletter status
CREATE TYPE newsletter_status AS ENUM ('subscribed', 'unsubscribed', 'pending_confirmation');

-- Address type
CREATE TYPE address_type AS ENUM ('shipping', 'billing', 'both');
