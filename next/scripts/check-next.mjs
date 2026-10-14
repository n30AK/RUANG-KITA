import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve("next");
const files = {
  html: path.join(root, "public/index.html"),
  app: path.join(root, "public/app.js"),
  scenes: path.join(root, "public/scenes.js"),
};
const [html, app, scenes] = await Promise.all([
  readFile(files.html, "utf8"),
  readFile(files.app, "utf8"),
  readFile(files.scenes, "utf8"),
]);
let failed = false;
function check(ok, message) {
  if (ok) console.log("PASS:", message);
  else { console.error("FAIL:", message); failed = true; }
}

const mapMatch = html.match(/<script type="importmap">([\s\S]*?)<\/script>/i);
check(!!mapMatch, "index contains an import map");
let map = null;
try { map = JSON.parse(mapMatch?.[1] || ""); } catch {}
const three = "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";
const loader = "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/loaders/GLTFLoader.js";
check(map?.imports?.three === three, "Three.js import map is pinned to r164");
check(app.includes('import * as THREE from "three"'), "app uses the import-map Three.js module");
check(app.includes('from "' + loader + '"'), "GLTFLoader version matches Three.js r164");

for (const marker of [
  "window.RUANG_KITA_NEXT",
  "getWorldDiagnostics",
  "runWorldSelfTest",
  "worldAiAudit",
  "worldAiPredict",
  "repairWorldAnomalies",
  "isPositionBlocked",
  "vehicleCanMove",
  "loadWorldGltf",
  "removeWorldGltf",
  "worldAssetMixers",
  "new THREE.AnimationMixer",
  "mixer.update(dt)",
  "mixer.stopAllAction()",
  "mixer.uncacheRoot(root)",
  "asset-animation-registry",
]) check(app.includes(marker), "app contains required runtime safeguard: " + marker);

for (const id of ["angkringan", "cafe", "pantai"]) {
  check(scenes.includes(id + ":"), "scene configuration exists: " + id);
}
check(scenes.includes("local-deterministic-mvp"), "simulation mode is explicitly labeled");
check(html.includes('id="stage"') && html.includes('id="runtime-status"'), "index includes stage and runtime status UI");

const apiFiles = [
  "api/community/audit.js",
  "api/community/invites.js",
  "api/community/invites/accept.js",
  "api/community/join.js",
  "api/community/messages.js",
  "api/community/rooms.js",
  "api/events-token.js",
];
for (const relative of apiFiles) {
  const source = await readFile(path.join(root, relative), "utf8");
  check(/export const access\s*=\s*["'](?:public|user|member|admin|scheduler)["']/.test(source),
    relative + " declares an explicit route access policy");
}

const dir = await mkdtemp(path.join(tmpdir(), "ruang-kita-next-check-"));
try {
  for (const relative of ["public/app.js", "public/scenes.js", ...apiFiles]) {
    const source = await readFile(path.join(root, relative), "utf8");
    const temp = path.join(dir, relative.replaceAll("/", "__") + ".mjs");
    await writeFile(temp, source, "utf8");
    const result = spawnSync(process.execPath, ["--check", temp], { encoding: "utf8" });
    check(!result.error && result.status === 0,
      relative + " passes Node module syntax check" + (result.status === 0 ? "" : ": " + (result.stderr || result.error?.message || "unknown error")));
  }
} finally {
  await rm(dir, { recursive: true, force: true });
}

if (failed) process.exitCode = 1;
else console.log("PASS: RUANG KITA Next static quality gate completed.");
