# Product Requirements Document
## AI-Powered Multi-Tenant Helpdesk Platform

**Author:** [Your Name]
**Status:** Draft
**Last updated:** [Date]

---

## 1. Overview

A multi-tenant **internal IT/service-desk platform** (Jira Service
Management / ServiceNow-style, not Zendesk/Intercom-style) serving
multiple independent companies ("organizations") from one deployment.
Each organization's own employees raise tickets against their own
internal teams, e.g. Sales or HR raising a ticket to the Tech/IT
department, with role-based access, ITIL-aligned ticket classification
(type, department, category, subcategory), and AI-assisted triage,
reply suggestions, and thread summarization within each org.

This is deliberately **B2B only**, not B2B2C. An earlier draft of this
PRD considered supporting external customer-facing support too (e.g.
for a small e-commerce company without a dedicated support team), but
that segment is already dominated by cheap, deeply-integrated
incumbents (Gorgias for Shopify/e-commerce specifically, Zendesk
generally) whose core value is commerce-platform integration this
project doesn't build. Internal ITSM for small-to-mid companies is the
comparatively less saturated, more differentiated angle, and every
architectural pattern this project set out to demonstrate
(multi-tenancy, RBAC, async AI, event-driven notifications) survives
fully intact with this narrower scope. Nothing was lost by cutting the
external-facing surface, only infra-heavy stretch work (custom domains,
external branding) that existed solely to serve it.

Tenancy is resolved two ways depending on context: explicitly via
subdomain for anyone already on an org-specific URL, and implicitly via
verified email domain matching for anyone landing on a generic login
page. Every person (Owner, Admin, Agent, Requester, or Vendor) flows
through the same Entra ID identity layer and the same invite-or-domain-
match trust model; there is no separate public self-service flow, since
everyone using this product has a real relationship to the org (an
employee, or an invited contractor).

**Why this project:** demonstrates multi-tenancy, RBAC, real-time
systems, applied AI, and ITIL-aligned service-desk design in one
cohesive domain. Specifically:

- **Multi-tenancy**: org-scoped data isolation enforced at the API layer
  (not just hidden in the UI), two independent tenant-resolution paths
  (URL and verified domain), and a unified provisioning model (invite
  or domain-match) applied consistently across every role.
- **RBAC**: five-role, three-status model (Owner/Admin/Agent/Requester/
  Vendor, plus Pending Approval and Deactivated statuses) enforced
  server-side.
- **Service-desk taxonomy**: ITIL-aligned `TicketType` plus an org-
  configurable Department → Category → Subcategory tree, modeled as
  real relational tables rather than a generic reference-data table,
  a deliberate trade-off explained in the architecture doc.
- **Applied AI**: ticket triage across all four classification
  dimensions, reply suggestions, and summarization, run asynchronously
  so AI latency never blocks the request path.

It's deliberately scoped beyond a CRUD demo, built to double as
hands-on practice for Azure/AI-200 concepts (containerized deployment,
managed identity, vector search, event-driven AI jobs).

---

## 2. Goals

- Ship a live, deployed, portfolio-ready application, not just
  local-only code
- Demonstrate real architectural judgment: multi-tenancy with two
  independent tenant-resolution paths (URL, verified domain), RBAC
  enforced at the API layer, async/event-driven design, security
  (managed identity auth, no stored credentials)
- Demonstrate a realistic ITSM ticket taxonomy (type, department,
  category, subcategory) that models how real service desks actually
  classify and route work, not a single flat category tag
- Integrate AI meaningfully (triage across the full taxonomy, reply
  suggestions, summarization), not as a bolted-on gimmick
- Produce a codebase and README that reads as "this person could merge
  into our existing engineering flow"

**Non-goals (explicitly out of scope for this project):**
- Billing/payments
- External customer-facing support portal, per-tenant branding, and
  custom domain hosting, cut from scope during the B2B pivot; see
  Section 7 for the reasoning
- Mobile native apps
- SLA/escalation automation beyond a basic sentiment flag
- Supporting non-English languages

---

## 3. User Roles

| Role | Who | How they're provisioned |
|---|---|---|
| **Owner** | First person at a company to sign up; full control | Bootstrap (no invite, no domain match) or promoted by another Owner |
| **Admin** | Manages team, settings, domains, taxonomy; sees all tickets | Invited by an Owner/Admin, or domain-matched + approved |
| **Agent** | Handles assigned/team tickets | Invited by an Owner/Admin, or domain-matched + approved |
| **Requester** | Any other internal employee (Sales, HR, Finance, etc.) raising tickets to a service team | Invited by an Owner/Admin, or domain-matched + approved (same mechanism as staff, since requesters are colleagues with a company email, not external customers) |
| **Vendor** | External contractor with limited access to specific tickets they're helping resolve | Invite-only, always, never domain-matched, since a vendor's email domain has no relationship to the org. Included for future flexibility; low-priority/stretch scope for this build |
| *(separate entity, not a tenant role)* **PlatformUser** | The operator's own internal staff needing cross-org access (support/ops/platform admin) | Provisioned out of band, authenticated via a separate locked-down Entra ID app registration; access to any specific org's data requires an explicit, time-boxed, audited `PlatformAccessSession`, never a standing permission |
| *(internal status)* **Pending Approval** | Domain-matched user awaiting an Admin/Owner to assign a real role | Automatic; not a selectable role, a holding state |
| *(internal status)* **Deactivated** | Any role, soft-removed from the org | Set via `DELETE /users/{userId}` (Owner only); preserves ticket/comment history, revokes access |

Full permission matrix (ticket visibility, org settings, user management)
is defined separately in the architecture doc; this PRD tracks roles at
the feature level only.

---

## 4. MVP Scope: Feature List

Grouped by priority. **P0 = must ship for this to be a credible demo. P1
= strongly desired, build if time allows. P2 = stretch, "nice to have
before final polish."**

### P0 (Core platform, non-negotiable)
- [ ] Org sign-up / bootstrap flow (first user becomes Owner)
- [ ] Invite flow (email + role, invite-gated join), applying uniformly to Owner/Admin/Agent/Requester/Vendor
- [ ] Domain-matching flow (verified domain, pending-approval to admin approval), applying to Owner/Admin/Agent/Requester; not used for Vendor
- [ ] Authentication via Microsoft Entra ID External ID (no stored passwords)
- [ ] RBAC enforcement at the API layer (not just hidden UI): requester sees own tickets only, agent sees assigned/team, admin/owner sees all. Org context is always derived server-side from the authenticated token, never accepted as a client-supplied parameter, so cross-org data leakage is architecturally prevented, not just permission-checked
- [ ] Ticket CRUD: create, view, update status/priority/assignment
- [ ] Ticket taxonomy: `TicketType` (ITIL-aligned) plus org-configurable Department/Category/Subcategory with full CRUD. This is core to the redesign's premise (proper routing across departments), not a stretch feature
- [ ] Comments on tickets, including internal-notes-only-visible-to-staff
- [ ] Responsive frontend covering: login, ticket list, ticket detail, create ticket, basic admin user list, taxonomy management screen

### P1 (Differentiators)
- [ ] Real-time ticket/comment updates (WebSockets)
- [ ] AI ticket classification on creation (type, department, category, subcategory, priority, sentiment: the full taxonomy, not just a flat category tag)
- [ ] AI "suggest a reply" for agents
- [ ] AI thread summarization for long tickets
- [ ] Admin analytics dashboard (tickets by status/department, avg resolution time, agent load)
- [ ] Email notifications (Azure Communication Services Email, triggered by a dedicated Function subscribed to Event Grid `ticket.*` events; suppressed when the recipient is already connected via WebSocket to avoid double-notifying; covers status changes, agent replies, ticket assignment, and invites; no user-configurable preferences in v1)

### P2 (Stretch)
- [ ] Semantic "similar past tickets" search via pgvector
- [ ] Domain verification self-serve UI (DNS TXT check) with clear pending/verified states
- [ ] Vendor role: invite flow, restricted ticket visibility (only tickets they're explicitly attached to). Included in the role model now for future flexibility, but low-priority to actually build
- [ ] Platform-level super user (PlatformUser + PlatformAccessSession): schema and API design fully specified in the architecture doc. Full implementation (admin console, reason-capture UI, org-facing access-transparency dashboard) is stretch; the design itself, not a polished UI around it, is what matters for this project's scope
- [ ] Cosmos DB vector-search side-by-side implementation (exam practice, not core to the app)
- [ ] Dark mode
- [ ] Playwright end-to-end test suite

---

## 5. Key User Flows

**Owner bootstrap:** visits generic login → signs in via Entra ID (new
account) → no invite, no domain match → new org created, becomes Owner →
lands on empty dashboard, prompted to invite teammates, configure org
settings, and set up an initial department/category taxonomy.

**Invited user (any role: Owner/Admin/Agent/Requester/Vendor):**
receives invite email → clicks link → signs in via Entra ID →
`/auth/session` matches pending invite → joins with assigned role
immediately → Requester/Agent/Admin land on a ticket queue scoped to
their role; Vendor lands on a restricted view of only the tickets
they're attached to.

**Domain-matched user (Owner/Admin/Agent/Requester, not Vendor):**
signs in via Entra ID on generic login page (no invite) → email domain
matches a verified `OrganizationDomain` → created as `PENDING_APPROVAL`
→ sees a "waiting for approval" screen → an Admin approves and assigns
a role → user gains access on next session check.

**Requester submitting a ticket:** logs in (same login as everyone
else) → creates a ticket, optionally picking a department directly, or
leaving it for AI to suggest → AI classifies the ticket in the
background (type, department, category, subcategory, priority,
sentiment) → sees ticket status update in real time as an agent
responds.

**Agent handling a ticket:** opens assigned ticket → sees AI-suggested
classification across all four taxonomy dimensions (editable, a
manual edit writes a new `TicketClassification` row with
`source: MANUAL`) → reads AI thread summary if the thread is long →
uses "suggest reply" for a draft response → edits and sends → requester
sees the update live.

---

## 6. Success Criteria (definition of "done" for the portfolio goal)

- Deployed and publicly accessible with a working demo account for each role
- README includes architecture diagram, setup steps, and a 2-3 minute demo video
- RBAC and tenant isolation are demonstrably enforced, verified at the
  API layer (not just hidden in the UI), across at least two
  simultaneously-existing demo organizations:
  - A Requester cannot access another org's tickets, or another
    requester's tickets within their own org
  - A staff member from Org A cannot access Org B's tickets even with a
    valid, correctly-scoped token
  - The domain-matching approval flow is demonstrated end-to-end (a
    user lands as PENDING_APPROVAL, an Admin approves them, access is
    granted), not just the invite-based path, since both are P0
  - The ticket taxonomy is demonstrably org-specific: two demo orgs
    with different department/category sets, confirming neither leaks
    into the other
- At least the P0 list fully complete; P1 AI features functional even if not exhaustive
- Deployment pipeline exists (CI runs tests/lint on PR, deploy on merge to main)
- Can explain, in an interview, every major architectural decision and
  its trade-off (why Entra ID over custom auth, why domain-matching
  requires approval, why Service Bus over inline AI calls, why the B2B
  scope was chosen over B2B2C, why Department/Category/Subcategory are
  real tables rather than a generic reference-data table, etc.)

---

## 7. Decisions

- [x] **Scope: B2B internal service desk, not B2B2C external support.**
  Considered supporting external customer-facing support too (e.g. for
  small e-commerce companies without a dedicated support team), but
  that segment is already dominated by cheap, deeply-integrated
  incumbents (Gorgias for e-commerce specifically, Zendesk generally)
  whose value comes from commerce-platform integration this project
  doesn't build. A generic ticketing tool wouldn't actually compete for
  that customer. Internal ITSM is the less saturated, more
  differentiated angle, and every core architectural pattern
  (multi-tenancy, RBAC, async AI, event-driven notifications) survives
  fully intact with the narrower scope. This cut removed custom-domain
  hosting, external org branding, and the public customer self-service
  flow entirely (see the architecture doc's git history or prior
  versions of this PRD for the removed design, if kept under version
  control).
- [x] **Role model: Requester replaces Customer; Vendor added.**
  Requesters are internal employees from any department (not external
  customers), so they're provisioned through the same invite-or-domain-
  match flow as staff, not a separate public sign-up. Vendor is
  included in the role enum for future flexibility (external
  contractors needing limited ticket access is a realistic future need)
  but is explicitly low-priority/stretch scope for this build, and is
  always invite-only, never domain-matched, since a vendor's email
  domain has no relationship to the org.
- [x] **Platform-level super user: separate `PlatformUser` entity, not
  a `SUPER_ADMIN` role value.** Every tenant role is scoped to exactly
  one `organizationId`, which is the mechanism the entire tenant-
  isolation guarantee depends on. A role needing cross-org reach would
  either need a fake `organizationId` or scattered "skip the org
  filter for this role" checks across every endpoint, undermining
  structural isolation for the sake of one special case. Instead:
  `PlatformUser` has no `organizationId` at all, authenticates through
  a separate locked-down Entra ID app registration, and any access to
  a specific org's data requires an explicit `PlatformAccessSession`
  (stated reason, time-boxed, auditable, and visible to the org's own
  Owner) rather than a standing permission. Full implementation is
  P2/stretch; the design is fully specified now.
- [x] **Ticket taxonomy: real Department/Category/Subcategory tables,
  not a generic `RefData` reference table.** Considered a single
  self-referencing reference-data table (one CRUD implementation,
  trivially extensible to new types) against three real Prisma-backed
  entities. Chosen the real-tables approach because the hierarchy is
  fixed and known (always exactly Department → Category → Subcategory,
  matching ITIL/service-desk best practice of capping category depth at
  two levels). RefData's main advantage doesn't apply to a shape that
  doesn't grow, and real foreign keys let Postgres enforce "a Category's
  parent must be a Department" for free, instead of that becoming
  application-level validation maintained by hand.
- [x] **Domain-matched staff approval:** always require manual Admin/Owner
  approval for now. Auto-approval for verified domains is a future
  consideration once the product has real scale to justify the added
  automation and risk.
- [x] **Tenant routing:** subdomain per org
  (`acme.yourapp.com`), not path-based. Chosen for cleaner session/cookie
  isolation per tenant, a 1:1 mapping to the existing `organizationSubdomain`
  design, and because it reads as a more production-grade multi-tenant
  SaaS than a path parameter. `app.yourapp.com` is reserved as the
  generic login page for the domain-matching fallback flow.
  Requires wildcard DNS (`*.yourapp.com`) and a wildcard SSL cert; local
  dev uses `acme.localhost:3000`.
- [x] **AI provider:** Azure OpenAI, for ticket classification, reply
  suggestions, and thread summarization. Chosen over the direct OpenAI
  API for two reasons: it's closer to how enterprises actually deploy
  OpenAI's models at scale (through Azure's compliance/data-residency
  layer, which is the more common access path for large organizations
  despite the underlying model being identical either way), and it keeps
  every AI call inside Key Vault/Managed Identity's security boundary
  alongside the rest of the Azure stack, restoring full alignment with
  the AI-200 exam domains.
- [x] **Notifications:** Azure Communication Services Email, triggered by
  a dedicated Azure Function subscribed to widened `ticket.*` Event Grid
  events, separate from the summarization Function. Suppressed when the
  recipient is already connected via WebSocket to the relevant room, to
  avoid double-notifying someone actively watching. Chosen over
  SendGrid/Resend for consistency with the rest of the Azure-native
  stack (Managed Identity/Key Vault auth), at the cost of some setup
  simplicity SendGrid/Resend would have offered instead. No
  `NotificationPreference` (per-user opt-out) table in v1, fixed
  defaults per event type.
- [ ] Ticket SLA/escalation rules: explicitly out of MVP scope, but worth a one-line note on whether it's a documented "future work" item in the README
