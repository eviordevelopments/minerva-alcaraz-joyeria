# E-vior Multi-Agent Orchestration: Minerva Alcaraz Joyería

This document defines the roles and roadmap for the Minerva Alcaraz Joyería project, following the NASA 17-Point Systems Engineering and the "Working Backwards" methodology.

## 1. Agent Personas

| Agent | Persona | Focus |
| :--- | :--- | :--- |
| **@Magentic** | Orchestrator | Pattern selection, roadmap management, and cross-agent consistency. |
| **@ReqAgent** | Requirements Engineer | PRFAQ, stakeholder expectations, and technical requirements (NASA Steps 1-2). |
| **@ArchAgent** | System Architect | Modular monolith, ADRs, and logical decomposition (NASA Steps 3-4). |
| **@CodeAgent** | Developer | Implementation of the "Hueso Seda" design system and Next.js frontend. |
| **@TestAgent** | QA/SDET | Verification and validation (NASA Steps 7-8). |
| **@OpsAgent** | DevOps/SRE | Deployment, SEO optimization, and SLOs (NASA Step 10). |
| **@AuthenticitySentinel** | DevOps/Security | Secures digital certificates, RLS policies, and anti-counterfeiting trust signals. |
| **@PerformanceCurator** | SRE/Performance | Curates loading rituals, skeleton screens, and perceptual speed optimization. |
| **@HeritageDeployer** | DevOps/Archival | Manages asset integrity, versioning of high-res artisanal content, and deployment rituals. |

## 2. Project Roadmap (NASA SE Lifecycle)

### Phase 1: Requirements & Design (Complete)
- [x] **Step 1-2 (ReqAgent)**: Create PRFAQ and Technical Requirements for ERP ([prfaq_erp.md](file:///Users/emilianocastillo/.gemini/antigravity/brain/15be499a-dd36-427d-9317-5b58572234f6/prfaq_erp.md)).
- [x] **Step 3-4 (ArchAgent)**: Define System Architecture and ADRs for ERP ([adr_erp.md](file:///Users/emilianocastillo/.gemini/antigravity/brain/15be499a-dd36-427d-9317-5b58572234f6/adr_erp.md)).
- [x] **Step 5-6 (Magentic)**: Setup project structure for ERP (`frontend/app/admin/*`, `backend/supabase/09_*.sql`).

### Phase 2: Implementation (In Progress)
- [x] **ERP System Core (CodeAgent)**: Build layout and middleware perimetral ([middleware.ts](file:///Users/emilianocastillo/minerva-alcaraz-joyeria/frontend/middleware.ts)).
- [x] **ERP Modules (CodeAgent)**: Built Dashboard, Ingesta de Inventario with Public Live Preview, Showroom overlaps protection, Concierge logs, and CRM directory.
- [ ] **Frontend (CodeAgent)**: Implement "Mental State System" (High/Low Arousal).
- [ ] **Backend/Integration (CodeAgent)**: Supabase integration for "THE CIRCLE" RLS in production.

### Phase 3: Verification & Validation
- [ ] **QA (TestAgent)**: Performance and Accessibility audits.
- [ ] **Ops (OpsAgent)**: Netlify deployment and SEO indexing.

## 3. Communication Pattern
- **Sequential (Pipeline)**: Requirements -> Architecture -> Implementation -> QA.

## 4. Design Philosophy
- **"Eternal Digital Design"**: Minimalist luxury, organic contrast, and timeless storytelling.
- **Hueso Seda (#E5DBD6)** as the primary canvas.
- **Verde Ébano (#2C3729)** for authority and depth.
- **Bosque Profundo (#2C3729) & Oro Antiguo (#CBB67B)** for the internal ERP administrative canvas.

