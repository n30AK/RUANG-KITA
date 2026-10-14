# RUANG KITA Next — Runtime Verification (2026-10-14)

## Deployment

- Hatchable project: `proj_uCY4wAEQsDoi`
- Project: RUANG KITA Next
- Deployment: **v20 — live**
- Visibility: **public**
- URL: https://ruang-kita-next.hatchable.site
- 3D engine: Three.js r164
- Asset interchange: glTF 2.0 / GLB
- Build/deploy validator before v20: passed, zero errors and zero warnings.

## Browser verification

The public live URL loaded successfully in the managed browser. The title was `RUANG KITA — Dunia Kita, Cerita Kita`; WebGL was active, the render loop advanced, and the diagnostics reported no renderer exception. No browser page errors, console errors, or failed network requests were captured in the acceptance session.

Three scenes were switched and rendered:
- **ANGKRINGAN KITA:** about 10k triangles, WebGL active.
- **CAFE KITA:** about 9.7k triangles, WebGL active.
- **PANTAI KITA:** about 6.9k triangles, WebGL active.

After the v20 animation-lifecycle fix, each scene's on-demand self-test returned **PASS, 11 passed, 0 failed**. The audit reported severity `clear` and zero issues during the short observation window. These are bounded smoke tests, not a proof that every possible collision or long-duration behavior is correct.

## glTF animation lifecycle — v20

The previous adapter loaded and removed models but did not advance glTF animation clips. v20 adds:
- a registry of `THREE.AnimationMixer` instances;
- default playback of the first clip, optional selection by animation name, or `animation: "all"`;
- frame updates using the bounded simulation delta;
- mixer stop/uncache cleanup when an asset is removed;
- diagnostics for active mixer count and animation clip names;
- scene scoping so an asynchronously loaded model does not appear in a different scene;
- a self-test guard against orphaned animation mixers.

A synthetic glTF 2.0 animated-triangle fixture passed in the browser:
- concurrent requests for the same key returned the same root;
- clip `FixtureMove` was detected;
- child-node Y position changed from 0 to 0.4 during a 650 ms observation;
- active mixer count rose to 1 while loaded and returned to 0 after removal;
- the asset was removed from the registry and GPU geometry count returned to baseline;
- no runtime or network errors were captured.

The fixture is generated for testing. It does **not** certify a production asset exported from Babylon.js or Godot.

## Movement and simulation checks

- Synthetic `KeyW` keydown/up moved the avatar from approximately `(0, 4.5)` to `(-0.5, 3.69)` during a 450 ms movement window.
- Self-tests check WebGL, render loop, rendered scene metrics, scene configuration, static collision, NPC separation, vehicle overlap safety, glTF adapter, animation-mixer registry, anomaly recovery, and anomaly severity.
- The World Guard and vehicle prediction use local deterministic rules. They are not LLM inference every frame.
- The project currently has three distinct procedural scene configurations using one shared World Engine and renderer.

## Engine interoperability

- Three.js is the sole runtime renderer.
- Babylon.js and Godot are not embedded as simultaneous runtime engines.
- The supported integration path is glTF 2.0 / GLB export/import, subject to feature/extension compatibility and asset licensing.
- Asset license and attribution metadata must be supplied and reviewed before distributing third-party assets.

## Remaining work

1. Test a real, licensed GLB exported from a compatible tool, including texture and animation where available.
2. Run longer deterministic collision/stuck-agent tests, including narrow paths and high-speed movement.
3. Benchmark on a physical mid-range and low-end mobile device.
4. Test multiplayer with multiple authenticated browser clients before claiming production realtime.
5. Keep all automatic source-code repairs behind diff review, sandbox tests, and deployment quality gates.

## Separation from legacy

The previous deployment `RUANG KITA LEGACY — FROZEN` (Hatchable v69, slug `ruang-kita`) remains separate and is not the active Next development target. Its temporary preview is not the public app URL.
