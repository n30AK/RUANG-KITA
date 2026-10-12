# RUANG KITA MVP — Implementation Plan

## Status and safety boundary
This branch is `feat/ruang-silaturahmi-mvp`. The production Neon branch must remain untouched. No database migration is applied by this plan. UI prototype uses local demo data only and must label it as demo.

### Latest validation
- [x] GitHub Actions RUANG KITA CI #22 passed for commit `8b80a70` (podcast/audio-lounge UI preview).
- [x] GitHub Actions RUANG KITA CI #23 passed for PR #1 synchronization.
- CI success confirms automated typecheck, lint and build for the tested revision; it does not mean backend/auth/database or production deployment is complete.

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
- [x] Draft schema relationships for community rooms, tables/seats, podcast shows/episodes, audio sessions, cross-community guest passes, recording consent and notification preferences in migration `0002_rooms_podcast_and_guest_access.sql`.
- [ ] Review schema relationships for room memberships, scene presets, expo booths, role enforcement and identity mapping; migration 0002 is a draft and is not applied.
- [ ] Confirm extension permissions and migration idempotency.
- [ ] Validate migration 0002 on a temporary/development branch; inspect resulting schema and run positive/negative authorization tests.
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


### F. Podcast & healthy community engagement
- [x] Define Podcast Studio, episode library, live-audio roadmap, co-host/guest invitations and permission boundaries in the product blueprint.
- [x] Define cross-community guest passes that grant session-scoped access only, not blanket community membership.
- [x] Define healthy retention features: opted-in agenda reminders, weekly digest, saved episodes, learning activities, contribution recognition and notification controls.
- [x] Add podcast/episode demo cards to the product UI, explicitly labeled as prototype content.
- [ ] Implement show/episode metadata and public/private visibility after database review.
- [ ] Implement invitation creation, accept, expire, revoke, role scope, and server-side authorization.
- [ ] Validate token hashing, recipient binding, single-use acceptance and expiry/revocation race handling.
- [ ] Add recording/transcription consent and copyright/reporting flow before any native media feature.
- [ ] Add notification preferences, quiet hours, digest opt-in, mute/unfollow and delete/export controls.
- [ ] Validate cross-tenant deny tests for podcast assets, private episodes, guest passes and transcripts.
- [ ] Choose an audio/media provider only after cost, licensing, storage, bandwidth, privacy and Rp0 constraints are documented; no paid activation without approval.


### G. Schema migration draft (not applied)
- [x] Add a draft migration for room tables, podcast shows/episodes, audio sessions, cross-community invitations, recording consent, and notification preferences.
- [ ] Review the draft against Neon Auth's actual user/session identity and application authorization model.
- [ ] Add and test tenant-scoped server-side access checks; do not expose privileged database credentials to the browser.
- [ ] Test the migration on a temporary/development branch before requesting production approval.
- [ ] Verify invitation scope constraints and room/table capacity enforcement in application logic or database constraints.


### H. Database validation status

- [ ] **Current blocker (12 Oct 2026):** Neon `production` currently has no application tables in `public`; migration 0002 cannot be tested alone because `public.communities` and other base relations do not exist yet. A combined base+extension temporary-branch test was blocked by the database tool safety gate. Do not apply either migration to production; first create/use an isolated development branch and review the base schema, then test migrations sequentially.


### I. Delapan modul komunitas — requirement resmi (12 Oct 2026)
- [x] Formalize product requirements and acceptance criteria in `docs/PRODUCT-REQUIREMENTS-EIGHT-COMMUNITY-MODULES.md`.
- [x] Draft migration `0003_community_directory_marketplace_funds_memory_ai.sql` for community vision/mission, officers, opt-in member directory, activity feed, moderated marketplace, social-fund ledger/approvals, community memory, and permission-scoped AI knowledge sources/artifacts.
- [ ] Review migration 0003 against migrations 0001/0002, Neon PostgreSQL version, actual Auth identity mapping, and storage model.
- [ ] Add explicit RLS/authorization policies for every tenant-owned table and negative tests for anonymous, unrelated tenant, unverified member, ordinary member, moderator, admin and owner.
- [ ] Validate all three migrations sequentially on an isolated Neon development branch; test rollback/restore and inspect actual schema. None of the migrations is applied.
- [ ] Implement community homepage: logo/cover, vision/mission, officers, agenda, announcements, recent activity, membership gates and verification workflow.
- [ ] Implement RSVP/calendar export, opt-in directory/search, media/history archive and marketplace moderation workflows.
- [ ] Implement social-fund ledger with separation of duties, approval records, audit trail, reconciliation and reports. No payment processing until a separate approved integration exists.
- [ ] Implement podcast uploads/playback, consent capture, AI transcripts/summaries and deletion only after storage/provider/security review.
- [ ] Implement retrieval-based community AI with source citations, tenant and visibility filtering, human approval, budget controls and prompt-injection tests.
- [ ] Add functional end-to-end tests for all eight modules; replace demo actions/data or mark them unambiguously as demo.
- [ ] Select and configure production hosting only after checking connected provider, environment secrets, deployment limits and owner approval for any potential costs.
- [ ] Confirm deployed production URL, health check, authentication, database connectivity, access-denial tests, logs and rollback before calling any scope live.

**Release gate:** documentation and SQL drafts are not deployed functionality. Do not merge the draft PR, change Neon production, or declare the product live until the checks above are met and the required production approval is recorded.
