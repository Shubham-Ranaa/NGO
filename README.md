# Sahyog Foundation — NGO Website & Management System

A premium NGO website plus an NGO management console, built as a single
Next.js App Router application. It combines a public-facing site (about,
programs, campaigns, donate, volunteer, transparency, reports) with a
role-based management console for events, volunteers, inventory, donations,
expenses, reports, an audit trail, settings and a community engagement
(CEP) survey.

> **Prototype status.** This is a demonstration build. The organisation,
> people, projects and financial figures are **fictional sample data**. No real
> money is collected, no receipts are issued, and no real beneficiary
> information is stored. Donations, expenses, events, volunteers and inventory
> records are demo data seeded in the browser; only the CEP survey module is
> backed by real collected responses (see below).

---

## Architecture at a glance

- **Framework:** Next.js 16.4 (App Router) + React 19.3 + TypeScript 5.9
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix-based) + `tw-animate-css`
- **Charts:** Recharts
- **Animation:** Motion for React (`motion`) + a custom `Reveal` / `CountUp`
- **Theme:** `next-themes` (class-based, Sun/Moon/Monitor toggle, key `ngo-theme`)
- **Fonts:** Inter (UI) + Fraunces (display) via `next/font/google`
- **No backend.** No Flask, no SQLite, no database, no API routes. Auth is
  hardcoded in code; data lives in memory and is persisted to
  `localStorage`. A single Next.js app serves everything.

### How data & auth actually work

| Concern | Implementation |
| --- | --- |
| Auth | Hardcoded seed accounts in `src/lib/auth.ts`. All seed accounts share one demo password (`demo1234`). Sign-ups are appended in memory and persisted to `localStorage` (`ngo_demo_users`). Session is a simple client-side token in `localStorage` (`ngo_demo_session`). |
| Role checks | Client-side only. Roles: `super-admin`, `manager`, `finance`, `volunteer`, `public-viewer`. |
| NGO data | `src/lib/store.ts` — donations, expenses, events, volunteers, inventory, audit entries, opening balance. Persisted to `localStorage` (`ngo_demo_store`). All totals / balances / charts are computed from stored records. |
| CEP survey | Real data. `public/data/cep_survey_responses_pan_india.csv` (128 responses, 16 states/UTs) is fetched and parsed in the browser by `src/lib/cep-survey.ts`. **Not** stored in `localStorage`. |
| Content (public site) | Static JSON seed files in `src/data/*.json` (campaigns, events, FAQs, impact stats, milestones, partners, programs, projects, reports, stories, team, volunteer opportunities). |

### Roles & demo accounts

All accounts share the password **`demo1234`**.

| Email | Role | Console access |
| --- | --- | --- |
| `admin@sahyog.example.org` | Super Admin | Everything (incl. Settings) |
| `manager@sahyog.example.org` | NGO Manager | Events, volunteers, inventory, CEP, audit |
| `finance@sahyog.example.org` | Finance Manager | Donations, expenses, reports |
| `volunteer@sahyog.example.org` | Field Volunteer | Events, volunteers, CEP |
| `public@sahyog.example.org` | Public Viewer | Redirected to `/transparency` |

You can also register a new account at `/register`; new accounts default to
the `volunteer` role.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (statically prerendered)
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Requires Node 24+ / npm 11+ (matches the host toolchain). No environment
variables are required.

---

## Route map

### Public site (`src/app/(public)/`)

| Route | Page |
| --- | --- |
| `/` | Home (hero, impact stats, design foundations) |
| `/about` | About the organisation |
| `/our-work` | Our work overview |
| `/campaigns`, `/campaigns/[slug]` | Campaigns |
| `/events` | Public events listing |
| `/get-involved` | Ways to get involved |
| `/donate` | Donate |
| `/volunteer` | Volunteer sign-up |
| `/impact` | Impact / stories |
| `/partners` | Partners |
| `/reports` | Public reports |
| `/transparency` | Public transparency page (verified aggregates) |
| `/faq` | FAQ |
| `/contact` | Contact |
| `/login`, `/register` | Auth |

### Management console (`src/app/dashboard/`)

| Route | Page | Notes |
| --- | --- | --- |
| `/dashboard` | Overview | KPIs, income/expense + donut charts, upcoming events, action centre, activity timeline, recent transactions |
| `/dashboard/events` | Events | Budget vs actual, attendance marking, archive / delete |
| `/dashboard/volunteers` | Volunteers | Roster, skills, assignments, attendance history |
| `/dashboard/inventory` | Inventory | Stock balances, low/out-of-stock sorting, category breakdown |
| `/dashboard/donations` | Donations | Verify / reject, receipt tracking, monthly chart |
| `/dashboard/expenses` | Expenses | Approval flow, category pie, invoice tracking |
| `/dashboard/reports` | Reports | Opening balance, monthly income vs expense, unverified txns, missing docs, CSV / print export |
| `/dashboard/cep` | CEP Survey | **Real data** — 128 responses, demographics, awareness/engagement, needs/priorities, trust/barriers, attitude scales, feature requests, field quotes, searchable response browser with full-detail dialog, CSV export |
| `/dashboard/audit` | Audit trail | Search + role/record filters, diff chips, CSV export |
| `/dashboard/settings` | Settings | Add user, role counts, users table, "Reset demo data & sign out" |

A separate `/admin/*` route tree also exists (activity log, attendance,
beneficiaries, budgets, campaigns, content, distributions, donations,
events, expenses, inventory, people, programs, projects, reports, settings,
tasks, users, volunteers) — these are scaffolded console pages.

---

## CEP survey data (real)

Source file: `public/data/cep_survey_responses_pan_india.csv` (213 KB,
128 responses, 34 columns: `ID, Name, Is Demo, Submitted At, Q1 … Q30`).

The CEP page (`/dashboard/cep`) shows **all 128 records**, every field
preserved, including multi-select answers (community problems, useful
supports, volunteer encouragements, barriers, trust factors, website info
needed) and free-text answers. Aggregates are computed client-side:
age groups, occupation, states, NGO familiarity, past participation,
community problems, useful supports, highest priority, trust factors,
barriers, attitude scales, digital readiness, feature requests. The
"Voices from the field" section quotes real free-text answers with
respondent name, city and occupation. A searchable response browser lists
all 128 rows; clicking a row opens a dialog with that respondent's
complete answers. CSV export of the full dataset is available.

Notes:
- The CSV's `Is Demo` column is `Yes` for 127 rows and `No` for 1. Since the
  file is treated as real collected data, all 128 rows are shown as real
  field data. If that column should instead gate demo vs. real rows, tell
  us and the loader can be adjusted.
- CEP data is **read-only from the CSV** — it is not part of `localStorage`
  and is not editable in the console. Old demo CEP entries in
  `localStorage` are stripped on hydrate.
- Demographic note: ages 18–25 are the largest cohort (44%), 96% smartphone
  access, 71% have volunteered before, 40% interested but never
  participated. No contact details are collected beyond name.

---

## Design system

Tokens live in `src/app/globals.css` (semantic-only — components never
hardcode a colour, so every surface adapts to the active theme).

- **Light:** warm cream surfaces, deep forest-green primary, sage secondary.
- **Dark:** layered deep-charcoal surfaces, lifted green primary.
- **Accent tokens:** `success`, `warning`, `info`, `destructive` tuned to
  read as legible text in both themes.
- **Chart tokens:** `chart-1`…`chart-5` for dashboards.
- **Sidebar tokens:** `sidebar*` keep the console visually separate.

Theming uses `next-themes` with `attribute="class"` and storage key
`ngo-theme`. The theme switch renders Sun / Moon / Monitor and persists
across reloads with no flash on first paint. Reduced-motion preferences
are honoured globally via a `prefers-reduced-motion` block plus the
`useReducedMotion` guard in `Reveal`.

Shared primitives: `CountUp`, `Reveal`, `ModuleHero`, `ModuleStat`,
`StatusPill`, `FilterChip`, `SearchBar`, `SectionCard`, `EmptyState`,
`ModuleFooter`, `DownloadButton`, `FormField`. Module pages are built on
these so the visual language stays consistent.

---

## Project structure

```
src/
  app/
    (public)/         public route group — navbar + footer shell
    admin/            scaffolded management console pages
    dashboard/        management console (rebuilt with new design language)
      audit/ cep/ donations/ events/ expenses/ inventory/ reports/ settings/ volunteers/
    layout.tsx        root: fonts, metadata, providers
    globals.css       design tokens (light/dark), container & motion rules
    not-found.tsx     styled 404
  components/
    dashboard/        app shell (layout), module-kit (shared primitives)
    layout/           logo, public navbar/footer, admin sidebar/topbar/shell, breadcrumbs
    public/           hero, impact stats, section heading, design foundations
    shared/           count-up, reveal
    theme/            theme provider + toggle
    ui/               shadcn/ui primitives (Radix-based)
  config/             siteConfig, adminNav (nav + breadcrumb source of truth)
  data/               static JSON seed files for the public site
  lib/                auth, store, format, utils, content, cep-survey
public/
  data/               cep_survey_responses_pan_india.csv (real survey data)
```

### Conventions

- **Semantic tokens only** in components; brand colours change in one place.
- **`StatusPill` maps tones, not domains** — the data layer owns domain
  statuses and maps them to `emerald | amber | rose | sky | violet | slate`.
- **Destructive actions** go through a confirm dialog (always requires an
  explicit second click).
- **Navigation is configuration-driven** — `config/site.ts` and
  `config/admin-nav.ts` drive layouts, drawers and breadcrumbs together.
- **All demo financial data is labelled as synthetic.** Nothing is presented
  as a real NGO transaction, event, receipt or financial claim.

---

## Prototype limitations

These are architectural, not cosmetic, and must not be presented otherwise:

- **No external database.** Runtime edits are persisted to browser
  `localStorage` through a central typed storage service
  (`src/lib/store.ts`). Data is device- and browser-specific.
- **`localStorage` is not a secure database.** No server-side
  authorisation, no cross-device synchronisation, no reliable multi-user
  persistence.
- **Authentication is simulated.** Client-side role checks can be edited by
  the user and are not access control. No plaintext passwords or sensitive
  credentials are stored beyond the shared demo password in source.
- **Donations, expenses, events, volunteers and inventory are simulated
  records.** No payment gateway is integrated; no real transaction occurs
  and no receipt is issued.
- **Beneficiary records are synthetic.** No sensitive real-world personal
  data belongs in this prototype. Respondent names in the CEP survey are
  shown as recorded in the source file; no contact details are collected.
- Production deployment would require real server-side authentication and
  shared server-side storage before any real data could be used.

---

## Resetting demo data

In the console: **Settings → "Reset demo data & sign out"** removes
`ngo_demo_store` and `ngo_demo_session` from `localStorage` and redirects
to `/login`. The CEP CSV is unaffected (it is shipped as a static asset
and re-fetched on next load).

To fully reset including registered users, also clear `ngo_demo_users` in
the browser's DevTools → Application → Local Storage.
