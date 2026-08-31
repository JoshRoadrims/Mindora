# Mindora — Investor-Ready Prototype Codebase

**Mental health before crisis.**

An AI-enabled early mental-health risk screening, referral, and continuous-support
platform for the Kenyan market. This repo is a front-end prototype: three portals
(User, Mental-Health Professional, Mindora Admin), built as a demoable, extensible
React codebase — not a production clinical system.

## Tech stack

- React 18 + Vite
- React Router v6 (client-side routing across all 3 portals)
- Tailwind CSS (custom navy/teal design tokens in `tailwind.config.js`)
- lucide-react (icons)
- No backend — all data is mocked in `src/data/mockData.js`. State for the demo
  journey (check-in answers → risk result → booking) lives in
  `src/data/AppState.jsx` (React Context).

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

```bash
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

## Project structure

```
src/
  components/     Shared UI: Card, Badge, Button, Sidebar, PageHeader,
                  LineChart, BarChart, Disclaimer, Placeholder
  layouts/        One layout per portal (sidebar + outlet)
  pages/
    auth/         Login (role toggle), Signup (role selection)
    user/         Individual user portal — 10 screens
    professional/ Mental-health professional portal — 8 screens
    admin/        Mindora internal admin portal — 8 screens
  data/
    mockData.js   All mock content (professionals, referrals, trends, analytics)
    AppState.jsx  Cross-screen state for the demo journey
  App.jsx         All routes for all three portals
```

## The investor demo flow

This is the path the prototype is built to walk an investor through end to end.

**1. User journey**
`/` (login, choose "I'm a user") → `/app` (dashboard) → `/app/check-in`
(10-question wellbeing check-in) → `/app/check-in/result` (branches automatically:
low-concern or elevated-risk, based on your answers) → `/app/find-a-professional`
(filterable directory) → professional profile → `/app/book` (booking flow) →
`/app/wellbeing` (longitudinal wellbeing chart — demonstrates long-term value, not
just a one-off marketplace transaction).

**2. Professional journey**
`/` (login, choose "Professional") → `/pro` (dashboard with referral alerts) →
`/pro/referrals/:id` (referral summary — screening data, risk flags, accept /
escalate actions) → `/pro/clients/view` (client wellbeing history, assessments,
appointments, clinical notes).

**3. Admin journey**
From the login screen, "Enter admin console" → `/admin` (platform-wide KPIs and
growth/conversion charts) → `/admin/safety` (the four-tier LOW / ELEVATED / HIGH /
ACUTE escalation queue — built to look serious and controlled, not a normal
consumer dashboard).

## Product principles baked into the UI

- **Preventive** — the whole flow is framed around catching things early, not
  crisis response.
- **Clinically responsible** — every screening result, AI reply, and referral
  screen carries a disclaimer that Mindora assists and refers; it does not
  diagnose. See `src/components/Disclaimer.jsx`, used throughout.
- **Private** — client identifiers in the professional/admin portals are
  pseudonymous (`Anonymous User #MND-XXXXX`), and screens are written to expose
  only what a reviewer needs.
- **Action-oriented** — every screen ends in a next step (check-in, book, review,
  escalate), never a dead end.
- **Scalable** — admin includes an "Institutions" section as a placeholder for
  employers, universities, and healthcare-provider accounts.

## What's mocked vs. what a real MVP needs

Everything here is static/mocked so the prototype can run with zero backend.
Turning this into an MVP means, at minimum:

- Real auth (with proper role-based access control — this matters a lot given
  the sensitivity of the data)
- A backend + database with encryption at rest, audit logging, and strict
  access controls for anything tied to an identifiable person
  (a compliance/legal review for Kenyan data protection law, and likely
  HIPAA-equivalent handling if you expand beyond Kenya, should happen before
  storing real user data)
- A real (validated, clinician-reviewed) scoring model behind the check-in —
  the demo's risk branching (`submitCheckIn` in `AppState.jsx`) is a placeholder
  formula, not a validated instrument
- Real-time video infrastructure for online consultations
- Payments integration for consultation fees
- Notification infrastructure (email/SMS) for referral alerts, booking
  confirmations, and check-in reminders

## Design tokens

Defined in `tailwind.config.js`:
- **Navy** (`navy-800` / `#0f1e3d`) — primary brand color
- **Teal** (`teal-400` / `#3fbea3`) — accent, CTAs, positive states
- **Ink** — neutral grays for text and borders
- Typography: Plus Jakarta Sans (display/headings), Inter (body)
