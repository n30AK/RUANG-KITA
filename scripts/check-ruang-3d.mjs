import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const htmlPath = path.resolve("public/ruang-3d.html");
const html = await readFile(htmlPath, "utf8");
const importMapMatch = html.match(/<script type="importmap">([\s\S]*?)<\/script>/i);
const moduleMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/i);

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

if (!importMapMatch) fail("Import map tidak ditemukan.");
if (!moduleMatch) fail("Module script dunia 3D tidak ditemukan.");
if (process.exitCode) process.exit();

let importMap;
try {
  importMap = JSON.parse(importMapMatch[1]);
} catch (error) {
  fail(`Import map bukan JSON valid: ${error.message}`);
  process.exit();
}

const threeUrl = "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";
const loaderUrl = "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/loaders/GLTFLoader.js";
if (importMap.imports?.three !== threeUrl) fail("Import map Three.js tidak sesuai versi yang dipin.");
if (!moduleMatch[1].includes(`from '${threeUrl}'`)) fail("Import Three.js tidak konsisten dengan import map.");
if (!moduleMatch[1].includes(`from '${loaderUrl}'`)) fail("GLTFLoader tidak sesuai versi Three.js yang dipin.");

const requiredMarkers = [
  "window.RUANG_KITA_ENGINE",
  "getWorldDiagnostics",
  "runWorldSelfTest",
  "worldAssetMixers",
  "worldAssetManifest",
  "player-npc-collision",
  "vehicle-player-collision",
  "vehicle-npc-collision",
  "vehicle-deadlock-recovery",
  "recoverBlockedVehicle",
  "vehicleBlockedTooLong",
  "vehicleRecovery",
  "lastRenderDurationMs",
  "visibilityState",
  "greetingTarget",
];
for (const marker of requiredMarkers) {
  if (!moduleMatch[1].includes(marker)) fail(`Quality gate tidak menemukan fitur wajib: ${marker}`);
}
const requiredUiMarkers = ['id="world-ai-panel"', 'id="world-ai-toggle"', 'id="world-ai-selftest"'];
for (const marker of requiredUiMarkers) {
  if (!html.includes(marker)) fail(`Quality gate tidak menemukan kontrol UI wajib: ${marker}`);
}
if (process.exitCode) process.exit();

const dir = await mkdtemp(path.join(tmpdir(), "ruang-kita-3d-"));
try {
  const tempModule = path.join(dir, "ruang-3d.mjs");
  await writeFile(tempModule, moduleMatch[1], "utf8");
  const check = spawnSync(process.execPath, ["--check", tempModule], { encoding: "utf8" });
  if (check.error) fail(`Node syntax check gagal dijalankan: ${check.error.message}`);
  else if (check.status !== 0) fail(`Sintaks module 3D tidak valid:\n${check.stderr || check.stdout}`);
  else console.log("PASS: sintaks module 3D valid.");
} finally {
  await rm(dir, { recursive: true, force: true });
}

if (!process.exitCode) {
  console.log("PASS: import map/loader konsisten dan marker collision, diagnostics, animasi, serta manifest tersedia.");
}
