# RUANG KITA Next — Runtime Verification (2026-10-14)

## Deployment

- Hatchable project: `proj_uCY4wAEQsDoi`
- Project: RUANG KITA Next
- Deployment: **v24 — live**
- Visibility: **public**
- URL: https://ruang-kita-next.hatchable.site
- 3D engine: Three.js r164
- Asset interchange: glTF 2.0 / GLB
- Build/deploy validator before v24: passed, zero errors and zero warnings.

## Browser verification

The public live URL loaded successfully in the managed browser. The title was `RUANG KITA — Dunia Kita, Cerita Kita`; WebGL was active, the render loop advanced, and the diagnostics reported no renderer exception. No browser page errors, console errors, or failed network requests were captured in the acceptance session.

Three scenes were switched and rendered:
- **ANGKRINGAN KITA:** about 10k triangles, WebGL active.
- **CAFE KITA:** about 9.7k triangles, WebGL active.
- **PANTAI KITA:** about 6.9k triangles, WebGL active.

After the v20 animation-lifecycle fix and v21 World Intelligence panel, each scene's on-demand self-test returned **PASS, 11 passed, 0 failed**. A further managed-browser observation ran each scene for about 3 seconds; all three maintained an active render loop, no render exception, zero detected anomaly issues, and 11/11 self-tests. The avatar moved about 1.5 world units during a 700 ms synthetic W-key input, with no anomaly reported. These are bounded smoke tests, not a proof that every possible collision or long-duration behavior is correct.

## GPU resource lifecycle — v24

The first repeated scene-switch test showed the GPU texture counter increasing by one after each transition. Investigation identified shadow render targets from removed directional lights as the leak. The teardown now disposes light shadow maps/mapPass as well as textures belonging to non-shared materials. After v24, the Cafe scene (with the persistent avocado asset) and Pantai scene were alternated four times; texture count remained at **4** throughout, geometry counts returned to the scene-specific baseline, the asset remained cached, and no browser/network errors were captured. This is a bounded browser test, not a physical-device memory profile.

## glTF animation lifecycle — v20

The previous adapter loaded and removed models but did not advance glTF animation clips. v20 added:
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
- an asset requested for Pantai stayed hidden in Angkringan, became visible in Pantai, and was cleaned up when leaving Pantai;
- no runtime or network errors were captured.

The fixture is generated for testing. It does **not** certify a production asset exported from Babylon.js or Godot.

## World Intelligence agents — v21

The v21+ live interface exposes seven role-separated local agents and their current state: Observer, Predictor, Behavior Planner, Scene Builder, Repair Agent, Anomaly Auditor, and Resource Guard. The cycle gathers scene metrics, predicts short-horizon vehicle conflicts, audits collider/NPC/vehicle conditions, chooses bounded recovery actions, reports repairs, and checks coarse GPU resource counts. The panel updates during the bounded local simulation loop.

These roles are **deterministic local agents**, not seven separate LLM calls. No language model is invoked on every frame. On-demand generative planning is not configured as part of this deployment, and the interface explicitly says so.

## Movement and simulation checks

- Synthetic `KeyW` keydown/up moved the avatar from approximately `(0, 4.5)` to `(-0.5, 3.69)` during a 450 ms movement window.
- Self-tests check WebGL, render loop, rendered scene metrics, scene configuration, static collision, NPC separation, vehicle overlap safety, glTF adapter, animation-mixer registry, anomaly recovery, and anomaly severity.
- The World Guard and vehicle prediction use local deterministic rules. They are not LLM inference every frame.
- The project currently has three distinct procedural scene configurations using one shared World Engine and renderer.

## Licensed real GLB asset — v22

The official Khronos glTF-Sample-Assets **Avocado** model is loaded lazily as a decorative prop on the Cafe Kita table. The source identifies it as CC0 1.0 Universal. The deployed asset is about 8.1 MB, so it is not downloaded on initial page load; the first Cafe visit triggers the download, and it remains cached while switching scenes. Its source URL and SHA-256 are documented in `next/public/assets/LICENSES.md`. The binary itself is hosted in Hatchable and is **not** copied into the GitHub source mirror; restore it from the documented official URL when rebuilding the deployment elsewhere.

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
