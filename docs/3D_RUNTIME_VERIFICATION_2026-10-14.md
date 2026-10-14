# RUANG KITA — 3D Runtime Verification (2026-10-14)

## Deployment snapshot

- Hatchable project: proj_LP8pjixd4YxJ
- Latest live deployment verified: **v68**
- Route tested: /ruang-3d.html
- Source mirror: n30AK/RUANG-KITA, default branch main
- Master specification: [RUANG KITA Master Build Specification v3.0](RUANG_KITA_MASTER_BUILD_SPECIFICATION_v3.0.md)

## Browser evidence

Browser checks used the platform's temporary preview access because Hatchable project visibility is currently **personal/private**. This is not a permanent public visitor test.

| Check | Result |
|---|---|
| Page route | HTTP 200 through temporary preview |
| JavaScript runtime errors | 0 captured in the latest clean smoke test |
| WebGL context | Active |
| Renderer | Three.js r164 |
| Initial stage / drawing buffer | 800 × 536 |
| Scene children | 335 |
| Render draw calls | approximately 350 in Kafe |
| Rendered triangles | approximately 35k in Kafe |
| Last render duration | 7 ms, then 3 ms in two samples |
| Last successful frame age | 244–245 ms in two samples |
| Kafe self-test on v68 | **12/12 passed**, 0 failed, 0 skipped |
| World switching | Kafe, Angkringan, and Pantai were switched and rendered with WebGL active in browser smoke tests |
| Keyboard movement | Synthetic W keydown/up changed follow-camera position in a browser smoke test |
| World selector | Changed to Angkringan and the active world followed |
| Browser console/page errors | 0 captured in the latest clean smoke test |

A visual browser capture showed the café scene, avatar, furniture, and environment rather than an empty canvas. Render duration and page visibility are now exposed in runtime diagnostics. The stale-frame audit avoids treating intentionally throttled hidden tabs as active render failures.

## glTF / GLB interoperability checks

- A synthetic glTF triangle fixture loaded through the GLTFLoader adapter.
- A synthetic glTF animation clip named Move was detected and played. The child mesh position changed from y=0 to y=1.1 during the test interval.
- The asset animation mixer was created and then removed during asset cleanup; mixer count returned to zero.
- Asset manifest records source, format, supplied license/attribution, animation clip names, and loaded/removed state.
- License status is deliberately reported as **provided-not-independently-verified** when metadata is supplied, or **unverified** when absent.

**Limitation:** this validates the loader and animation lifecycle with generated test fixtures. It does not yet certify a production asset exported from Babylon.js or Godot, nor does it mean their complete runtimes are merged into Three.js.

## Collision and world behavior

The Kafe self-test checks:
- WebGL context, active render loop, and rendered scene metrics
- availability of the asset adapter
- player versus table
- NPC target separation and player versus NPC
- vehicle versus vehicle, player, and NPC
- non-destructive vehicle deadlock recovery when a clear retreat path exists
- current anomaly audit

Result on v68: **12 passed, 0 failed, 0 skipped**. The current anomaly audit reported zero issues at the time of the clean snapshot. NPC greeting logic targets a personal-space offset rather than the player's exact coordinates. Ambient vehicles now track how long they are blocked and only reverse direction when a retreat position is free of collision.

This is a predicate/self-test suite and a short browser smoke test, not proof that every collision geometry or every long-duration simulation case is perfect. Dedicated tests for narrow corridors, high-speed swept collision, long stress sessions, mobile hardware, and real multiplayer contention remain outstanding.

## Architecture and truthful status

- Three.js remains the only runtime renderer.
- Babylon.js and Godot interoperability is through glTF 2.0/GLB exports and imports, not simultaneous runtime fusion.
- Local prediction and collision decisions are deterministic browser-side logic. They are not LLM inference on every frame.
- The Pro/Expert avatar AI endpoint and signed-in paid analysis are not covered by these browser tests.

## Deployment access blocker

Hatchable reports project visibility as **personal/private**. The bare live URL returns a platform sign-in wall to non-collaborators, so the app's own public signup is not reachable to anonymous visitors. A temporary preview link can verify visitor rendering but expires. The owner must deliberately change project visibility in Hatchable Console Settings for permanent public access; this setting is not available through the connected deployment action.

## Next priorities

1. Owner enables public visibility if RUANG KITA is intended for public visitors.
2. Run collision tests on real authored assets and at least one long-duration scenario.
3. Add a repeatable real-browser E2E job when the repository has a browser-test runner available.
4. Benchmark model loading, memory, and frame time on a mid-range mobile device.
5. Keep engine/asset license and attribution checks as release gates.
