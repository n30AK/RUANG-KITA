# RUANG KITA — 3D Runtime Status

**Last checked:** 2026-10-14  
**Hosted project:** RUANG KITA on Hatchable  
**Deployment:** v56 — recorded as live  
**Live URL:** https://ruang-kita.hatchable.site  
**3D route:** https://ruang-kita.hatchable.site/ruang-3d.html

## Verified in browser

- The root page loaded with HTTP/browser navigation success and title `RUANG KITA — Silaturahmi Lebih Dekat`.
- The 3D route loaded with title `Ruang 3D · RUANG KITA`.
- The `#world` canvas exists, WebGL is available, renderer and canvas dimensions matched the stage on desktop and mobile viewport checks.
- The Three.js render loop advanced; a multi-sample run over approximately 4.8 seconds recorded 32 render frames in the managed browser environment.
- Runtime diagnostics reported no render exception.
- The on-demand world anomaly audit reported `clear` with zero detected issues across four samples during a short observation window. This is a smoke test, not proof that every collision scenario is correct.
- A minimal glTF 2.0 empty-scene fixture passed the adapter load/register/remove path without error. This does **not** yet verify rendering of a real GLB model with mesh, texture, rig, or animation.
- A screenshot captured the 3D cafe scene visibly rendered in the browser. The current scene is primarily procedural Three.js geometry rather than a library of external image textures.
- At a 390 × 844 viewport, the stage fit the viewport width and the document had no horizontal overflow.

## Changes in v53–v56

- Added a runtime diagnostics API for WebGL, stage/drawing-buffer dimensions, render frame counter, draw calls, triangles, GPU geometry/texture counts, loaded assets, and render errors.
- Added an interoperable glTF 2.0 / GLB loader adapter with duplicate in-flight load protection and resource cleanup.
- Added adaptive rendering quality: default balanced mode uses a lower pixel ratio and disables shadow maps unless the device passes a conservative high-performance check.
- Fixed NPC social-roaming targets so they are validated against movement blockers and other walkers.
- Added a short backoff before NPC replanning when repeatedly blocked, avoiding target changes every frame.
- Added an on-demand and periodic rule-based anomaly audit for vehicle overlap, vehicle/walker overlap, walker overlap, blocked NPC goals, repeated blockage, and stale rendering.
- Added collision checks against people and remote avatars in the sample home interior.

## Known limitations / not yet verified

- **Only the Cafe Komunitas 3D scene is currently implemented in this route.** ANGKRINGAN KITA and PANTAI KITA still need to be built as separate scene configurations using a shared World Engine.
- The current anomaly audit is deterministic local logic, not a language model running continuously. Vehicle prediction is a short-horizon heuristic.
- Full physics-engine integration (for example Rapier) has not been implemented or benchmarked.
- Babylon.js and Godot are not combined as full runtime engines. The current architecture uses Three.js as the renderer and glTF/GLB as the intended asset interchange path.
- A real GLB containing visible geometry, textures, rigging, and animation still needs a browser acceptance test.
- Collision checks have not yet been exhaustively exercised through scripted player/NPC/vehicle scenarios, especially high-speed movement and every interior/exterior boundary.
- Multiplayer synchronization has not been verified with two or more authenticated browser clients in this test pass.
- The GitHub repository now contains the 3D HTML source and this status report, but the hosted backend/API handlers and complete deployment configuration are not yet fully mirrored into GitHub. Hatchable v56 remains the active deployed runtime.
- No production database migrations or destructive data changes were performed as part of this 3D stabilization pass.

## Next execution order

1. Add and test a real, licensed GLB asset (visible mesh; then texture/animation where applicable).
2. Build a shared scene registry and implement ANGKRINGAN KITA, CAFE KITA, and PANTAI KITA as distinct configurations, not merely different labels.
3. Add repeatable collision tests for avatar, NPC, vehicle, furniture, buildings, and interior transitions.
4. Benchmark draw calls and frame time on a desktop and a low-end mobile profile; consider instancing/static batching where profiling supports it.
5. Mirror backend handlers, migrations, configuration examples, and test scripts into GitHub without committing secrets.
6. Test multiplayer with multiple authenticated clients before claiming production realtime.
