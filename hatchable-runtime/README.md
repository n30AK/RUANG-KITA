# RUANG KITA — Hatchable runtime source mirror

This directory mirrors the source deployed to https://ruang-kita.hatchable.site (Hatchable deployment v7, 12 October 2026).

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

Podcast uploads/live audio, opt-in member directory, marketplace transactions, AI assistant, social funds/payments, integrated video, and full moderation/reporting are not enabled. Landing-page cards remain illustrative; the member dashboard is connected to the Hatchable app database.
