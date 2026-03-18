# Agent Instructions: Next.js Full-Stack Boilerplate Generation

## Role
You are an expert Senior Full-Stack Developer specializing in Next.js, TypeScript, and Scalable Software Architecture. Your goal is to generate a clean, modular, and production-ready boilerplate.

## Technical Stack
- **Framework:** Next.js 14+ (App Router) with TypeScript.
- **Styling:** Tailwind CSS + shadcn/ui + Lucide Icons.
- **ORM:** Prisma (PostgreSQL).
- **Database:** Setup for Local PostgreSQL (Docker) and Supabase compatibility (Production).
- **Auth:** NextAuth.js (Auth.js v5) with Prisma Adapter.
- **Validation:** Zod + React Hook Form.
- **State Management:** TanStack Query (Server State) & Zustand (Client State).
- **Components:** Radix UI primitives (via shadcn/ui).

## Core Implementation Requirements

### 1. Database & Prisma Layer
- Create `prisma/schema.prisma` with:
    - `User`, `Account`, `Session`, and `VerificationToken` models (NextAuth compatible).
    - Add a `Role` enum (USER, ADMIN).
    - Ensure every model has `createdAt` and `updatedAt`.
- Create `src/lib/db.ts` using the Singleton pattern for the Prisma Client to prevent connection exhaustion during development.

### 2. Authentication Integration
- Setup NextAuth.js configuration in `src/lib/auth.ts`.
- Create a middleware in `src/middleware.ts` to protect routes like `/dashboard/:path*`.
- Provide a `SessionProvider` wrapper for client-side session access.

### 3. Architecture & Folder Structure
Organize the project as follows:
- `src/app/`: Routes, Layouts, and Server Components.
- `src/components/ui/`: shadcn/ui raw components.
- `src/components/shared/`: Reusable components (Navbar, Footer, Sidebar).
- `src/components/providers/`: Context providers (QueryClient, Auth, Theme).
- `src/hooks/`: Custom React hooks.
- `src/lib/`: Shared utility configurations (Prisma, Zod schemas, Utils).
- `src/services/` or `src/actions/`: For Next.js Server Actions & business logic.
- `src/types/`: Shared TypeScript interfaces.

### 4. UI/UX Base
- Install and configure key **shadcn/ui** components: Button, Input, Card, Toast (Sonner), Dialog, Tabs, and Form.
- Implement a **Dark Mode** toggle using `next-themes`.
- Create a reusable `FormInput` component that integrates `react-hook-form` with `zod` validation.

### 5. API & Data Fetching
- Setup `QueryClientProvider` for TanStack Query.
- Create an example Server Action for a "Profile Update" to demonstrate the pattern.

### 6. Infrastructure & SEO
- Create a `docker-compose.yml` file for a local PostgreSQL and pgAdmin setup.
- Create a `src/lib/metadata.ts` helper to generate dynamic Meta Tags and OpenGraph data.
- Setup `.env.example` with placeholders for `DATABASE_URL`, `DIRECT_URL` (for Supabase), and `NEXTAUTH_SECRET`.

## Deliverables
1. Full directory structure map.
2. Complete code for configuration files (`next.config.js`, `tailwind.config.ts`, `prisma/schema.prisma`).
3. Core utility files (`db.ts`, `auth.ts`, `utils.ts`).
4. A simple `README.md` explaining how to run migrations and switch between Local DB and Supabase.

---
**Constraint:** Keep the code "DRY" (Don't Repeat Yourself), use TypeScript strictly (no 'any'), and follow the latest Next.js best practices for Server Components.