# Pathway

Career projection and roadmap platform for university students and recent graduates. Explore careers, see where they're heading, assess your skill gap, and build a personalized, staged pathway with curated resources and progress tracking.

## Stack

- React 19 + TypeScript, Vite
- React Router for navigation
- Zustand (with `localStorage` persistence) for auth, saved careers, assessment state, active pathway and progress
- Tailwind CSS v4 for styling and design tokens
- Recharts for career demand projections

## Getting started

```bash
npm install
npm run dev
```

## Project structure

- `src/types` — core data model (Career, Skill, Pathway, Resource, Opportunity, User, UserProgress)
- `src/data` — seeded mock content: 17 careers, ~80 skills, curated resources, pathways and opportunities
- `src/lib/personalization.ts` — deterministic, rule-based skill-gap and recommendation logic
- `src/store` — Zustand stores (`authStore`, `appStore`, `toastStore`)
- `src/components/ui` — design-token-driven component library (buttons, cards, badges, progress, tabs, modal, toaster, etc.)
- `src/components/feature` — domain components (career/opportunity/resource cards, pathway accordion, projection chart)
- `src/components/layout` — public/admin navigation shells
- `src/pages` — routed screens, including a lightweight `admin/` content-management section

## Notes

- Authentication and admin CRUD are mocked/local for this prototype — no backend is required to run it.
- Career projection and salary data is illustrative, clearly labeled as such, and structured so it can be replaced by verified labour-market data later without UI changes.
