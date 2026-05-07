# ADR 001: Technical Stack and Modular Monolith Architecture

## Status
Proposed

## Context
The project "Minerva Alcaraz Joyería" requires a high-performance, SEO-optimized, and luxury-aesthetic web platform. The "Eternal Digital Design" philosophy demands smooth interactions and a "Mental State System".

## Decision
We will use a **Modular Monolith** architecture with a **Next.js 15 (App Router)** frontend and **Supabase** for the backend (Auth, Database, Storage).

### 1. Frontend: Next.js 15
- **Reasoning**: SSR/ISR for SEO, App Router for modular layouts, and excellent performance.
- **Styling**: **Vanilla CSS** + **Tailwind CSS 4.0** (as per `package.json` devDeps) for utility-first styling but prioritized custom CSS for luxury effects.
- **Animations**: **Framer Motion** for micro-interactions and "Mental State" transitions.
- **State Management**: **Zustand** for lightweight, non-intrusive global state (Mental State, Cart, User Profile).

### 2. Backend: Supabase
- **Reasoning**: Fast iteration, built-in Auth for "THE CIRCLE", and Realtime capabilities for order tracking.
- **Database**: PostgreSQL with RLS (Row Level Security).
- **Storage**: For high-quality jewelry imagery.

### 3. Architecture: Modular Monolith
- **Structure**:
  - `/frontend/app`: Routes and Layouts.
  - `/frontend/components`: Reusable UI components (Atomic Design).
  - `/frontend/lib`: Utilities, hooks, and API clients.
  - `/frontend/styles`: Global tokens (Hueso Seda, Verde Ébano).

## Consequences
- Single repository for easier coordination.
- Clear separation between UI and Logic.
- Scalable for future AR/3D integrations.
