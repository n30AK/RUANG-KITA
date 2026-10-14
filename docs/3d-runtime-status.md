# RUANG KITA — 3D Runtime Status

**Last checked:** 2026-10-14  
**Hosted project:** RUANG KITA LEGACY — FROZEN on Hatchable  
**Deployment:** v69 — live  
**Live URL:** https://ruang-kita.hatchable.site  
**3D route:** https://ruang-kita.hatchable.site/ruang-3d.html  
**Source mirror:** `n30AK/RUANG-KITA/public/ruang-3d.html`

## Verified in browser

- Browser verification used a fresh temporary Hatchable preview URL because the project is personal/private.
- The 3D route loaded with title `Ruang 3D · RUANG KITA`.
- WebGL context active; renderer is Three.js r164.
- Initial stage and drawing buffer matched at 800 × 536 in the managed browser.
- Render loop advanced; diagnostics reported scene children, draw calls, triangles, and no render exception.
- Kafe self-test: **12 passed, 0 failed, 0 skipped**.
- World switching successfully activated Kafe, Angkringan, and Pantai; WebGL remained active and triangles were rendered in all three.
- AI Dunia panel opened, displayed runtime metrics and NORMAL status, and exposed the self-test.
- Browser page errors, console errors, and failed network requests: **0 captured** in the latest clean smoke test.
- A synthetic glTF 2.0 triangle mesh loaded through the adapter, appeared in the asset registry, and was removed; the registry recorded its removal.
- Prior v69 verification recorded a synthetic animation clip being detected and played, with its mixer cleaned up.
- The deployed source file and GitHub mirror were byte-for-byte identical during this audit.

## Collision / anomaly coverage

The Kafe self-test covers:
- WebGL, render loop, scene metrics, and adapter availability;
- player versus table and NPC;
- NPC target separation;
- vehicle versus vehicle, player, and NPC;
- non-destructive vehicle deadlock recovery when a clear retreat path exists;
- current anomaly audit.

A short browser audit returned zero active issues. This is evidence from a bounded observation, not proof that all possible collisions are solved. Narrow corridors, high-speed swept collision, long stress runs, all interior/exterior boundaries, and real-device mobile performance remain to be tested.

## Architecture and honest limits

- Three.js r164 is the only runtime renderer.
- Babylon.js and Godot are not embedded as full simultaneous runtimes; asset interoperability uses glTF 2.0/GLB.
- The tested triangle/animation fixtures are synthetic. They do not certify a production asset exported from Babylon.js or Godot.
- Collision and vehicle prediction are local deterministic logic, not an LLM reasoning every frame.
- Signed-in paid Pro/Expert avatar AI analysis and multiplayer with multiple authenticated clients were not tested here.
- The public GitHub scene source matches the hosted source. Backend handlers and the complete hosted deployment configuration are not yet fully mirrored to GitHub.
- No production database migrations or destructive data changes were performed during this 3D audit.

## Public access blocker

Hatchable reports project visibility as **personal/private**. The bare live URL shows a platform sign-in wall to non-collaborators. Temporary preview links expire and are only suitable for verification. Permanent public visibility must be enabled by the owner in Hatchable Console Settings; this action is not available through the deployment tool.

## Next priorities

1. Owner enables public visibility if RUANG KITA is intended for anonymous public visitors.
2. Run repeatable collision tests for narrow corridors, fast vehicles, interior transitions, and longer simulation periods.
3. Add a real licensed GLB asset test, including textures and animation where applicable.
4. Benchmark on a physical mid-range/low-end mobile device.
5. Add repeatable E2E tests to CI and continue mirroring backend/configuration examples without secrets.
6. Test multiplayer using multiple authenticated browser clients before claiming production realtime.
