## Arcade Vault

Es una plataforma para jugar online y competir por la mayor cantidad de puntos.

## Usa Spec Driven Design

Basado en /spec y /spec-impl

Siguiendo las buenas practicas recomendadas aquí:
https://github.com/Klerith/fernando-skills

## Skills usadas

```bash
npx skills@latest add Klerith/fernando-skills
```

## Commands

Package manager is npm (`package-lock.json` is present).

- `npm install` — install dependencies
- `npm run dev` — start the Next.js dev server (`next dev`)
- `npm run build` — production build (`next build`)
- `npm run start` — serve the production build (`next start`)
- `npm run lint` — run ESLint (`eslint`, flat config in `eslint.config.mjs`)
- Type check: no script defined; use `npx tsc --noEmit` (`tsconfig.json` has `noEmit: true`, `strict: true`)

There is no test runner configured and no test files exist. Do not assume a test command; if tests are added, document the command here.