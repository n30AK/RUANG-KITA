export const SCENES = {
  angkringan: {
    id: "angkringan", title: "ANGKRINGAN KITA", subtitle: "Tempat singgah, obrolan hangat",
    captionIcon: "☕", captionTitle: "Angkringan di sudut kota", captionText: "Ruang sederhana untuk percakapan yang berarti.",
    sky: 0x83aaa0, fog: 0x9bb6a2, ground: 0x718568, path: 0xbda57c, ambient: 0xffdfb4, sun: 0xffd5a0,
    mood: "Sore yang hangat", groundStyle: "kampung",
    objects: [
      {kind:"stall",x:0,z:-5,scale:1.1},
      {kind:"table",x:-3,z:-1,scale:1},{kind:"table",x:3,z:-1,scale:1},
      {kind:"bench",x:-4,z:2,rotation:Math.PI/2},{kind:"bench",x:4,z:2,rotation:-Math.PI/2},
      {kind:"tree",x:-8,z:-5,scale:1.2},{kind:"tree",x:8,z:-4,scale:1.1},
      {kind:"tree",x:-7,z:5,scale:1},{kind:"tree",x:8,z:5,scale:1.2},
      {kind:"lantern",x:-2,z:-4},{kind:"lantern",x:2,z:-4},
      {kind:"pot",x:-5,z:-2},{kind:"pot",x:5,z:-2}
    ]
  },
  cafe: {
    id: "cafe", title: "CAFE KITA", subtitle: "Tempat ide bertemu inspirasi",
    captionIcon: "☕", captionTitle: "Cafe di tengah taman", captionText: "Menikmati jeda, menemukan inspirasi baru.",
    sky: 0x9cc3c1, fog: 0xb7c7b0, ground: 0x6f9076, path: 0xd0b995, ambient: 0xe1f0d6, sun: 0xffe2a9,
    mood: "Pagi yang tenang", groundStyle: "garden",
    objects: [
      {kind:"cafe",x:0,z:-5,scale:1.15},
      {kind:"table",x:-4,z:0,scale:.9},{kind:"table",x:0,z:1,scale:.9},{kind:"table",x:4,z:0,scale:.9},
      {kind:"bench",x:-5,z:3,rotation:Math.PI/2},{kind:"bench",x:5,z:3,rotation:-Math.PI/2},
      {kind:"tree",x:-8,z:-4,scale:1.2},{kind:"tree",x:8,z:-4,scale:1.2},
      {kind:"tree",x:-8,z:5,scale:1},{kind:"tree",x:8,z:5,scale:1},
      {kind:"pot",x:-2,z:-3},{kind:"pot",x:2,z:-3},{kind:"pot",x:-6,z:0},{kind:"pot",x:6,z:0}
    ]
  },
  pantai: {
    id: "pantai", title: "PANTAI KITA", subtitle: "Ruang terbuka untuk melepas penat",
    captionIcon: "🌊", captionTitle: "Di tepi laut", captionText: "Tarik napas, dengarkan ombak, nikmati hari.",
    sky: 0x79b8c1, fog: 0xb8d9ce, ground: 0xe0c58f, path: 0xdcc18a, ambient: 0xd9f2ff, sun: 0xffe2a0,
    mood: "Siang cerah", groundStyle: "beach",
    objects: [
      {kind:"umbrella",x:-4,z:-1,scale:1},{kind:"umbrella",x:4,z:-2,scale:1.1},
      {kind:"table",x:-4,z:1,scale:.7},{kind:"table",x:4,z:1,scale:.7},
      {kind:"palm",x:-8,z:-3,scale:1.2},{kind:"palm",x:8,z:-4,scale:1.2},
      {kind:"palm",x:-7,z:5,scale:1},{kind:"palm",x:7,z:5,scale:1},
      {kind:"bench",x:0,z:6.5,rotation:Math.PI},
      {kind:"shell",x:-2,z:2},{kind:"shell",x:2,z:3},{kind:"shell",x:6,z:0},{kind:"shell",x:-6,z:-2}
    ]
  }
};

export const WORLD_RULES = Object.freeze({
  bounds: { minX: -11, maxX: 11, minZ: -9, maxZ: 9 },
  avatarRadius: 0.38,
  movementSpeed: 3.4,
  runSpeed: 5.1,
  interactionDistance: 2.2,
  sceneTransitions: Object.keys(SCENES),
  simulation: "local-deterministic-mvp"
});