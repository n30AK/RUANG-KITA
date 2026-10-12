# RUANG KITA — Hatchable runtime source mirror

This directory mirrors the source deployed to https://ruang-kita.hatchable.site (Hatchable deployment v8, 12 October 2026).

## UI/UX migration — StartBootstrap Agency

The public landing page was migrated from `startbootstrap-agency-gh-pages.zip` in the RUANG KITA Library folder. The live deployment uses the Agency Bootstrap 5 theme, wide photo hero, responsive navigation, feature sections, a community discovery grid, an Indonesian-language usage timeline, and calls to action. The live Hatchable project vendors theme CSS and visual assets under `public/agency.css` and `public/assets/`.

## Structure

Contents mirror the Hatchable project root: `public/`, `api/`, `pages/`, `migrations/`, and `hatchable.toml`.

## Current MVP capabilities

- Email one-time-code and passkey authentication through Hatchable.
- Community creation with public/private/invitation visibility.
- Public community discovery and joining.
- Community detail pages and role-gated announcements.
- Events, meeting links, and RSVP.
- Expiring, usage-limited invitation links.
- Membership/RSVP row-access rules, member-count triggers, and audit records.
- Indonesian privacy and terms pages (operational drafts requiring owner/legal review).

## Deployment notes

Hatchable is the current runtime. This directory is a source mirror for review and backup; GitHub Actions does not automatically deploy it to Hatchable. Deploy through Hatchable after reviewing changes. The Neon production database has not been changed. Never store credentials or `.env` files in this repository.

## Release limitations

Podcast uploads/live audio, opt-in member directory, marketplace transactions, AI assistant, social funds/payments, integrated video, and full moderation/reporting are not enabled. Public community cards are loaded from the live API; when no public community exists, the UI shows an empty state rather than inventing community listings.
