# ADR-0001: 3D Engine and Asset Interoperability

- **Status:** Accepted for current web MVP
- **Date:** 2026-10-14
- **Decision owner:** RUANG KITA engineering

## Context

RUANG KITA currently serves a browser-based 3D scene through a single HTML module. The user asked to reuse relevant components from Three.js, Babylon.js, and Godot. Running all three complete runtimes in one browser scene would duplicate rendering/game-loop systems, increase download and memory cost, and introduce engine-specific behavior that does not automatically interoperate.

## Decision

1. Keep Three.js r164 as the current renderer and scene runtime.
2. Use glTF 2.0 / GLB as the preferred interchange format for assets authored or exported from compatible pipelines.
3. Treat Babylon.js as optional authoring/validation tooling and Godot as optional authoring/prototyping or a separate runtime, not as embedded Three.js scene nodes.
4. Load approved assets through a dedicated adapter with duplicate in-flight request protection and resource cleanup.
5. Record source/license/attribution for every distributed third-party asset.
6. Add real GLB mesh/texture/animation acceptance tests before calling the interop pipeline production-ready.

## Consequences

- Current page avoids shipping multiple rendering engines.
- Cross-engine assets are portable only to the extent their glTF export and extensions are supported.
- Physics, navigation, animation controllers, and engine-specific shaders are not automatically portable.
- The current smoke test covered loading/registering/removing a minimal glTF scene only; a visible production GLB remains untested.

## Verification status

See [3D Runtime Status](../3d-runtime-status.md) for the current deployment, browser smoke tests, and known gaps.
