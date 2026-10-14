import * as THREE from "three";
import { SCENES, WORLD_RULES } from "./scenes.js";

const $ = (id) => document.getElementById(id);
const stage = $("stage");
const statusLabel = $("runtime-status");
const loading = $("loading-overlay");
const toast = $("toast");
const stateLabel = $("world-state");
const progress = $("progress-bar");
const buildCopy = $("build-status-copy");
const buildLabel = $("build-status-label");
$("year").textContent = new Date().getFullYear();

let renderer, camera, scene, clock, avatar, avatarRoot, activeSceneId = "angkringan";
let worldGroup, waterMesh, sunLight, skyMesh, playerVelocity = new THREE.Vector3();
let cameraYaw = 0.55, cameraPitch = 0.42, cameraDistance = 8.8;
let dragPointer = null, lastPointer = {x:0,y:0}, cameraDragging = false;
let isRunning = false, lastToastAt = 0, lastUiAt = 0;
const keys = new Set();
const colliders = [];
const materials = {};
const textureLoader = new THREE.TextureLoader();

const mat = (color, roughness=.85, metalness=0) => {
  const key = [color,roughness,metalness].join("-");
  if (!materials[key]) materials[key] = new THREE.MeshStandardMaterial({color,roughness,metalness});
  return materials[key];
};
const box = (w,h,d,material,x=0,y=0,z=0,cast=true) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
  mesh.position.set(x,y,z); mesh.castShadow=cast; mesh.receiveShadow=true; return mesh;
};
const sphere = (r,material,x=0,y=0,z=0,scale=null) => {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r,18,14),material);
  mesh.position.set(x,y,z); if(scale) mesh.scale.set(...scale); mesh.castShadow=true; mesh.receiveShadow=true; return mesh;
};
const cylinder = (rt,rb,h,material,x=0,y=0,z=0,segments=12) => {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments),material);
  mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; return mesh;
};
function addCollider(x,z,rx,rz,tag="object") { colliders.push({x,z,rx,rz,tag}); }
function addMesh(parent,mesh){parent.add(mesh);return mesh;}
function showToast(message) {
  toast.textContent=message; toast.classList.add("show"); lastToastAt=performance.now();
  window.setTimeout(()=>{if(performance.now()-lastToastAt>=1250)toast.classList.remove("show");},1350);
}
function setProgress(p,label,copy) {
  progress.style.width=Math.max(0,Math.min(100,p))+"%";
  buildLabel.textContent=label;
  if(copy)buildCopy.textContent=copy;
}
function createRenderer() {
  const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
  renderer.setSize(width,height,false);
  renderer.shadowMap.enabled=window.innerWidth>760;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.08;
  renderer.domElement.setAttribute("aria-label","Dunia 3D RUANG KITA");
  stage.prepend(renderer.domElement);
  scene=new THREE.Scene();
  scene.fog=new THREE.Fog(0x9bb6a2,24,58);
  camera=new THREE.PerspectiveCamera(49,width/height,.1,120);
  camera.position.set(7,6,8);
  clock=new THREE.Clock();
}
function makeAvatar() {
  avatarRoot=new THREE.Group();
  avatarRoot.name="Pemain";
  const skin=mat(0xd9a77f),shirt=mat(0x4f8d73),pants=mat(0x263b3b),shoe=mat(0x202a28),hair=mat(0x302923),eye=mat(0x241e1a);
  const body=cylinder(.22,.28,.63,shirt,0,1.03,0,16); addMesh(avatarRoot,body);
  const head=sphere(.235,skin,0,1.57,0); addMesh(avatarRoot,head);
  const hairCap=sphere(.24,hair,0,1.69,-.015,[1,.53,1]); addMesh(avatarRoot,hairCap);
  addMesh(avatarRoot,sphere(.035,eye,-.085,1.59,.206));
  addMesh(avatarRoot,sphere(.035,eye,.085,1.59,.206));
  addMesh(avatarRoot,cylinder(.07,.075,.08,skin,0,1.35,0,12));
  const leftLeg=cylinder(.085,.095,.46,pants,-.12,.49,0,10);
  const rightLeg=cylinder(.085,.095,.46,pants,.12,.49,0,10);
  addMesh(avatarRoot,leftLeg);addMesh(avatarRoot,rightLeg);
  addMesh(avatarRoot,box(.13,.1,.24,shoe,-.12,.25,.035));
  addMesh(avatarRoot,box(.13,.1,.24,shoe,.12,.25,.035));
  const leftArm=cylinder(.065,.075,.42,skin,-.29,1.04,0,10);leftArm.rotation.z=-.13;
  const rightArm=cylinder(.065,.075,.42,skin,.29,1.04,0,10);rightArm.rotation.z=.13;
  addMesh(avatarRoot,leftArm);addMesh(avatarRoot,rightArm);
  avatar={root:avatarRoot,leftLeg,rightLeg,leftArm,rightArm,body,head,walkTime:0};
  scene.add(avatarRoot);
}
function makeTree(parent,x,z,scale=1,palm=false) {
  const group=new THREE.Group();group.position.set(x,0,z);group.scale.setScalar(scale);parent.add(group);
  if(palm){
    addMesh(group,cylinder(.14,.22,2.5,mat(0x8d6947),0,1.25,0,9)).rotation.z=-.12;
    for(let i=0;i<7;i++){const a=i*Math.PI*2/7;const leaf=box(.17,.08,1.65,mat(i%2?0x3d7d57:0x4a8d60),Math.sin(a)*.65,2.48+Math.cos(a)*.22,Math.cos(a)*.65);leaf.rotation.y=a;leaf.rotation.x=-.22;addMesh(group,leaf);}
    addCollider(x,z,.45,.45,"palm");
  }else{
    addMesh(group,cylinder(.18,.25,1.25,mat(0x805d42),0,.62,0,9));
    addMesh(group,cylinder(.05,.09,.4,mat(0x805d42),-.1,1.2,0,8)).rotation.z=-.4;
    addMesh(group,sphere(.85,mat(0x4f8158),0,1.8,0,[1,1.12,1]));
    addMesh(group,sphere(.56,mat(0x629267),-.38,1.93,.08));
    addMesh(group,sphere(.52,mat(0x416e4d),.36,2.05,-.1));
    addCollider(x,z,.58,.58,"tree");
  }
}
function makeTable(parent,x,z,scale=1) {
  const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);parent.add(g);
  addMesh(g,cylinder(.62,.62,.12,mat(0x916644),0,.78,0,16));
  addMesh(g,cylinder(.11,.15,.72,mat(0x684a35),0,.39,0,10));
  for(const dx of [-.39,.39])for(const dz of [-.39,.39])addMesh(g,cylinder(.035,.045,.74,mat(0x684a35),dx,.37,dz,8));
  addCollider(x,z,.67*scale,.67*scale,"table");
}
function makeBench(parent,x,z,rotation=0) {
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rotation;parent.add(g);
  addMesh(g,box(1.35,.13,.4,mat(0x986d49),0,.52,0));
  addMesh(g,box(1.35,.35,.12,mat(0x805a40),0,.79,-.15));
  for(const dx of [-.48,.48])addMesh(g,box(.1,.48,.1,mat(0x604833),dx,.26,0));
  addCollider(x,z,.78,.38,"bench");
}
function makeStall(parent,x,z,scale=1) {
  const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);parent.add(g);
  addMesh(g,box(4.4,1.65,.32,mat(0x674631),0,1.02,0));
  addMesh(g,box(4.65,.14,.58,mat(0xc18a56),0,1.85,.02));
  const roof=box(4.9,.16,2.3,mat(0x35483b),0,2.75,-.45);roof.rotation.x=-.08;addMesh(g,roof);
  for(const x0 of [-2.2,2.2])addMesh(g,box(.12,2.6,.12,mat(0x503e2e),x0,1.42,-.45));
  addMesh(g,box(4.1,.08,.22,mat(0xdbc08b),0,1.55,.2));
  for(let i=0;i<5;i++)addMesh(g,cylinder(.1,.1,.18,mat([0xc88a55,0x9a5942,0xd3b77e][i%3]),-1.6+i*.8,1.67,.24,10));
  addCollider(x,z-.48,2.48,.85,"stall");
}
function makeCafe(parent,x,z,scale=1) {
  const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);parent.add(g);
  addMesh(g,box(5.5,2.65,.4,mat(0xe0d0b4),0,1.35,-.1));
  addMesh(g,box(5.8,.2,.5,mat(0x735b44),0,2.72,-.1));
  const roof=box(6.1,.16,3.2,mat(0x526f61),0,2.95,-.7);roof.rotation.x=-.04;addMesh(g,roof);
  for(const x0 of [-2.35,-1.15,1.15,2.35]){
    addMesh(g,box(.72,1.1,.07,mat(0x638f8a),x0,1.48,.13));
    addMesh(g,box(.78,.08,.1,mat(0x8d7355),x0,1.48,.18));
  }
  addMesh(g,box(5.2,.14,.3,mat(0x806448),0,.75,.25));
  addCollider(x,z-.3,3.05,1.5,"cafe");
}
function makeUmbrella(parent,x,z,scale=1) {
  const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);parent.add(g);
  addMesh(g,cylinder(.055,.07,2.05,mat(0x785f44),0,1.02,0,8));
  const canopy=new THREE.Mesh(new THREE.ConeGeometry(1.12,.4,12),mat(0xd77956));canopy.position.y=2.03;canopy.rotation.y=.2;canopy.castShadow=true;g.add(canopy);
  addMesh(g,cylinder(.36,.36,.09,mat(0xeee0c2),0,.08,0,12));
  addCollider(x,z,.35,.35,"umbrella");
}
function makeLantern(parent,x,z) {
  const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
  addMesh(g,cylinder(.035,.04,2.4,mat(0x594735),0,1.2,0,8));
  const lamp=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),new THREE.MeshBasicMaterial({color:0xffd48b}));lamp.position.set(0,2.36,0);g.add(lamp);
  const light=new THREE.PointLight(0xffc97a,.45,5);light.position.set(0,2.35,0);g.add(light);
}
function makePot(parent,x,z) {
  const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
  addMesh(g,cylinder(.28,.2,.38,mat(0xa9684f),0,.19,0,12));
  addMesh(g,cylinder(.22,.24,.06,mat(0x473c2c),0,.4,0,12));
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const leaf=box(.06,.48,.08,mat(i%2?0x4f8b5a:0x679765),Math.sin(a)*.1,.65,Math.cos(a)*.1);leaf.rotation.z=Math.sin(a)*.4;addMesh(g,leaf);}
  addCollider(x,z,.32,.32,"pot");
}
function makeShell(parent,x,z) {
  const m=sphere(.14,mat(0xffead0),x,.08,z,[1,.38,.7]);m.rotation.y=Math.random()*2;parent.add(m);
}
function addEnvironment(config) {
  const groundMat=mat(config.ground,.98);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(100,100),groundMat);
  ground.rotation.x=-Math.PI/2;ground.position.y=-.06;ground.receiveShadow=true;worldGroup.add(ground);
  if(config.id==="pantai"){
    const seaMat=new THREE.MeshStandardMaterial({color:0x3f9da8,roughness:.32,metalness:.08,transparent:true,opacity:.94});
    waterMesh=new THREE.Mesh(new THREE.PlaneGeometry(100,100),seaMat);waterMesh.rotation.x=-Math.PI/2;waterMesh.position.set(0,-.035,-24);worldGroup.add(waterMesh);
    const shore=box(100,.025,12,mat(0xd4c28e),0,-.01,-8);worldGroup.add(shore);
    const foamMat=mat(0xd8eee0);
    for(let i=0;i<8;i++){const foam=box(18,.02,.06,foamMat,(i%2?2:-2),.01,-3.5-i*.75);foam.rotation.y=(i%2?.06:-.06);worldGroup.add(foam);}
  }else{
    const path=box(3.2,.018,22,mat(config.path),0,.005,1.5);worldGroup.add(path);
    const cross=box(18,.018,2.1,mat(config.path),0,.006,1);worldGroup.add(cross);
  }
  // Boundary details keep the scene readable while leaving a broad play area.
  const edgeMat=mat(config.id==="pantai"?0xbba578:0x526a51);
  for(const x of [-12,12]){
    const hedge=box(.22,.7,20,edgeMat,x,.3,0);worldGroup.add(hedge);
  }
  for(const z of [-10,10]){
    const hedge=box(24,.55,.22,edgeMat,0,.25,z);worldGroup.add(hedge);
  }
}
function addObject(config) {
  const {kind,x,z,scale=1,rotation=0}=config;
  if(kind==="tree")return makeTree(worldGroup,x,z,scale,false);
  if(kind==="palm")return makeTree(worldGroup,x,z,scale,true);
  if(kind==="table")return makeTable(worldGroup,x,z,scale);
  if(kind==="bench")return makeBench(worldGroup,x,z,rotation);
  if(kind==="stall")return makeStall(worldGroup,x,z,scale);
  if(kind==="cafe")return makeCafe(worldGroup,x,z,scale);
  if(kind==="umbrella")return makeUmbrella(worldGroup,x,z,scale);
  if(kind==="lantern")return makeLantern(worldGroup,x,z);
  if(kind==="pot")return makePot(worldGroup,x,z);
  if(kind==="shell")return makeShell(worldGroup,x,z);
}
function clearWorld() {
  if(worldGroup){
    scene.remove(worldGroup);
    worldGroup.traverse(o=>{
      if(o.geometry)o.geometry.dispose();
      if(o.material&&!Object.values(materials).includes(o.material)){
        for(const m of(Array.isArray(o.material)?o.material:[o.material]))m.dispose();
      }
    });
  }
  if(avatarRoot)scene.remove(avatarRoot);
  colliders.length=0;waterMesh=null;
}
function buildScene(sceneId) {
  const config=SCENES[sceneId];if(!config)throw new Error("Konfigurasi tempat tidak ditemukan: "+sceneId);
  clearWorld();
  activeSceneId=sceneId;
  scene.background=new THREE.Color(config.sky);
  scene.fog.color.setHex(config.fog);
  worldGroup=new THREE.Group();worldGroup.name="World:"+config.id;scene.add(worldGroup);
  addEnvironment(config);
  for(const object of config.objects)addObject(object);
  const hemi=new THREE.HemisphereLight(config.ambient,config.ground,2.1);worldGroup.add(hemi);
  sunLight=new THREE.DirectionalLight(config.sun,2.4);sunLight.position.set(-7,13,7);sunLight.castShadow=window.innerWidth>760;
  sunLight.shadow.mapSize.set(1024,1024);sunLight.shadow.camera.left=-18;sunLight.shadow.camera.right=18;sunLight.shadow.camera.top=18;sunLight.shadow.camera.bottom=-18;worldGroup.add(sunLight);
  const fill=new THREE.DirectionalLight(0xffffff,.48);fill.position.set(7,5,-5);worldGroup.add(fill);
  makeAvatar();
  avatarRoot.position.set(0,0,4.5);
  playerVelocity.set(0,0,0);
  cameraYaw=.55;cameraPitch=.42;
  $("scene-title").textContent=config.title;
  $("scene-subtitle").textContent=config.subtitle;
  $("caption-icon").textContent=config.captionIcon;
  $("caption-title").textContent=config.captionTitle;
  $("caption-text").textContent=config.captionText;
  document.querySelectorAll("[data-scene]").forEach(button=>{
    const active=button.dataset.scene===sceneId;
    button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));
  });
  stateLabel.textContent=config.mood+" · simulasi lokal";
  setProgress(100,"World Engine aktif","Tiga scene memakai satu renderer dan satu kontrak konfigurasi.");
  updateCamera(1);
}
function collides(x,z) {
  const r=WORLD_RULES.avatarRadius;
  if(x<WORLD_RULES.bounds.minX+r||x>WORLD_RULES.bounds.maxX-r||z<WORLD_RULES.bounds.minZ+r||z>WORLD_RULES.bounds.maxZ-r)return true;
  for(const c of colliders){
    const dx=x-c.x,dz=z-c.z;
    if(Math.abs(dx)<c.rx+r*.65&&Math.abs(dz)<c.rz+r*.65)return true;
  }
  return false;
}
function updateMovement(dt,now) {
  const forward=(keys.has("KeyW")||keys.has("ArrowUp")?1:0)-(keys.has("KeyS")||keys.has("ArrowDown")?1:0);
  const side=(keys.has("KeyD")||keys.has("ArrowRight")?1:0)-(keys.has("KeyA")||keys.has("ArrowLeft")?1:0);
  const running=keys.has("ShiftLeft")||keys.has("ShiftRight");
  const input=new THREE.Vector3(side,0,-forward);
  if(input.lengthSq()>0){
    input.normalize();
    const speed=running?WORLD_RULES.runSpeed:WORLD_RULES.movementSpeed;
    const direction=new THREE.Vector3(input.x,0,input.z).applyAxisAngle(new THREE.Vector3(0,1,0),cameraYaw);
    const nx=avatarRoot.position.x+direction.x*speed*dt;
    const nz=avatarRoot.position.z+direction.z*speed*dt;
    // Resolve each axis separately so the avatar slides along a blocked surface.
    let moved=false;
    if(!collides(nx,avatarRoot.position.z)){avatarRoot.position.x=nx;moved=true;}
    if(!collides(avatarRoot.position.x,nz)){avatarRoot.position.z=nz;moved=true;}
    if(moved){
      avatarRoot.rotation.y=Math.atan2(direction.x,direction.z);
      avatar.walkTime+=dt*(running?12:8);
      avatar.leftLeg.rotation.x=Math.sin(avatar.walkTime)*.52;
      avatar.rightLeg.rotation.x=-Math.sin(avatar.walkTime)*.52;
      avatar.leftArm.rotation.x=-Math.sin(avatar.walkTime)*.35;
      avatar.rightArm.rotation.x=Math.sin(avatar.walkTime)*.35;
    }else if(now-lastToastAt>1800){showToast("Jalur terhalang — coba arah lain");}
  }else{
    avatar.leftLeg.rotation.x=THREE.MathUtils.damp(avatar.leftLeg.rotation.x,0,9,dt);
    avatar.rightLeg.rotation.x=THREE.MathUtils.damp(avatar.rightLeg.rotation.x,0,9,dt);
    avatar.leftArm.rotation.x=THREE.MathUtils.damp(avatar.leftArm.rotation.x,0,9,dt);
    avatar.rightArm.rotation.x=THREE.MathUtils.damp(avatar.rightArm.rotation.x,0,9,dt);
  }
  if(now-lastUiAt>140){
    $("position-readout").textContent="Posisi "+avatarRoot.position.x.toFixed(1)+" · "+avatarRoot.position.z.toFixed(1);
    lastUiAt=now;
  }
}
function updateCamera(dt) {
  if(!avatarRoot)return;
  const target=avatarRoot.position.clone().add(new THREE.Vector3(0,1.05,0));
  const horizontal=Math.cos(cameraPitch)*cameraDistance;
  const offset=new THREE.Vector3(Math.sin(cameraYaw)*horizontal,Math.sin(cameraPitch)*cameraDistance,Math.cos(cameraYaw)*horizontal);
  camera.position.lerp(target.clone().add(offset),1-Math.exp(-8*Math.max(dt,.001)));
  camera.lookAt(target);
}
function onResize() {
  if(!renderer||!camera)return;
  const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);
  camera.aspect=w/h;camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
  renderer.setSize(w,h,false);
  renderer.shadowMap.enabled=window.innerWidth>760;
  if(sunLight)sunLight.castShadow=window.innerWidth>760;
}
function animate(now) {
  if(!isRunning)return;
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.04);
  updateMovement(dt,now);
  updateCamera(dt);
  if(waterMesh)waterMesh.position.x=Math.sin(now*.00025)*.2;
  renderer.render(scene,camera);
}
function bindControls() {
  window.addEventListener("keydown",e=>{
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code))e.preventDefault();
    keys.add(e.code);
  },{passive:false});
  window.addEventListener("keyup",e=>keys.delete(e.code));
  window.addEventListener("blur",()=>keys.clear());
  stage.addEventListener("pointerdown",e=>{
    if(e.target.closest("button"))return;
    dragPointer=e.pointerId;lastPointer={x:e.clientX,y:e.clientY};cameraDragging=true;
    stage.setPointerCapture?.(e.pointerId);
  });
  stage.addEventListener("pointermove",e=>{
    if(!cameraDragging||dragPointer!==e.pointerId)return;
    const dx=e.clientX-lastPointer.x,dy=e.clientY-lastPointer.y;
    cameraYaw-=dx*.006;cameraPitch=THREE.MathUtils.clamp(cameraPitch+dy*.004,-.05,1.05);
    lastPointer={x:e.clientX,y:e.clientY};
  });
  const endDrag=e=>{if(dragPointer===e.pointerId){cameraDragging=false;dragPointer=null;}};
  stage.addEventListener("pointerup",endDrag);stage.addEventListener("pointercancel",endDrag);
  document.querySelectorAll("[data-scene]").forEach(button=>button.addEventListener("click",()=>{
    if(button.dataset.scene===activeSceneId)return;
    try{buildScene(button.dataset.scene);showToast("Memasuki "+SCENES[button.dataset.scene].title); }
    catch(error){console.error("Gagal mengganti scene",error);showToast("Tempat belum dapat dimuat. Silakan coba lagi.");}
  }));
  $("camera-button").addEventListener("click",()=>{cameraYaw=.55;cameraPitch=.42;showToast("Sudut kamera diatur ulang");});
  $("help-button").addEventListener("click",()=>$("help-dialog").showModal());
  $("fullscreen-button").addEventListener("click",async()=>{
    try{if(!document.fullscreenElement)await stage.requestFullscreen();else await document.exitFullscreen();}
    catch{showToast("Layar penuh tidak didukung browser ini.");}
  });
  $("sound-toggle").addEventListener("click",()=>showToast("Audio ambient belum diaktifkan pada MVP."));
  $("profile-button").addEventListener("click",()=>{window.location.href="/community.html";});
  window.addEventListener("resize",onResize);
  if("ResizeObserver"in window)new ResizeObserver(onResize).observe(stage);
}
function reportFatal(error) {
  console.error("RUANG KITA World Engine gagal dimulai:",error);
  statusLabel.textContent="Perlu pemeriksaan";
  stateLabel.textContent="Mesin dunia belum siap";
  loading.classList.remove("hidden");
  loading.innerHTML='<strong>Dunia belum dapat dimuat</strong><span>Periksa koneksi modul 3D lalu muat ulang halaman.</span>';
  setProgress(0,"Inisialisasi gagal","Ada masalah saat menjalankan renderer. Detail tercatat di console browser.");
}
async function start() {
  setProgress(15,"Memuat renderer","Menyiapkan WebGL dan kamera.");
  try{
    createRenderer();
    setProgress(38,"Membangun scene","Menyusun lingkungan prosedural dan avatar.");
    buildScene(activeSceneId);
    bindControls();
    isRunning=true;requestAnimationFrame(animate);
    statusLabel.textContent="Dunia aktif";
    stateLabel.textContent="Dunia 3D berjalan · lokal";
    loading.classList.add("hidden");
    window.setTimeout(()=>loading.remove(),700);
    setProgress(100,"Siap dijelajahi","Renderer aktif. Tiga scene tersedia; akun dan multiplayer belum diaktifkan.");
  }catch(error){reportFatal(error);}
}
window.addEventListener("unhandledrejection",e=>console.error("Promise gagal:",e.reason));
window.RUANG_KITA_NEXT=Object.freeze({
  version:"next-phase-1",
  engine:"Three.js",
  sceneIds:Object.freeze(Object.keys(SCENES)),
  activeScene:()=>activeSceneId,
  simulation:WORLD_RULES.simulation,
  diagnostics:()=>({renderer:!!renderer,webgl:!!renderer?.getContext(),sceneObjects:scene?.children?.length||0,avatar:!!avatarRoot,activeScene:activeSceneId,position:avatarRoot?{x:Number(avatarRoot.position.x.toFixed(2)),z:Number(avatarRoot.position.z.toFixed(2))}:null,pressedKeys:[...keys]})
});
start();