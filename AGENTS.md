# AGENTS.md - Adyatara

## Project Overview

Adyatara is an interactive Indonesian folklore storytelling platform built with Next.js 16 (App Router), React 19, TypeScript, Prisma (PostgreSQL), NextAuth v5, Tailwind CSS v4, and shadcn/ui.

## Build / Lint / Test Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint (ESLint with next/core-web-vitals + typescript)
npm run lint

# Database
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Run migrations in dev
npx prisma db seed           # Seed the database (tsx prisma/seed.ts)
npx prisma studio            # Open Prisma Studio

# Docker (PostgreSQL + pgAdmin)
docker compose up -d         # Start services
docker compose down          # Stop services
```

**No testing framework is currently configured.** If tests are added, check `package.json` for the test script and use:
- Vitest: `npx vitest run path/to/test.test.ts`
- Jest: `npx jest path/to/test.test.ts`

## Project Structure

```
src/
  actions/        # Server actions ("use server")
  app/            # Next.js App Router pages and API routes
    api/          # Route handlers (REST endpoints)
    auth/         # Auth pages
    dashboard/    # Dashboard pages
    game/         # Game pages
  components/
    auth/         # Auth-related components
    dashboard/    # Dashboard components
    providers/    # Context providers (session, theme, query)
    shared/       # Shared UI (navbar, footer, etc.)
    ui/           # shadcn/ui primitives (button, card, dialog, etc.)
  generated/      # Prisma generated client (gitignored)
  hooks/          # Custom React hooks (use-app-store, use-mounted)
  lib/            # Utilities, configs, business logic
    validations/  # Zod schemas for form/API validation
  types/          # TypeScript type definitions
prisma/
  schema.prisma   # Database schema
  seed.ts         # Database seed script
```

## Code Style Guidelines

### Imports

- Use `@/*` path alias for all internal imports (maps to `./src/*`)
- Group imports: (1) React/Next, (2) third-party, (3) internal
- Import types with `import type { ... }` syntax
- Use named exports; avoid default exports for components

```ts
import { db } from "@/lib/db";
import { z } from "zod";
import type { ApiResponse, UserProfile } from "@/types";
```

### TypeScript

- Strict mode is enabled (`"strict": true` in tsconfig)
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use `z.infer<typeof Schema>` to derive types from Zod schemas
- Avoid `any`; use `// eslint-disable-next-line @typescript-eslint/no-explicit-any` only when unavoidable

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `Navbar.tsx`, `ThemeToggle.tsx` |
| Hooks | camelCase with `use` prefix | `use-app-store.ts`, `use-mounted.ts` |
| Server actions | camelCase, in `actions/` | `register`, `updateProfile` |
| API routes | `route.ts` in kebab-case dirs | `app/api/stories/[id]/route.ts` |
| Zod schemas | camelCase with `Schema` suffix or descriptive | `profileSchema`, `RegisterSchema` |
| Types/Interfaces | PascalCase | `UserProfile`, `ApiResponse<T>` |
| Files | kebab-case for non-components | `game-engine.ts`, `auth.config.ts` |
| Prisma models | PascalCase | `User`, `GameSession`, `UserKnowledge` |

### Components & Client/Server Boundary

- Server Components are the default (no directive needed)
- Add `"use client"` only when using hooks, event handlers, or browser APIs
- Add `"use server"` at the top of server action files
- Use the `cn()` utility from `@/lib/utils` for conditional Tailwind classes

### Validation

- Use Zod for all input validation (forms, API routes, server actions)
- Define schemas in `src/lib/validations/` or inline in server actions
- Use `schema.safeParse(values)` and return early on failure

```ts
const validated = profileSchema.safeParse(values);
if (!validated.success) {
  return { success: false, error: validated.error.issues[0]?.message ?? "Validation failed" };
}
```

### Error Handling

- Server actions return `{ success: boolean, data?: T, error?: string }` pattern
- Wrap server action logic in try/catch; log errors with `console.error`
- Throw `Error` with descriptive messages in library/engine code (`game-engine.ts`)
- API routes should return proper HTTP status codes

### Styling

- Tailwind CSS v4 with `@tailwindcss/postcss` plugin
- shadcn/ui (base-nova style) for UI primitives in `src/components/ui/`
- Use `cn()` from `@/lib/utils` for className merging (clsx + tailwind-merge)
- Design tokens via CSS variables defined in `globals.css`

### State Management

- **Zustand** for global client state (`use-app-store.ts`)
- **React Query** (`@tanstack/react-query`) for server state / data fetching
- **React Hook Form** + `@hookform/resolvers` (Zod) for forms

### Database (Prisma)

- PostgreSQL via Docker Compose or Supabase
- Prisma client generated to `src/generated/prisma/` (gitignored)
- Use `@prisma/adapter-pg` for connection pooling
- Global Prisma instance singleton pattern in `src/lib/db.ts`
- Run `npx prisma generate` after schema changes

### Authentication

- NextAuth v5 (beta) with Prisma adapter
- JWT session strategy
- Credentials provider with bcrypt password hashing
- Extend `Session` and `User` types via module augmentation in `src/lib/auth.ts`

## Key Conventions

- Prefer server components; minimize client component boundaries
- Use server actions for mutations over API routes when possible
- Keep validation schemas reusable and co-located or in `validations/`
- Never commit `.env` files; use `.env.example` as reference
- Prisma migrations in `prisma/migrations/`; run `npx prisma migrate dev` to create new ones

## Design System

### Color Palette
- Background: `#0A0705`, `#0D0A08`
- Accent: `#E8724A`, `#D96B4A`, `#E86B52`
- Text: `#F5F0EB` (primary), `#9A8A7A` (secondary)
- Borders: `#2E2318`, `#1A1410`

### Card Styling (Fitur Utama style)
- Background: `bg-[#0D0907]` dengan `border-transparent`
- Corner brackets: `w-3 h-3 border-l border-t border-gray-800`
- Hover effect: `group-hover:border-[#D96B4A]/60`
- Icon box: `border border-gray-800/80` dengan corner accents

### Form Styling (Auth pages style)
- Input: `rounded-none`, `py-6`, `bg-[#0D0907]`, `border border-gray-800`
- Corner brackets pada input field
- Label: `text-[10px]`, `tracking-[0.2em]`, `uppercase`, `font-medium`
- Button: `bg-[#E86B52]`, `rounded-none`, `tracking-[0.2em]`, uppercase
- Placeholder: `text-gray-600`

### Typography
- Serif font: untuk heading dan angka besar
- Uppercase: label, button, section title (dengan `tracking-[0.2em]`)
- Light weight: deskripsi dan secondary text

## Next.js Documentation Index
<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-cache-components.mdx,07-fetching-data.mdx,08-updating-data.mdx,09-caching-and-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{ai-agents.mdx,analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route-segment-config.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,browserDebugInfoInTerminal.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,deploymentId.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,isolatedDevBuild.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,deploymentId.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,isolatedDevBuild.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->
