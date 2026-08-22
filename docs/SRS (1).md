# Software Requirements Specification (SRS)

## Spendora — Personal Finance Management Platform

| | |
|---|---|
| **Document Type** | Software Requirements Specification (Agent-Executable) |
| **Product Name** | **Spendora** *(renamed from "PennyPilot")* |
| **Document Scope** | Version 1 (Core Expense Tracker), Version 2 (Better Expense Management), Version 3 (Analytics & Budget) |
| **Deployment Target** | Database: **Supabase** (managed PostgreSQL) · Backend: **Docker → Render** · Frontend: **Vercel** |
| **Status** | Final Draft v2.0 — updated for deployment architecture |
| **Document Owner** | Ras |
| **Intended Consumer** | Human developer **and** AI coding agents (e.g. Antigravity) operating on this repository |

---

# 0. Agent Quick Reference

> Read this section first. It is a condensed, unambiguous summary of the facts an AI coding agent needs before writing any code. Full detail for every row is in the referenced section.

| Fact | Value | Section |
|---|---|---|
| Product name (use everywhere) | `Spendora` | §16 |
| Java base package | `com.spendora.backend` | §10.2 |
| Main class | `SpendoraApplication.java` | §10.2 |
| Local database | PostgreSQL (via Docker Compose) | §11.2 |
| Production database | **Supabase** (managed PostgreSQL, pooled connection via PgBouncer, SSL required) | §11.1 |
| Backend containerization | **Docker** (single `backend/Dockerfile`, multi-stage build) | §11.3 |
| Backend hosting | **Render** (Docker-based Web Service) | §11.3 |
| Frontend hosting | **Vercel** (static/edge build from `frontend/`) | §11.4 |
| Config method | Environment variables only — never hardcoded, never committed | §11.5, §12.5 |
| Migration tool | Flyway-style versioned SQL files in `database/migrations/` | §12.4 |
| Scope of this SRS | V1 + V2 + V3 only. Do NOT implement V4–V14 features. | §1.2 |
| Architecture changes | Forbidden without explicit approval | §14, rule 1 |
| Design system | Token-based only — no inline styles, no hardcoded colors/spacing | §9 |
| Testing requirement | Every new feature needs an accompanying automated test | §8.7, rule 10 |
| Git rule | No direct pushes to `main`; PR + review required | §14, rule 12 |
| Secrets rule | Never request, log, or expose secrets/credentials | §14, rules 3–5 |

**If any instruction in a prompt conflicts with this SRS or with `Agents.md` (§15), the agent must stop and ask for approval (rule 15) rather than proceed on assumption.**

---

# Table of Contents

1. Introduction
2. Overall Description
3. System Features / Functional Requirements — Version 1
4. System Features / Functional Requirements — Version 2
5. System Features / Functional Requirements — Version 3
6. External Interface Requirements
7. Non-Functional Requirements
8. Testing Requirements
9. UI / UX Design System (Full Specification)
10. System Architecture & Repository Structure
11. Deployment & Infrastructure Architecture (Supabase · Docker · Render · Vercel)
12. Database Design & Migration Strategy
13. Configuration & Environment Variables
14. Development, Git & CI/CD Standards
15. Agent Operating Rules (Agents.md — Binding)
16. Migration Note: PennyPilot → Spendora
17. Production Release Criteria
18. Assumptions, Dependencies & Constraints
19. Traceability Matrix
20. Glossary
21. Appendix A — Full Product Roadmap (V1–V14) for Context
22. Appendix B — Cross-Version Engineering Standards, Guiding Principles & Final Vision

---

# 1. Introduction

## 1.1 Purpose

This SRS is the single, authoritative, buildable specification for **Spendora Versions 1 through 3**, including the concrete deployment architecture: **Supabase** for the database, **Docker** for backend containerization, **Render** for backend hosting, and **Vercel** for frontend hosting. It is written to be directly executable by an AI coding agent (e.g. Antigravity) as well as by a human developer.

## 1.2 Scope

**In scope:** V1 — Core Expense Tracker, V2 — Better Expense Management, V3 — Analytics & Budget, plus the full deployment pipeline for these versions.

**Out of scope (deferred, context only in Appendix A):** V4–V14 (income/accounts, auth/RBAC, professional web polish, mobile, recurring/files/notifications, performance hardening, security hardening/VAPT, AI/RAG/agentic features).

## 1.3 Intended Audience

The developer (Ras); any AI coding agent (Antigravity or otherwise) operating on this repository, bound by §15; any future human contributor.

## 1.4 Definitions, Acronyms, Abbreviations

| Term | Meaning |
|---|---|
| SRS | Software Requirements Specification (this document) |
| DTO | Data Transfer Object |
| CRUD | Create, Read, Update, Delete |
| RBAC | Role-Based Access Control |
| PgBouncer | Connection pooler used by Supabase for pooled Postgres connections |
| CI/CD | Continuous Integration / Continuous Deployment |
| IaC-lite | Config-as-code deployment definitions (e.g. `render.yaml`, `vercel.json`) — not full infrastructure-as-code, but declarative deploy config |

## 1.5 Product Naming

The product is **Spendora** (renamed from "PennyPilot" in the original roadmap). See §16 for the full rename mapping.

## 1.6 Deployment Summary (Binding)

| Layer | Local Development | Production |
|---|---|---|
| Database | PostgreSQL via Docker Compose | **Supabase** (managed Postgres) |
| Backend | Spring Boot run via Docker (or local JVM) | **Docker image deployed on Render** |
| Frontend | Vite dev server | **Vercel** (build output deployed globally) |

Full detail in §11.

---

# 2. Overall Description

## 2.1 Product Perspective

Spendora is a standalone, full-stack personal finance web application. Every version is a complete, usable, tested, and **deployed** product — not just a code milestone. With this revision, "deployed" concretely means: database live on Supabase, backend container running on Render, frontend live on Vercel.

## 2.2 Product Functions Summary (V1–V3)

| Version | Product Stage | Primary Capability |
|---|---|---|
| V1 | Core Expense Tracker | Expense management (CRUD, categories, basic filter/summary) |
| V2 | Better Expense Management | Search, filter, sort, pagination |
| V3 | Analytics & Budget | Spending analytics and budget tracking |

## 2.3 User Classes and Characteristics

Single-user, unauthenticated (auth arrives at V5, out of scope). One user class: **Individual user** managing their own expenses, analytics, and budgets.

## 2.4 Operating Environment

| Layer | Technology | Notes |
|---|---|---|
| Backend runtime | JVM (Spring Boot) | Packaged as a Docker image |
| Backend hosting | **Render** (Web Service, Docker runtime) | Auto-deploys from the connected Git branch |
| Database | **Supabase** (managed PostgreSQL) | Pooled connection (PgBouncer, port 6543) for the app; direct connection (port 5432) reserved for migrations |
| Frontend runtime | Modern evergreen browsers | Chrome, Edge, Firefox, Safari |
| Frontend framework | React (Vite) | Static build output |
| Frontend hosting | **Vercel** | Deploys from `frontend/`, framework preset: Vite |
| Local orchestration | **Docker Compose** | Spins up backend + local Postgres for development parity |
| CI | GitHub Actions | Builds, tests, then triggers Render/Vercel deploys |

## 2.5 Design & Implementation Constraints

- Repository structure (§10.2) must not change without approval.
- Agents.md rules (§15) are binding without exception.
- Design System (§9) is binding for all frontend work.
- No V4+ feature may be implemented under this SRS's scope.
- Database access in production must go through Supabase's pooled connection string, not a direct connection, except for migration jobs (see §11.1).

## 2.6 Assumptions and Dependencies

See §18.

---

# 3. System Features / Functional Requirements — Version 1: Core Expense Tracker

## 3.1 Objective

Build a simple but production-ready expense tracking application, deployed and usable by a real user.

## 3.2 Feature: Expense Management (CRUD)

| ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | The system shall allow a user to create a new expense. | Must |
| FR-1.2 | The system shall allow a user to view all expenses. | Must |
| FR-1.3 | The system shall allow a user to view a single expense by its ID. | Must |
| FR-1.4 | The system shall allow a user to update an existing expense. | Must |
| FR-1.5 | The system shall allow a user to delete an expense. | Must |

## 3.3 Expense Data Model

| Field | Type | Constraints |
|---|---|---|
| id | UUID | Primary key, system-generated |
| title | String | Required |
| amount | Decimal | Required, > 0 |
| category | Enum | Required |
| expenseDate | Date | Required |
| description | String | Optional |
| createdAt | Timestamp | System-generated, immutable |
| updatedAt | Timestamp | System-generated, updated on every write |

**Agent note:** Use `UUID` (not auto-increment `Long`) as the primary key type for all entities in this project — this is friendlier for Supabase's Postgres defaults (`gen_random_uuid()`) and avoids ID collisions across environments.

## 3.4 Initial Categories

`Food` · `Transport` · `Shopping` · `Bills` · `Health` · `Entertainment` · `Other`

## 3.5 Basic Filtering

| ID | Requirement |
|---|---|
| FR-1.6 | Filter expenses by category. |
| FR-1.7 | Filter expenses by date. |

## 3.6 Basic Summary

| ID | Requirement |
|---|---|
| FR-1.8 | Compute and expose total expense amount. |
| FR-1.9 | Compute and expose total number of expenses. |

## 3.7 Engineering Scope (V1)

PostgreSQL (Supabase in production) · REST APIs · backend validation · DTO-based API design · global exception handling · API documentation · automated tests · Git/GitHub · CI pipeline · Docker build · Render deployment · Vercel deployment.

## 3.8 Frontend Requirements (V1)

| ID | Requirement |
|---|---|
| FR-1.10 | Dashboard view. |
| FR-1.11 | Expense list view. |
| FR-1.12 | Add Expense form. |
| FR-1.13 | Edit Expense form. |
| FR-1.14 | Delete Expense with confirmation. |
| FR-1.15 | Basic expense summary (total amount, count). |
| FR-1.16 | Responsive across desktop and mobile. |

## 3.9 Release Outcome

**Spendora V1 — Live Expense Tracker**, deployed with database on Supabase, backend on Render, frontend on Vercel.

---

# 4. System Features / Functional Requirements — Version 2: Better Expense Management

## 4.1 Objective

Improve usability at larger expense volumes.

## 4.2 Search

| ID | Requirement |
|---|---|
| FR-2.1 | Search expenses by title. |
| FR-2.2 | Search expenses by description (should-have). |

## 4.3 Filtering

| ID | Requirement |
|---|---|
| FR-2.3 | Filter by category. |
| FR-2.4 | Filter by date range. |
| FR-2.5 | Filter by amount range. |

## 4.4 Sorting

| ID | Requirement |
|---|---|
| FR-2.6 | Sort by date. |
| FR-2.7 | Sort by amount. |
| FR-2.8 | Sort by title. |
| FR-2.9 | Ascending/descending for each. |

## 4.5 Pagination

| ID | Requirement |
|---|---|
| FR-2.10 | Page-number-based pagination. |
| FR-2.11 | Configurable page size. |
| FR-2.12 | Pagination navigation controls in the UI. |

## 4.6 Backend Changes (V2)

Combined search/filter/sort/paginate API. List responses include pagination metadata (total elements, total pages, current page, page size).

## 4.7 Database Changes (V2)

Indexes on `category`, `expense_date`, `amount`, `title`. Applied via a new versioned migration (`V2__search_filter_indexes.sql`) — see §12.

**Agent note (Supabase-specific):** Run index-creation migrations against Supabase's **direct connection** (port 5432), not the pooled connection (port 6543) — PgBouncer in transaction mode can interfere with some DDL operations. See §11.1.

## 4.8 Frontend Changes (V2)

Search bar, filter controls, sort controls, pagination controls on the expense list.

## 4.9 Release Outcome

**Spendora V2 — Efficient Expense Management**, same deployment targets, index migration applied to Supabase.

---

# 5. System Features / Functional Requirements — Version 3: Analytics & Budget

## 5.1 Objective

Move from recording to understanding spending.

## 5.2 Analytics

| ID | Requirement |
|---|---|
| FR-3.1 | Daily spending. |
| FR-3.2 | Weekly spending. |
| FR-3.3 | Monthly spending. |
| FR-3.4 | Category-wise spending. |
| FR-3.5 | Total spending for a selected period. |
| FR-3.6 | Average spending for a selected period. |
| FR-3.7 | Highest expense in a period. |
| FR-3.8 | Lowest expense in a period. |

## 5.3 Budget Management

| ID | Requirement |
|---|---|
| FR-3.9 | Create a budget. |
| FR-3.10 | Update a budget. |
| FR-3.11 | Delete a budget. |
| FR-3.12 | View budget(s). |
| FR-3.13 | Track budget utilization in real time. |

### Worked Example

```
Monthly Budget:       ₹50,000
Spent:                ₹38,500
Remaining:            ₹11,500
Utilization:             77%
```

## 5.4 Budget Data Model

| Field | Type | Constraints |
|---|---|---|
| id | UUID | Primary key |
| scope/name | String | e.g. "Monthly Budget" |
| category | Enum (nullable) | Null = overall; set = category-specific |
| periodStart | Date | Required |
| periodEnd | Date | Required |
| limitAmount | Decimal | Required, > 0 |
| createdAt / updatedAt | Timestamp | System-generated |

## 5.5 Frontend Requirements (V3)

Analytics dashboard, charts (trend + category breakdown), category breakdown view, monthly reports, budget progress indicator (`--warning` at 80–99%, `--destructive` when over budget), spending summaries.

## 5.6 Release Outcome

**Spendora V3 — Personal Spending Analytics**, with the `Budget` table added to Supabase via `V3__budget_schema.sql`.

---

# 6. External Interface Requirements

## 6.1 User Interfaces

See §9. Screens by end of V3: Dashboard, Expense List, Add/Edit Expense, Analytics Dashboard, Budget Management, 404.

## 6.2 API Interfaces

- REST over HTTPS in production (Render terminates TLS)
- JSON request/response bodies
- DTOs only — never raw entities serialized
- Standard status codes: `200`, `201`, `204`, `400`, `404`, `409` (where applicable), `500`
- Consistent `ErrorResponse` shape
- OpenAPI/Swagger documentation (`OpenApiConfig.java`)
- Postman collection (`Spendora.postman_collection.json`) and environment (`Spendora.postman_environment.json`) maintained, with separate entries/variables for local vs. Render-hosted base URLs

## 6.3 Hardware Interfaces

None — standard client device with a modern browser.

## 6.4 Communications Interfaces

HTTPS between the Vercel-hosted frontend and the Render-hosted backend; TLS-secured connection between the backend and Supabase.

---

# 7. Non-Functional Requirements

## 7.1 Database

Proper schema design, DB-level constraints, explicit relationships, indexes where required, versioned migrations, data integrity, production-safe (non-destructive, backward-compatible) changes. **Now hosted on Supabase** — see §11.1 for connection-handling specifics.

## 7.2 Backend

Layered architecture (Controller → Service → Repository), REST standards, validation on all writes, centralized error handling, structured logging, externalized configuration via environment variables (§13), automated tests at every layer, no secrets in code. **Now containerized via Docker and deployed on Render.**

## 7.3 Frontend

Component-based architecture, single canonical component per UI element, responsive design, dynamic data only, full API integration (pointed at the Render backend URL via an env variable), loading/empty/error states everywhere, accessibility, performance-conscious delivery. **Now deployed on Vercel.**

## 7.4 Reliability & Availability

The application must remain fully usable after every release; no version regresses prior functionality. Render and Vercel free/starter tiers may cold-start after inactivity — document this as a known behavior, not a defect, at this project stage.

## 7.5 Maintainability

Reusable architecture, minimal hardcoding, declarative deploy configuration (`render.yaml`, `vercel.json`) kept in version control alongside application code.

## 7.6 Security (Baseline for V1–V3)

No secrets committed; environment variables for all configuration; basic input validation/sanitization; no sensitive data in error responses or logs; Supabase connection string and any API keys stored only in Render's/Vercel's environment variable dashboards and local `.env` (gitignored) — never in the repository.

## 7.7 Portability

The backend must run identically via `docker run` locally and on Render (same image, environment-variable-driven configuration difference only) — no environment-specific code branches.

---

# 8. Testing Requirements

- Unit tests for services
- Integration tests for controllers/repositories
- API-level testing via the Postman collection, runnable against both the local Docker stack and the deployed Render URL
- No feature is complete without an accompanying automated test (Agents.md rule 10)
- CI must run the full test suite before triggering any deploy (§14.2)

---

# 9. UI / UX Design System (Full Specification)

*(Unchanged from the design source — binding for all V1–V3 frontend work regardless of hosting target.)*

**Style:** Modern premium financial dashboard — calm, data-first, quietly confident.
**References in spirit:** Linear, Revolut, Mercury, Stripe Dashboard.

## 9.1 Design Principles

1. Numbers are the hero — largest type, tabular figures.
2. Layer, don't outline — elevation and shadow, not heavy borders.
3. One accent, used sparingly — emerald marks action and positive money flow only.
4. Motion confirms, never entertains — 120–240ms, ease-out.
5. Every state is designed — empty, loading, error, success are first-class.

## 9.2 Color Tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | `oklch(0.99 0.004 95)` | `oklch(0.16 0.012 260)` | App canvas |
| `--foreground` | `oklch(0.20 0.02 260)` | `oklch(0.97 0.004 250)` | Primary text |
| `--card` | `oklch(1 0 0)` | `oklch(0.21 0.014 260)` | Elevated surfaces |
| `--card-foreground` | `oklch(0.20 0.02 260)` | `oklch(0.97 0.004 250)` | Text on cards |
| `--popover` / `--popover-foreground` | same as card | same as card | Menus, modals |
| `--primary` | `oklch(0.58 0.13 165)` | `oklch(0.72 0.14 165)` | Emerald accent, primary CTA |
| `--primary-foreground` | `oklch(0.99 0.01 165)` | `oklch(0.17 0.03 165)` | Text on primary |
| `--secondary` | `oklch(0.96 0.006 260)` | `oklch(0.26 0.016 260)` | Secondary buttons, chips |
| `--muted` | `oklch(0.965 0.005 260)` | `oklch(0.24 0.014 260)` | Table zebra, wells |
| `--muted-foreground` | `oklch(0.53 0.02 260)` | `oklch(0.70 0.02 260)` | Labels, meta, captions |
| `--accent` | `oklch(0.95 0.02 165)` | `oklch(0.28 0.03 165)` | Hover fills, active nav |
| `--border` | `oklch(0.92 0.006 260)` | `oklch(1 0 0 / 10%)` | Hairlines |
| `--input` | `oklch(0.92 0.006 260)` | `oklch(1 0 0 / 14%)` | Field borders |
| `--ring` | `oklch(0.58 0.13 165)` | `oklch(0.72 0.14 165)` | Focus ring |

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `--income` | `oklch(0.60 0.14 160)` | `oklch(0.74 0.15 160)` | Money in |
| `--expense` | `oklch(0.58 0.19 22)` | `oklch(0.70 0.18 22)` | Money out |
| `--warning` | `oklch(0.72 0.15 78)` | `oklch(0.80 0.15 78)` | Budget 80–99% used |
| `--destructive` | `oklch(0.58 0.22 27)` | `oklch(0.70 0.19 22)` | Over budget, delete |
| `--info` | `oklch(0.60 0.12 245)` | `oklch(0.72 0.12 245)` | Neutral notice |

Category palette: `--cat-1` housing `oklch(0.62 0.12 250)` · `--cat-2` food `oklch(0.68 0.14 65)` · `--cat-3` transport `oklch(0.64 0.12 200)` · `--cat-4` leisure `oklch(0.62 0.16 320)` · `--cat-5` health `oklch(0.66 0.13 155)` · `--cat-6` other `oklch(0.60 0.02 260)`.

```
--gradient-brand:  linear-gradient(135deg, var(--primary), oklch(0.70 0.12 190));
--gradient-surface: linear-gradient(180deg, color-mix(in oklab, var(--card) 100%, transparent), color-mix(in oklab, var(--muted) 60%, transparent));
--glow-primary: 0 0 0 1px color-mix(in oklab, var(--primary) 24%, transparent), 0 8px 32px -8px color-mix(in oklab, var(--primary) 40%, transparent);
```

## 9.3 Typography

Display/headings: `General Sans` (fallback `Inter Tight`, system-ui). Body/UI: `Inter`. Numerals: `font-variant-numeric: tabular-nums` mandatory for amounts/dates/table cells.

| Token | Size/line-height | Weight | Tracking | Use |
|---|---|---|---|---|
| `--text-display` | 40/44 | 600 | -0.03em | Balance hero |
| `--text-h1` | 30/36 | 600 | -0.02em | Page title |
| `--text-h2` | 22/28 | 600 | -0.015em | Section title |
| `--text-h3` | 17/24 | 600 | -0.01em | Card title |
| `--text-body` | 15/22 | 400 | 0 | Default |
| `--text-sm` | 13.5/20 | 400 | 0 | Table cells, meta |
| `--text-caption` | 12/16 | 500 | 0.01em | Labels, timestamps |
| `--text-overline` | 11/14 | 600 | 0.08em, uppercase | Group headers |
| `--text-mono-amount` | 15/20 | 500 tabular | -0.01em | Amount column |

Rules: one `h1` per page · max 3 type sizes per card · amounts never below 13px.

## 9.4 Spacing, Radius, Shadows

Spacing (4px base): `1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 20 · `6` 24 · `8` 32 · `10` 40 · `12` 48 · `16` 64. Card padding 24/16. Section gap 32. Page gutter 32/16. Grid gap 20.

Radius: base `0.75rem` → `sm` 8 · `md` 10 · `lg` 12 · `xl` 16 · `2xl` 20 (cards) · `full` pill.

```
--shadow-xs:      0 1px 2px oklch(0.2 0.02 260 / 0.05);
--shadow-sm:      0 1px 3px oklch(0.2 0.02 260 / 0.07), 0 1px 2px oklch(0.2 0.02 260 / 0.04);
--shadow-card:    0 2px 4px oklch(0.2 0.02 260 / 0.04), 0 12px 24px -12px oklch(0.2 0.02 260 / 0.10);
--shadow-popover: 0 8px 16px -6px oklch(0.2 0.02 260 / 0.12), 0 24px 48px -16px oklch(0.2 0.02 260 / 0.18);
--shadow-modal:   0 32px 64px -24px oklch(0.2 0.02 260 / 0.30);
```
Dark mode: shadows soften, paired with `inset 0 1px 0 oklch(1 0 0 / 6%)`.

## 9.5 Motion

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Enter, hover |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Layout shifts |
| `--dur-fast` | 120ms | Hover, focus, color |
| `--dur-base` | 200ms | Dropdowns, toasts, tabs |
| `--dur-slow` | 320ms | Modal, drawer, page transition |

Modal = fade + scale 0.98→1 · toast = slide 8px + fade · list rows = 20ms stagger, max 8 · charts animate once on mount. Respect `prefers-reduced-motion`.

## 9.6 Component Specifications

Single source of truth per component in `src/components/ui/*`.

**Button:** variants `primary/secondary/outline/ghost/destructive/link`; sizes `sm 32h/md 38h/lg 44h/icon`; radius `md`; hover −4% lightness, active scale 0.98, focus ring 2px offset, disabled 45% opacity, loading spinner with locked width.

**Card:** `--card` surface, radius `2xl`, shadow `--shadow-card`, 1px border; variants `default/stat/interactive/gradient`.

**Input:** height 40, radius `md`, 1px `--input` border; floating/top label; leading icon or currency prefix; focus/error/disabled states; amount inputs right-aligned tabular with masked currency prefix.

**Select:** trigger matches Input; menu on `--popover`, radius `lg`, shadow `--shadow-popover`; item height 34; grouping and search for >8 options.

**Modal:** overlay blur, panel max-width 480/640, radius `2xl`, shadow `--shadow-modal`; mobile ≤640px becomes bottom sheet; focus trapped, Esc closes.

**Table:** sticky overline header, row height 52, hairline dividers, right-aligned tabular amounts colored by income/expense; sortable/resizable columns; sticky footer totals; mobile collapses to stacked rows.

**Navbar:** height 64, sticky, blurred background, breadcrumb/search/date-range/theme toggle/notifications/avatar; mobile hamburger.

**Sidebar:** width 256/72, active item accent fill + 3px indicator; mobile off-canvas drawer.

**Toast:** bottom-right/top-mobile, max 3 stacked, 4s auto-dismiss (errors persist); 3px status bar by variant.

**Empty State:** centered, 56px icon, h3 headline, supporting line, one primary action.

**Loading State:** skeletons (never spinners) for content; spinners only inside buttons/inline refetches; 2px top progress bar on route transitions.

**Error State:** inline/section/page variants; never expose stack traces; always offer a recovery action.

## 9.7 Layout & Responsiveness

Breakpoints: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536. Max content width 1440.
≥1280: sidebar + 4 stat cards → trend chart (8 col) + donut (4 col) → table (12 col). 1024–1279: icon sidebar, 2×2 stats. 768–1023: drawer sidebar, stacked chart/donut. <768: single column, bottom tab bar, floating "Add expense" action, bottom-sheet modals, stacked table rows. Touch targets ≥44px.

## 9.8 Theming

Light/dark both first-class, tokens swapped under `.dark`, system preference default with persisted override. Accessibility: ≥4.5:1 body text contrast, ≥3:1 large text/borders; income/expense never color-only (always `+`/`−` and icon); full keyboard nav; ARIA labels on icon-only controls.

## 9.9 Restrictions (Enforced — Binding)

- No inline styles — tokens only.
- No hardcoded business data — props/data layer only.
- No duplicated UI components — one canonical implementation + variants.
- No hardcoded spacing/radius/shadow — scale tokens only.
- No new fonts/accent colors without first extending the token set.

---

# 10. System Architecture & Repository Structure

## 10.1 Architecture Overview

Backend: Controller → Service → Repository, DTOs at the boundary, Entities confined to persistence, Mappers between them. Frontend: component-based React SPA, all backend access via `services/*`. Data flow: `API → Application State → Reusable Components → Pages`.

## 10.2 Approved Repository Structure (Binding — Updated for Deployment)

New items introduced by this revision are marked **NEW**.

```
spendora/
│
├── README.md
├── .gitignore
├── docker-compose.yml                          NEW — local backend + Postgres
├── render.yaml                                 NEW — Render service definition
│
├── docs/
│   ├── PRODUCT_ROADMAP.md
│   └── SRS.md
│
├── backend/
│   ├── pom.xml
│   ├── Dockerfile                              (multi-stage: build → slim runtime)
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── README.md
│   │
│   └── src/
│       ├── main/
│       │   ├── java/com/spendora/backend/
│       │   │   ├── SpendoraApplication.java
│       │   │   ├── config/
│       │   │   │   └── OpenApiConfig.java
│       │   │   ├── controller/
│       │   │   │   ├── ExpenseController.java
│       │   │   │   └── BudgetController.java              (V3)
│       │   │   ├── dto/
│       │   │   │   ├── request/  (Create/UpdateExpenseRequest, Create/UpdateBudgetRequest)
│       │   │   │   └── response/ (ExpenseResponse, PagedResponse, AnalyticsResponse, BudgetResponse)
│       │   │   ├── entity/
│       │   │   │   ├── Expense.java
│       │   │   │   └── Budget.java                          (V3)
│       │   │   ├── enums/
│       │   │   │   └── ExpenseCategory.java
│       │   │   ├── exception/
│       │   │   │   ├── GlobalExceptionHandler.java
│       │   │   │   ├── ResourceNotFoundException.java
│       │   │   │   └── ErrorResponse.java
│       │   │   ├── mapper/
│       │   │   │   ├── ExpenseMapper.java
│       │   │   │   └── BudgetMapper.java                    (V3)
│       │   │   ├── repository/
│       │   │   │   ├── ExpenseRepository.java
│       │   │   │   └── BudgetRepository.java                (V3)
│       │   │   └── service/
│       │   │       ├── ExpenseService.java
│       │   │       ├── AnalyticsService.java                (V3)
│       │   │       └── BudgetService.java                   (V3)
│       │   └── resources/
│       │       ├── application.properties                  (default/local profile)
│       │       └── application-prod.properties              NEW — Supabase-driven, env-var based
│       │
│       └── test/java/com/spendora/backend/
│           ├── controller/  ├── service/  └── repository/
│
├── frontend/
│   ├── package.json / package-lock.json
│   ├── vite.config.js
│   ├── vercel.json                             NEW — Vercel build/route config
│   ├── index.html
│   ├── Dockerfile                              (used for local parity only; Vercel builds natively)
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── README.md
│   │
│   └── src/
│       ├── assets/images/
│       ├── components/
│       │   ├── common/    (Button, Card, Modal, Loader, ErrorMessage)
│       │   ├── expense/   (ExpenseForm, ExpenseTable, ExpenseCard)
│       │   ├── analytics/ (SpendTrendChart, CategoryBreakdown)     (V3)
│       │   └── budget/    (BudgetForm, BudgetProgress)             (V3)
│       ├── pages/  (Dashboard, Expenses, Analytics(V3), Budgets(V3), NotFound)
│       ├── layouts/MainLayout.jsx
│       ├── services/ (api.js, expenseService.js, analyticsService.js(V3), budgetService.js(V3))
│       ├── hooks/ (useExpenses.js, useBudgets.js(V3))
│       ├── context/AppContext.jsx
│       ├── utils/ (formatCurrency.js, formatDate.js)
│       ├── constants/expenseConstants.js
│       ├── styles/ (index.css, variables.css, components.css)
│       ├── App.jsx
│       └── main.jsx
│
├── database/
│   ├── README.md
│   └── migrations/
│       ├── V1__initial_schema.sql
│       ├── V2__search_filter_indexes.sql                      (V2)
│       └── V3__budget_schema.sql                               (V3)
│
├── postman/
│   ├── Spendora.postman_collection.json
│   └── Spendora.postman_environment.json         (local + Render URL variables)
│
└── .github/
    └── workflows/
        ├── ci.yml                                (build + test, all branches/PRs)
        └── deploy.yml                             NEW — triggers Render + Vercel deploy on main
```

---

# 11. Deployment & Infrastructure Architecture

*(New section — defines exactly how Spendora runs in each environment.)*

## 11.1 Database: Supabase

- Spendora's PostgreSQL database is hosted on **Supabase** in production. Local development continues to use a plain PostgreSQL container via Docker Compose, kept schema-identical via the same migration files.
- Supabase exposes two connection modes:
  - **Direct connection** (port `5432`) — used for schema migrations and any DDL (e.g. the V2 index migration, the V3 `Budget` table migration).
  - **Pooled connection via PgBouncer** (port `6543`, transaction mode) — used by the running Spring Boot application for normal query traffic, since Render's backend may open many short-lived connections.
- The backend's `application-prod.properties` (or equivalent Spring profile) must read the datasource URL, username, and password entirely from environment variables (see §13) — never hardcoded.
- SSL is required for all connections to Supabase (`sslmode=require`).
- Connection pool size on the application side (HikariCP) should be kept modest (e.g. 5–10) since it sits in front of PgBouncer's own pooling — oversized app-side pools against a pooled connection are a common misconfiguration.
- Migrations are applied against the **direct** connection as a distinct step (either manually, via a CI job, or via Flyway/Liquibase pointed at the direct URL) — not through the pooled connection.

## 11.2 Local Development: Docker Compose

`docker-compose.yml` (root level) shall define:

- A `postgres` service (official `postgres` image) — mirrors Supabase's Postgres version, used only for local dev.
- A `backend` service — builds from `backend/Dockerfile`, depends on `postgres`, reads local env vars from `backend/.env`.
- (Optional) A `frontend` service for full local parity, though the Vite dev server is normally run directly for hot-reload during active development.

This gives a working local stack without touching Supabase, so schema/migration work can be developed and tested safely before being applied to the production Supabase instance.

## 11.3 Backend: Docker → Render

- `backend/Dockerfile` shall be a **multi-stage build**: a build stage (Maven + JDK) producing the Spring Boot JAR, and a slim runtime stage (JRE-only base image) that copies in the built JAR — keeping the deployed image small.
- **Render** is configured as a Web Service using this Dockerfile directly (Render supports "Deploy from Dockerfile").
- `render.yaml` (Render's Blueprint spec) should declare the service, its Docker context (`backend/`), health check path, and the list of required environment variables (names only — actual values are set in Render's dashboard, never in the file).
- Render auto-deploys on push to the connected branch (typically `main`, gated by CI passing first — see §14.2).
- The backend must expose a health check endpoint (e.g. `/actuator/health` via Spring Boot Actuator) that Render uses to confirm the container is live before routing traffic to it.

## 11.4 Frontend: Vercel

- Vercel builds directly from the `frontend/` directory using the Vite framework preset — no Docker involved in the actual Vercel deployment (the `frontend/Dockerfile` exists only for local full-stack parity via Docker Compose, if used).
- `vercel.json` shall define the build command, output directory (`dist`), and any client-side routing rewrites needed for the React SPA (so deep links like `/expenses` don't 404 on refresh).
- The frontend's API base URL is injected via a Vercel environment variable (e.g. `VITE_API_BASE_URL`) pointing at the Render-hosted backend's public URL — never hardcoded into the frontend bundle.
- Vercel automatically provides preview deployments per pull request, which is useful for reviewing UI changes before merge (complements the Git workflow in §14.1).

## 11.5 Environment-per-Layer Summary

| Environment | Database | Backend | Frontend |
|---|---|---|---|
| Local | Dockerized Postgres | Docker (or local JVM) via Compose | Vite dev server |
| Production | Supabase | Render (Docker) | Vercel |

## 11.6 Deployment Flow (End-to-End)

```
Developer / Agent pushes code
        ↓
GitHub Actions CI: build → test → quality checks
        ↓
   (on success, on main branch)
        ↓
   ┌─────────────────────┬─────────────────────┐
   ↓                                            ↓
Render: builds backend/Dockerfile      Vercel: builds frontend/
  → deploys container                    → deploys static build
  → runs health check                    → invalidates CDN cache
  → routes traffic on pass               → live at production URL
```

Database migrations against Supabase are treated as a **separate, explicit step** (not silently run on every deploy) to avoid accidental schema changes from a routine code deploy — this is intentional and should not be "optimized away" by an agent without approval (Agents.md rule 15).

---

# 12. Database Design & Migration Strategy

## 12.1 V1 Entities

**Expense** — id (UUID PK), title, amount, category (enum), expense_date, description, created_at, updated_at.

## 12.2 V2 Additions

Indexes only: `idx_expense_category`, `idx_expense_date`, `idx_expense_amount`, `idx_expense_title`. No new tables.

## 12.3 V3 Additions

**Budget** — id (UUID PK), scope/name, category (enum, nullable), period_start, period_end, limit_amount, created_at, updated_at. Analytics are computed on read (aggregation queries over `Expense`), not stored.

## 12.4 Migration Files

Versioned, additive SQL in `database/migrations/`:

- `V1__initial_schema.sql`
- `V2__search_filter_indexes.sql`
- `V3__budget_schema.sql`

Each migration must be idempotent-safe to re-run in a fresh environment (e.g. local Docker Postgres) and must be applied to Supabase via the **direct connection** (§11.1) as a controlled step, not bundled silently into the app's deploy.

## 12.5 Supabase-Specific Notes

- Enable `pgcrypto` or rely on Postgres 13+'s built-in `gen_random_uuid()` for UUID defaults, matching Supabase's default Postgres version.
- Row Level Security (RLS) is **not required** at V1–V3 (single-user, no auth), but the schema should avoid patterns that would make enabling RLS at V5 (multi-user) painful later — e.g. avoid assuming a single global row set with no ownership column path.

---

# 13. Configuration & Environment Variables

*(New section — consolidates every config value an agent needs to wire up, without hardcoding any actual secret values here.)*

## 13.1 Backend (`backend/.env` locally · Render dashboard in production)

| Variable | Purpose | Local | Production |
|---|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `local` | `prod` |
| `DB_URL` | JDBC connection string | Local Docker Postgres | Supabase pooled connection (port 6543) |
| `DB_URL_DIRECT` | Direct connection for migrations | Local Docker Postgres | Supabase direct connection (port 5432) |
| `DB_USERNAME` | Database user | local default | Supabase-provided |
| `DB_PASSWORD` | Database password | local default | Supabase-provided (secret) |
| `SERVER_PORT` | Backend listen port | `8080` | Render-assigned (`PORT` env, Render sets this) |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origin(s) | `http://localhost:5173` | Vercel production URL |

## 13.2 Frontend (`frontend/.env` locally · Vercel dashboard in production)

| Variable | Purpose | Local | Production |
|---|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080` | Render backend public URL |

## 13.3 Rules (Binding)

- `.env` files are **never** committed (Agents.md rule 5); `.env.example` files with variable **names only** (no real values) are committed.
- No secret (DB password, connection string) is ever requested from, or exposed to, the person or any log output (Agents.md rules 3–4).
- Production values are set directly in Render's and Vercel's environment variable dashboards, not passed through the repository.

---

# 14. Development, Git & CI/CD Standards

## 14.1 Git

Feature branches · meaningful commits · pull requests · code review · protected `main`/release branches · release tags (`v1.0.0`, `v2.0.0`, `v3.0.0`).

## 14.2 CI/CD Pipeline (Updated)

```
Push / Pull Request
       ↓
Build (backend Maven build + frontend Vite build)
       ↓
Tests (unit + integration)
       ↓
Quality Checks
       ↓
Security Checks
       ↓
Package (Docker image build for backend)
       ↓
   [only on main, after all checks pass]
       ↓
Deploy → Render (backend) + Vercel (frontend), in parallel
       ↓
Production Verification (health check + smoke test against live URLs)
```

`ci.yml` runs build/test/quality/security on every push and PR. `deploy.yml` (or an extension of `ci.yml`) is restricted to `main` and triggers/confirms the Render and Vercel deploys, then runs a post-deploy smoke test against the production health check endpoint.

---

# 15. Agent Operating Rules (Agents.md — Binding, Reproduced in Full)

> You are working on Spendora *(originally written as "PennyPilot")*.

1. Do not change approved architecture.
2. Follow repository structure.
3. Never request or expose secrets.
4. Use environment variables.
5. Never commit `.env`.
6. Follow API specification.
7. Follow UI design system.
8. Do not use inline styles.
9. Do not hardcode business data.
10. Write tests for new functionality.
11. Do not modify unrelated files.
12. Do not push directly to main.
13. Run required checks before completion.
14. Update documentation when architecture changes.
15. Ask for approval when requirements are ambiguous.

**Applied to this revision specifically:** introducing Supabase, Docker, Render, and Vercel is an approved architecture change reflected in this SRS itself (§11). Any *further* deviation (e.g. switching hosting providers, changing the database vendor) still requires approval under rule 1/rule 15 before an agent acts on it.

---

# 16. Migration Note: PennyPilot → Spendora

| Item | Old (PennyPilot) | New (Spendora) |
|---|---|---|
| Product/display name | PennyPilot | Spendora |
| Root repository folder | `pennypilot/` | `spendora/` |
| Java base package | `com.pennypilot.backend` | `com.spendora.backend` |
| Spring Boot main class | `PennyPilotApplication.java` | `SpendoraApplication.java` |
| Postman files | `PennyPilot.postman_*.json` | `Spendora.postman_*.json` |
| UI copy referencing the product | "PennyPilot" | "Spendora" |
| Release outcome labels | PennyPilot Vx — ... | Spendora Vx — ... |

Naming/branding change only — no functional, architectural, or data-model implication.

---

# 17. Production Release Criteria

A version cannot be marked complete until:

- Requirements are implemented
- Database changes are verified **on Supabase** (not just locally)
- Backend APIs work correctly against the **Render-deployed** container
- Frontend works correctly against the **Vercel-deployed** build, pointed at the live Render backend
- End-to-end integration is verified in the deployed environment, not just locally
- Automated tests pass in CI
- API testing (Postman) passes against the deployed Render URL
- Security checks pass (no exposed secrets, validated inputs)
- Documentation is updated (this SRS, README, API docs)
- Git history is reviewed (PR merged, tagged)
- CI pipeline passes
- Render and Vercel deployments both succeed
- Production smoke tests pass (health check + a real API call end-to-end)

Only then: **VERSION = RELEASED**

## 17.1 Real Product Usage (Post-Release)

```
Live Product (Supabase + Render + Vercel) → Real Usage → Feedback → New Requirements → Next Version
```

---

# 18. Assumptions, Dependencies & Constraints

## 18.1 Assumptions

- Single user, no authentication for V1–V3 (auth arrives at V5)
- Currency is implicitly INR (₹)
- One production environment per version (no multi-region requirement)
- Render's and Vercel's free/hobby tiers are acceptable for this stage of the project (cold starts possible)

## 18.2 Dependencies

- Supabase account/project availability
- Render account with a connected Git repository
- Vercel account with a connected Git repository
- Docker installed locally for backend containerization and Compose-based local dev
- Node/npm toolchain (frontend), Java/Maven toolchain (backend)
- GitHub Actions for CI

## 18.3 Constraints

- Agents.md rules (§15) are binding without exception
- Design System restrictions (§9.9) are binding without exception
- Repository structure (§10.2) may not be altered without approval
- Database DDL must go through the direct Supabase connection, never the pooled one (§11.1)

---

# 19. Traceability Matrix

| Roadmap Version | SRS Section(s) | Release Outcome |
|---|---|---|
| V1 — Core Expense Tracker | §3 | Spendora V1 — Live Expense Tracker (Supabase + Render + Vercel) |
| V2 — Better Expense Management | §4 | Spendora V2 — Efficient Expense Management |
| V3 — Analytics & Budget | §5 | Spendora V3 — Personal Spending Analytics |
| Design System | §9 | Governs all frontend work |
| Deployment Architecture | §11 | Governs Supabase/Docker/Render/Vercel setup |
| Agents.md | §15 | Governs all development activity |
| Repository Structure | §10.2 | Governs code organization |
| V4–V14 | Appendix A | Deferred — out of scope |

---

# 20. Glossary

| Term | Definition |
|---|---|
| Expense | A single recorded outflow of money |
| Budget | A user-defined spending limit over a period, optionally category-scoped |
| Utilization | Percentage of a budget's limit that has been spent |
| Token (design) | A named, reusable design value referenced instead of a raw value |
| DTO | Object transferring data across the API boundary, decoupled from the persistence entity |
| PgBouncer | Connection pooler in front of Supabase's Postgres |
| Direct connection | Unpooled Supabase Postgres connection, used for DDL/migrations |
| Blueprint (`render.yaml`) | Render's declarative service definition file |

---

# 21. Appendix A — Full Product Roadmap (V1–V14) for Context

## Product Vision

Spendora is a modern personal finance management platform designed to help users track expenses, manage income, monitor budgets, understand spending patterns, and make better financial decisions. The product evolves gradually from a simple expense tracker into a complete, secure, scalable, AI-powered personal finance platform, through clearly defined versions, each a complete, usable, tested, deployed product.

## Version Summary Table

| Version | Product Stage | Primary Capability |
|---|---|---|
| V1 | Core Expense Tracker | Expense management |
| V2 | Better Expense Management | Search, filter, sort, pagination |
| V3 | Analytics & Budget | Reports and budgeting |
| V4 | Personal Finance | Income, accounts, payment methods |
| V5 | Secure Multi-User | Authentication and RBAC |
| V6 | Professional Web | Advanced web UX |
| V7 | Web + Mobile | Mobile application |
| V8 | Automated Finance | Recurring transactions, files, notifications |
| V9 | High Performance | Caching, queues, async processing, load testing |
| V10 | Security Hardened | OWASP, security testing, VAPT |
| V11 | AI-Powered | AI insights and intelligent entry |
| V12 | RAG | Vector search and knowledge assistant |
| V13 | Agentic | AI agents and tool calling |
| V14 | Advanced Platform | Mature production ecosystem |

*(Full per-version detail preserved from the original roadmap — unchanged by this deployment-focused revision. V4: income/accounts/payment methods. V5: auth, RBAC, data isolation per user. V6: design system, responsive, theming, accessibility. V7: Flutter/React Native/Native Android, backend platform-independent. V8: recurring transactions, file storage, notifications, background jobs. V9: Redis caching, async processing, load/stress testing, observability. V10: OWASP Top 10/API Security, SAST/DAST, VAPT cycle. V11: smart categorization, NL expense entry, spending insights, AI assistant. V12: RAG pipeline — documents → chunking → embeddings → vector DB → retrieval → LLM → answer. V13: AI agent with tool calling across Expense/Budget/Report/Account APIs, guardrails, human approval, audit logging. V14: mature production platform combining all prior capabilities.)*

---

# 22. Appendix B — Cross-Version Engineering Standards, Guiding Principles & Final Vision

## B.1 Cross-Version Engineering Standards

**Database:** proper schema design, constraints, relationships, indexes, migration strategy, data integrity, production-safe changes.
**Backend:** clear architecture, REST/API standards, validation, error handling, logging, configuration management, automated tests, security.
**Frontend/Mobile:** component-based, reusable UI, responsive, dynamic data, API integration, loading/error states, accessibility, performance.
**Git:** feature branches, meaningful commits, PRs, code review, protected branches, release tags.
**CI/CD:** Build → Tests → Quality Checks → Security Checks → Package → Deploy → Production Verification (now concretely: Docker/Render for backend, Vercel for frontend — §11).

## B.2 Guiding Principles

1. Build a complete product, not isolated code.
2. Every version must be deployable and usable.
3. Database, backend, frontend/mobile and infrastructure evolve together.
4. Do not add technology without a product or engineering reason.
5. Security and performance are engineering requirements, not afterthoughts.
6. Use reusable architecture and avoid unnecessary hardcoding.
7. Automate repetitive work while keeping engineering decisions controlled and reviewable.
8. Every feature must be tested before release.
9. Every release must be traceable through Git and CI/CD.
10. A product is not finished when the code is written. It is finished when the software is working in production.

## B.3 Final Goal

```
Understand the Problem → Define Requirements → Design the Product →
Design the Architecture → Design the Database → Design the APIs →
Design the User Experience → Implement the System → Test It → Secure It →
Optimize It → Deploy It → Monitor It → Learn From Real Usage → Evolve the Product
```

> **Build. Test. Review. Deploy. Use. Improve. Repeat.**

---

**End of Document — Spendora SRS (Final, V1–V3 Implementation Scope, Deployment-Ready for Supabase · Docker · Render · Vercel, Agent-Executable)**
