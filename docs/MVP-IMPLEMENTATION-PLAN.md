# RUANG KITA MVP — Implementation Plan

## Status and safety boundary
This branch is `feat/ruang-silaturahmi-mvp`. The production Neon branch must remain untouched. No database migration is applied by this plan. UI prototype uses local demo data only and must label it as demo.

## Workstreams

### A. Product interface
- [x] Define hybrid 2D → 3D direction.
- [x] Define external meeting links now and integrated video later.
- [x] Define hybrid public/private room model.\n- [x] Add Karaoke Stage as a selectable scene concept for combined community rooms.\n- [x] Expand scene catalogue for school/parents, family, office/projects, neighborhood, worship, sports, hobbies, learning, UMKM, volunteers, travel, support groups and alumni.\n- [x] Define specialist-agent roles and human approval boundaries in the blueprint.
- [ ] Build responsive room directory and room scene prototype.
- [ ] Add keyboard navigation, reduced-motion handling, mobile layouts and empty/error/loading states.

### B. Auth and tenant isolation
- [ ] Confirm Neon Auth session API and stable user subject field.
- [ ] Implement server-only auth helpers.
- [ ] Map authenticated subject to profile without assumptions about identifier type.
- [ ] Implement server-side authorization for every room, table, community, invite, event and content operation.
- [ ] Add allow/deny tests for anonymous, unrelated tenant, member, moderator, admin and owner.
- [ ] Add invite expiry/revocation and token-hash generation/validation.

### C. Database migration
- [ ] Create a development branch from Neon; never point local/app code to production while testing.
- [ ] Review schema relationships for rooms, room_memberships, tables, room_invitations, sessions, scene_presets and expo booths.
- [ ] Confirm extension permissions and migration idempotency.
- [ ] Apply only to development branch using reviewed migration tooling.
- [ ] Test foreign keys, unique constraints, public/private filtering, cross-tenant deny cases and rollback/restore.
- [ ] Request explicit approval before any production migration.

### D. Core community features
- [ ] Create/edit community and room.
- [ ] Scene/table layout with saved coordinates and responsive rearrangement.
- [ ] Announcements, events, RSVP, content library and external meeting links.
- [ ] WhatsApp-ready invite copy and QR/share URL.
- [ ] Expo booths and cross-community public visiting rules.\n- [ ] Karaoke room flow: performer queue, moderator approval, audience reactions, and explicit demo-only labels until media is implemented.\n- [ ] Add context modules by scene: school calendar, community events, tasks, library, roster, catalog, volunteer coordination and itinerary.\n- [ ] Implement agent orchestrator with tool allowlists, minimum tenant-scoped context, audit logs, cost limits and human approval gates.\n- [ ] Add agent tests for cross-tenant denial, prompt injection from uploaded content, sensitive-data handling and no external side effects without approval.

### E. Release and hosting
- [ ] Choose free-tier hosting after checking limits and required environment variables.
- [ ] Keep all secrets in deployment secret manager; never commit .env files.
- [ ] Add CI: lint, typecheck, tests, build.
- [ ] Verify deployment URL, health route, access boundaries, logs and rollback.
- [ ] Publish privacy policy, terms, community rules, data retention and consent notice.

## Proposed initial routes
- `/` — product home and public room directory
- `/rooms/[slug]` — room scene and tables
- `/communities/[slug]` — community landing page
- `/agenda` — events and RSVP
- `/library` — documents, minutes, FAQ and media links
- `/invite/[token]` — invitation acceptance (token must not be logged)
- `/admin/rooms` — protected room/community management

Routes requiring data must be backed by server-side auth and authorization before they are considered functional.

## Definition of done
A feature is complete only when:
1. it builds and passes automated checks;
2. server-side access controls are tested for allowed and denied cases;
3. secrets are absent from source control;
4. responsive and keyboard paths are tested;
5. errors, loading and empty states are designed;
6. database changes are tested outside production;
7. docs describe limitations honestly.

## Rp0 discipline
Use existing free tiers and local development. Avoid paid API calls, hosted media/video, AI generation, custom domains, or production usage that may incur costs until the owner approves. Free-tier quotas may change and are not a permanent zero-cost guarantee.
