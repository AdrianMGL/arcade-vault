# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Arcade Vault is a platform for playing games online and competing for the highest number of points. The README is written in Spanish. The codebase is at an early stage: it is still the stock `create-next-app` scaffold (`app/page.tsx` is the default template, and `app/layout.tsx` still has the default metadata).

## Commands

Package manager is npm (`package-lock.json` is present).

- `npm install` — install dependencies
- `npm run dev` — start the Next.js dev server (`next dev`)
- `npm run build` — production build (`next build`)
- `npm run start` — serve the production build (`next start`)
- `npm run lint` — run ESLint (`eslint`, flat config in `eslint.config.mjs`)
- Type check: no script defined; use `npx tsc --noEmit` (`tsconfig.json` has `noEmit: true`, `strict: true`)

There is no test runner configured and no test files exist. Do not assume a test command; if tests are added, document the command here.

## Next.js version warning

`AGENTS.md` states this is Next.js 16 (`next` 16.4.6) with breaking changes from earlier versions. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` rather than relying on memory of older APIs. Heed deprecation notices.

`next.config.ts` enables several experimental or non-default options: `experimental.agentFeedback`, `cacheComponents`, `partialPrefetching`, and a custom Turbopack CSS rule that runs `@tailwindcss/turbopack`. Keep these in mind when changing config or adding caching/data-fetching code.

## Architecture

- App Router (`app/` directory). `app/layout.tsx` is the root layout: it loads Geist and Geist Mono via `next/font/google`, sets them as CSS variables on `<html>`, and defines global metadata.
- Styling is Tailwind CSS v4. `app/globals.css` imports `tailwindcss`, defines `--background` and `--foreground` tokens on `:root` with a dark-mode override under `prefers-color-scheme`, and maps them into Tailwind via `@theme inline`.
- Path alias `@/*` maps to the repo root (`tsconfig.json`).
- Static assets live in `public/`.
- The README points to a spec-driven workflow based on `/spec` and `/spec-impl` directories. Neither directory exists yet. Check for them before assuming a spec exists for a feature.
