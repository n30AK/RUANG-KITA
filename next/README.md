# RUANG KITA Next — source mirror

This directory mirrors the active Hatchable project `RUANG KITA Next` (project ID `proj_uCY4wAEQsDoi`) separately from the frozen legacy site at the repository root.

- **Live deployment:** https://ruang-kita-next.hatchable.site
- **Verified deployment:** v20 (2026-10-14), public visibility
- **Runtime:** Three.js r164; glTF 2.0 / GLB asset interoperability
- **Scenes:** ANGKRINGAN KITA, CAFE KITA, PANTAI KITA
- **Latest runtime report:** [../docs/RUANG_KITA_NEXT_RUNTIME_STATUS_2026-10-14.md](../docs/RUANG_KITA_NEXT_RUNTIME_STATUS_2026-10-14.md)
- **Master specification:** [../docs/RUANG_KITA_MASTER_BUILD_SPECIFICATION_v3.0.md](../docs/RUANG_KITA_MASTER_BUILD_SPECIFICATION_v3.0.md)

## Directory map

- `public/`: frontend pages, scene configuration, styles, and browser World Engine
- `api/`: community room, membership, audit, and event token handlers
- `lib/`: shared audit helpers
- `migrations/`: versioned Hatchable PostgreSQL migrations
- `hatchable.toml`: auth and database access declarations

## Source and deployment notes

Hatchable is the currently deployed runtime. This directory is a reviewable GitHub source mirror; changes to these files do not automatically deploy to Hatchable. Keep changes synchronized deliberately and never commit environment secrets. The app is not declared production-ready merely because its browser smoke tests pass.
