# RUANG KITA — Hatchable runtime

This directory mirrors the source deployed to `https://ruang-kita.hatchable.site` (Hatchable deployment v6, 12 October 2026).

## Structure

The contents under this directory mirror the Hatchable project root: `public/`, `api/`, `pages/`, `migrations/`, and `hatchable.toml`.

## Current MVP capabilities

- Email one-time-code authentication through Hatchable `[auth]`.
- Community creation with public/private/invitation visibility.
- Public community discovery and joining.
- Events, meeting links, and RSVP.
- Expiring, usage-limited invitation links.
- Membership/RSVP row-access rules and audit records.
- Indonesian privacy and terms pages (operational drafts requiring owner/legal review).

## Deployment notes

Hatchable is the current runtime. Files in this folder are a source mirror for review/backup; they are not automatically deployed by GitHub Actions. Deploy through Hatchable after reviewing changes. The Neon production database has not been changed. Do not store credentials or `.env` files in this repository.

## Release limitations

Podcast uploads/live audio, member directory, marketplace transactions, AI assistant, social funds/payments, and integrated video are not enabled. The public landing-page cards contain illustrative data; the member dashboard is connected to the Hatchable app database.
