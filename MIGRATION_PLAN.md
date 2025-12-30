# Tech Stack Audit - Standalone App Migration Plan

## 📋 **Executive Summary**

This document outlines the complete strategy for extracting the "Tech Stack ROI Auditor" from `maru-website` and establishing it as a standalone Next.js application in `/Users/ramoloimotsei/tech-stack-audit`.

---

## 🎯 **Goals**

1.  **Independence**: Create a fully self-contained app.
2.  **Brand Consistency**: Apply Maru Turquoise (#3DD6D0) brand colors.
3.  **Database Autonomy**: Setup independent Supabase tables for `tools` and `assessments`.
4.  **Zero Downtime**: Maintain existing functionality during transition.

---

## 📦 **Scope & Analysis**

### **Source Files (maru-website)**

1.  **UI**: `app/assessments/tech-audit/TechAuditPageNew.tsx` (Main Interface)
2.  **Logic**: `lib/assessments/tech-audit.ts` (Core Analysis Engine)
3.  **API**: `app/api/tools/route.ts` (Data Fetching)
4.  **Dependencies**: `lib/ai.ts` (Gemini), `lib/supabase.ts` (Database)

### **Target Architecture**

-   **Framework**: Next.js 15+ (App Router)
-   **Styling**: Tailwind CSS (Maru Theme)
-   **Database**: Supabase
-   **AI**: Google Gemini
-   **UI Library**: Framer Motion, Lucide React

---

## 📝 **Step-by-Step Migration Plan**

### **Phase 1: Project Initialization**
1.  Initialize Next.js app in `/Users/ramoloimotsei/tech-stack-audit`.
2.  Install dependencies:
    -   `@google/generative-ai`
    -   `@supabase/supabase-js`
    -   `framer-motion`
    -   `lucide-react`
    -   `zod`
    -   `clsx`, `tailwind-merge`
3.  Configure `.env.local` with Supabase & Gemini keys.

### **Phase 2: Database Setup (Supabase)**
1.  **Table: `tools`**
    -   `id` (uuid)
    -   `name` (text)
    -   `category` (text)
    -   `avg_monthly_cost` (numeric)
    -   `description` (text)
2.  **Table: `assessments`** (Shared structure)
3.  **Seed Data**: Insert common SaaS tools (Slack, HubSpot, Jira, etc.) so the app is functional immediately.

### **Phase 3: Core Logic Migration**
1.  Extract `tech-audit.ts` logic into `lib/audit/engine.ts`.
2.  Refactor `getAvailableTools` to use the standalone Supabase client.
3.  Implement `lib/ai.ts` for Gemini integration.

### **Phase 4: Frontend Implementation**
1.  Create `app/page.tsx` adapting `TechAuditPageNew.tsx`.
2.  **Theming**: Replace all hardcoded colors with CSS variables mapped to Maru Turquoise.
3.  **Components**: Extract `TechAuditResults`, `ToolCard`, and `SummaryCard` into separate components for maintainability.
4.  Add `AtmosphericBackground` for visual consistency.

### **Phase 5: API Routes**
1.  `POST /api/analyze`: Endpoint to handle the full audit logic and AI generation.
2.  `GET /api/tools`: Endpoint to fetch the list of available software tools.

### **Phase 6: Deployment**
1.  Build check (`npm run build`).
2.  Deploy to Vercel.

---

## 📅 **Timeline**

-   **Phase 1-2**: 30 mins
-   **Phase 3-4**: 1.5 hours
-   **Phase 5-6**: 30 mins

**Total Time**: ~2.5 hours
