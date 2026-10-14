import * as THREE from "three";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/loaders/GLTFLoader.js";
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
const npcs = [];
const vehicles = [];
const materials = {};
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const loadedWorldAssets = new Map();
const loadingWorldAssets = new Map();
const worldAssetMixers = new Map();
const worldAssetFailures = [];
let worldAiLastAt = 0, worldLastAuditAt = 0, worldAuditSnapshot = {severity:"clear",issueCount:0,issues:[],counts:{}};
let worldRenderFrames = 0, worldLastFrameAt = 0, worldLastRenderError = null, worldLastWarningAt = 0, worldLastGreetingAt = 0, worldRepairCount = 0, worldLastRepairAt = null;
const worldRepairEvents = [];
const worldAgentState = [
  {id:"observer",name:"Observer",status:"MEMULAI",detail:"Menyiapkan observasi dunia",updatedAt:null},
  {id:"predictor",name:"Prediktor",status:"MEMULAI",detail:"Menyiapkan prediksi lintasan",updatedAt:null},
  {id:"planner",name:"Behavior Planner",status:"MEMULAI",detail:"Menyiapkan rencana gerak",updatedAt:null},
  {id:"sceneBuilder",name:"Scene Builder",status:"MEMULAI",detail:"Menyiapkan konfigurasi scene",updatedAt:null},
  {id:"repair",name:"Repair Agent",status:"MEMULAI",detail:"Menyiapkan pemulihan aman",updatedAt:null},
  {id:"auditor",name:"Anomaly Auditor",status:"MEMULAI",detail:"Menyiapkan pemeriksaan anomali",updatedAt:null},
  {id:"resource",name:"Resource Guard",status:"MEMULAI",detail:"Menyiapkan batas resource",updatedAt:null}
];
function setWorldAgentState(id,status,detail){
  const agent=worldAgentState.find(item=>item.id===id);if(!agent)return;
  agent.status=status;agent.detail=String(detail||"").slice(0,180);agent.updatedAt=new Date().toISOString();
}
function getWorldAgentSnapshot(){return worldAgentState.map(agent=>({...agent}));}
function refreshWorldAgentPanel(){
  const list=$("world-agent-list"),summary=$("world-agent-summary");if(!list||!summary)return;
  const warning=worldAgentState.filter(agent=>agent.status==="WASPADA"||agent.status==="MEMULIHKAN").length;
  summary.textContent=warning?warning+" agen sedang menangani temuan · mode lokal":worldAgentState.length+" agen lokal berjalan · tanpa LLM tiap frame";
  const rows=worldAgentState.map(agent=>{
    const row=document.createElement("div");row.className="world-agent-row"+(["WASPADA","MEMULIHKAN"].includes(agent.status)?" warning":"");row.title=agent.detail;
    const name=document.createElement("strong");name.textContent=agent.name;
    const status=document.createElement("span");status.className="world-agent-state";status.textContent=agent.status;
    row.append(name,status);return row;
  });
  list.replaceChildren(...rows);
}

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
async function loadWorldGltf(assetKey,url,options={}) {
  if(typeof assetKey!=="string"||!assetKey.trim()||typeof url!=="string"||!url.trim())throw new Error("ID aset dan URL glTF/GLB wajib diisi.");
  if(loadedWorldAssets.has(assetKey))return loadedWorldAssets.get(assetKey).root;
  if(loadingWorldAssets.has(assetKey))return loadingWorldAssets.get(assetKey);
  const assetSceneId=String(options.sceneId||activeSceneId);
  const task=(async()=>{
    try{
      const gltf=await gltfLoader.loadAsync(url);
      const root=gltf.scene||gltf.scenes?.[0];
      if(!root)throw new Error("Aset tidak memiliki scene yang dapat dirender.");
      root.name=assetKey;
      const p=Array.isArray(options.position)?options.position:[0,0,0];
      root.position.set(...[0,1,2].map(i=>Number.isFinite(Number(p[i]))?Number(p[i]):0));
      const scale=Number(options.scale);
      root.scale.setScalar(Number.isFinite(scale)&&scale>0?scale:1);
      if(Array.isArray(options.rotation))root.rotation.set(...[0,1,2].map(i=>Number.isFinite(Number(options.rotation[i]))?Number(options.rotation[i]):0));
      if(Number.isFinite(Number(options.groundY))){const bounds=new THREE.Box3().setFromObject(root);if(!bounds.isEmpty())root.position.y+=Number(options.groundY)-bounds.min.y;}
      root.traverse(node=>{if(node.isMesh){node.castShadow=true;node.receiveShadow=true;for(const m of(Array.isArray(node.material)?node.material:node.material?[node.material]:[]))m.needsUpdate=true;}});
      root.visible=assetSceneId===activeSceneId;
      let mixer=null;
      const clips=Array.isArray(gltf.animations)?gltf.animations:[];
      if(clips.length&&options.playAnimations!==false){
        mixer=new THREE.AnimationMixer(root);
        const requested=String(options.animation||"");
        const selected=requested==="all"?clips:(clips.filter(c=>c.name===requested).slice(0,1));
        const playable=selected.length?selected:[clips[0]];
        for(const clip of playable)mixer.clipAction(clip).reset().play();
        if(playable.length)worldAssetMixers.set(assetKey,mixer);
      }
      scene.add(root);
      let safeUrl=String(url);try{const parsed=new URL(url,window.location.href);safeUrl=parsed.origin+parsed.pathname;}catch{}
      loadedWorldAssets.set(assetKey,{root,sceneId:assetSceneId,persistent:options.persistent===true,gltf,mixer,animationNames:clips.map(c=>String(c.name||"unnamed").slice(0,100)),sourceUrl:safeUrl,license:String(options.license||"unspecified").slice(0,100),attribution:String(options.attribution||"").slice(0,240)});
      for(let i=worldAssetFailures.length-1;i>=0;i--)if(worldAssetFailures[i].assetKey===assetKey)worldAssetFailures.splice(i,1);
      if(worldLastRenderError?.startsWith("Aset "+assetKey+" gagal dimuat:"))worldLastRenderError=null;
      return root;
    }catch(error){
      worldAssetFailures.push({assetKey,message:String(error?.message||error).slice(0,180),at:new Date().toISOString()});
      if(worldAssetFailures.length>20)worldAssetFailures.shift();
      worldLastRenderError="Aset "+assetKey+" gagal dimuat: "+String(error?.message||error).slice(0,120);
      if(performance.now()-worldLastWarningAt>2500){showToast("Aset 3D gagal dimuat. Periksa URL, CORS, dan format GLB/glTF.");worldLastWarningAt=performance.now();}
      throw error;
    }finally{loadingWorldAssets.delete(assetKey);}
  })();
  loadingWorldAssets.set(assetKey,task);
  return task;
}
function removeWorldGltf(assetKey){
  const entry=loadedWorldAssets.get(assetKey);if(!entry)return false;
  const root=entry.root,mixer=worldAssetMixers.get(assetKey);
  if(mixer){mixer.stopAllAction();mixer.uncacheRoot(root);worldAssetMixers.delete(assetKey);}
  scene.remove(root);
  const textures=new Set(),materialsToDispose=new Set();
  root.traverse(node=>{
    if(node.geometry)node.geometry.dispose();
    for(const material of(Array.isArray(node.material)?node.material:node.material?[node.material]:[])){
      materialsToDispose.add(material);
      for(const value of Object.values(material))if(value?.isTexture)textures.add(value);
      if(material.uniforms)for(const uniform of Object.values(material.uniforms))if(uniform?.value?.isTexture)textures.add(uniform.value);
    }
  });
  for(const texture of textures)texture.dispose();
  for(const material of materialsToDispose)material.dispose();
  loadedWorldAssets.delete(assetKey);return true;
}
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
function makeNpc(id,x,z){
  const root=new THREE.Group();root.name="NPC:"+id;
  const skin=mat(id%2?0xc98f68:0xdeb08a),shirt=mat([0x477e68,0xc36d55,0x647eaa,0xb99a4d][id%4]),pants=mat(0x35413c);
  addMesh(root,cylinder(.17,.21,.53,shirt,0,.93,0,12));addMesh(root,sphere(.17,skin,0,1.36,0));addMesh(root,sphere(.175,mat(0x302720),0,1.47,-.015,[1,.48,1]));
  const leftArm=cylinder(.055,.065,.36,shirt,-.25,1.02,0,8),rightArm=cylinder(.055,.065,.36,shirt,.25,1.02,0,8);leftArm.rotation.z=-.18;rightArm.rotation.z=.18;addMesh(root,leftArm);addMesh(root,rightArm);
  const leftLeg=cylinder(.065,.075,.39,pants,-.105,.39,0,8),rightLeg=cylinder(.065,.075,.39,pants,.105,.39,0,8);addMesh(root,leftLeg);addMesh(root,rightLeg);
  root.position.set(x,0,z);root.userData={id,name:["Rani","Dito","Mira","Bayu","Nisa"][id%5],radius:.34,speed:.7+(id%3)*.12,goal:null,nextThinkAt:0,blockedFor:0,walkTime:0,leftLeg,rightLeg,leftArm,rightArm,safetyHoldUntil:0,lastSafeX:x,lastSafeZ:z,socialUntil:0,socialCooldown:0};worldGroup.add(root);npcs.push(root);return root;
}
function spawnNpcs(){npcs.length=0;[[-5.1,6.2],[5.1,6.2],[0,7.4]].forEach((p,i)=>makeNpc(i,p[0],p[1]));}
function makeVehicle(id,x,z,direction,kind="mobil"){
  const root=new THREE.Group();root.name=(kind==="motorcycle"?"Motor:":"Mobil:")+id;
  const paint=mat(id%2?0x6b8f88:0xc66e51,.42,.12),glass=mat(0x9dc5c7,.25,.08),rubber=mat(0x252a29,.8);
  const wheels=[];
  if(kind==="motorcycle"){
    for(const wz of [-.43,.43]){const wheel=cylinder(.19,.19,.1,rubber,0,.19,wz,12);wheel.rotation.z=Math.PI/2;addMesh(root,wheel);wheels.push(wheel);}
    addMesh(root,box(.24,.15,.64,paint,0,.43,0));
    addMesh(root,box(.29,.12,.27,paint,0,.57,-.08));
    addMesh(root,box(.3,.08,.22,rubber,0,.64,-.22));
    const fork=cylinder(.025,.035,.42,mat(0x8b9b98,.35,.6),0,.39,.31,8);fork.rotation.x=-.22;addMesh(root,fork);
    addMesh(root,cylinder(.025,.025,.38,rubber,0,.68,.36,8));
    addMesh(root,box(.28,.045,.055,rubber,0,.83,.32));
    addMesh(root,sphere(.075,mat(0xf5e5b2,.3),0,.53,.34,[1,.75,.5]));
    addMesh(root,cylinder(.12,.16,.34,mat(id%2?0x385f50:0x7e4c39),0,.91,-.02,10));
    addMesh(root,sphere(.115,mat(0xc98f68),0,1.16,-.02));
    const armL=cylinder(.035,.045,.32,mat(0xc98f68),-.13,.85,.18,8),armR=cylinder(.035,.045,.32,mat(0xc98f68),.13,.85,.18,8);armL.rotation.x=-.8;armL.rotation.z=-.35;armR.rotation.x=-.8;armR.rotation.z=.35;addMesh(root,armL);addMesh(root,armR);
  }else{
    addMesh(root,box(1.04,.42,1.72,paint,0,.43,0));addMesh(root,box(.78,.37,.78,glass,0,.78,-.12));
    for(const wx of [-.49,.49])for(const wz of [-.52,.52]){const wheel=cylinder(.17,.17,.1,rubber,wx,.22,wz,12);wheel.rotation.z=Math.PI/2;addMesh(root,wheel);wheels.push(wheel);}
    addMesh(root,box(.2,.09,.035,mat(0xf6df9b),0,.42,.87,false));
  }
  root.position.set(x,0,z);root.rotation.y=direction>0?0:Math.PI;
  const motorcycle=kind==="motorcycle";
  root.userData={id,kind,halfWidth:motorcycle ? .34 : .56,halfLength:motorcycle ? .62 : .94,speed:motorcycle?1.08:.9+(id%2)*.18,direction,minZ:motorcycle?-1.7:-7.7,maxZ:motorcycle?1.7:7.7,safetyHoldUntil:0,lastSafeX:x,lastSafeZ:z,wheels};
  worldGroup.add(root);vehicles.push(root);return root;
}
function spawnVehicles(){vehicles.length=0;if(activeSceneId==="pantai")return;makeVehicle(0,-9.35,-5.8,1,"mobil");makeVehicle(1,9.35,5.8,-1,"mobil");makeVehicle(2,-7.2,-1.4,1,"motorcycle");makeVehicle(3,7.2,1.4,-1,"motorcycle");}
function isPositionBlocked(x,z,radius,options={}){
  if(x<WORLD_RULES.bounds.minX+radius||x>WORLD_RULES.bounds.maxX-radius||z<WORLD_RULES.bounds.minZ+radius||z>WORLD_RULES.bounds.maxZ-radius)return true;
  for(const c of colliders)if(Math.abs(x-c.x)<c.rx+radius*.65&&Math.abs(z-c.z)<c.rz+radius*.65)return true;
  for(const v of vehicles){if(v===options.ignoreVehicle)continue;const u=v.userData;if(Math.abs(x-v.position.x)<u.halfWidth+radius&&Math.abs(z-v.position.z)<u.halfLength+radius)return true;}
  for(const npc of npcs){if(npc===options.ignoreNpc)continue;if(Math.hypot(x-npc.position.x,z-npc.position.z)<radius+npc.userData.radius)return true;}
  if(!options.ignoreAvatar&&avatarRoot&&Math.hypot(x-avatarRoot.position.x,z-avatarRoot.position.z)<radius+WORLD_RULES.avatarRadius)return true;
  return false;
}
function vehicleCanMove(vehicle,x,z){
  const u=vehicle.userData;if(x<WORLD_RULES.bounds.minX+u.halfWidth||x>WORLD_RULES.bounds.maxX-u.halfWidth||z<WORLD_RULES.bounds.minZ+u.halfLength||z>WORLD_RULES.bounds.maxZ-u.halfLength)return false;
  for(const c of colliders)if(Math.abs(x-c.x)<u.halfWidth+c.rx&&Math.abs(z-c.z)<u.halfLength+c.rz)return false;
  for(const npc of npcs){const n=npc.userData;if(Math.abs(x-npc.position.x)<u.halfWidth+n.radius&&Math.abs(z-npc.position.z)<u.halfLength+n.radius)return false;}
  if(avatarRoot&&Math.abs(x-avatarRoot.position.x)<u.halfWidth+WORLD_RULES.avatarRadius&&Math.abs(z-avatarRoot.position.z)<u.halfLength+WORLD_RULES.avatarRadius)return false;
  for(const other of vehicles){if(other===vehicle)continue;const o=other.userData;if(Math.abs(x-other.position.x)<u.halfWidth+o.halfWidth&&Math.abs(z-other.position.z)<u.halfLength+o.halfLength)return false;}
  return true;
}
function worldAiAudit(){
  const counts={vehicleVehicle:0,vehicleStatic:0,vehicleNpc:0,vehicleAvatar:0,npcStatic:0,npcNpc:0,npcAvatar:0,stuckNpcs:0,blockedGoals:0,renderStale:0,assetFailures:worldAssetFailures.length,unverifiedAssetLicenses:0},issues=[];
  for(let i=0;i<vehicles.length;i++)for(let j=i+1;j<vehicles.length;j++){const a=vehicles[i],b=vehicles[j],u=a.userData,v=b.userData;if(Math.abs(a.position.x-b.position.x)<u.halfWidth+v.halfWidth-.03&&Math.abs(a.position.z-b.position.z)<u.halfLength+v.halfLength-.03){counts.vehicleVehicle++;issues.push({severity:"high",type:"vehicle-overlap",entities:[u.id,v.id]});}}
  for(const vehicle of vehicles){const u=vehicle.userData;for(const c of colliders)if(Math.abs(vehicle.position.x-c.x)<u.halfWidth+c.rx-.04&&Math.abs(vehicle.position.z-c.z)<u.halfLength+c.rz-.04){counts.vehicleStatic++;issues.push({severity:"high",type:"vehicle-static-overlap",collider:c.tag});}for(const npc of npcs)if(Math.abs(vehicle.position.x-npc.position.x)<u.halfWidth+npc.userData.radius-.04&&Math.abs(vehicle.position.z-npc.position.z)<u.halfLength+npc.userData.radius-.04){counts.vehicleNpc++;issues.push({severity:"high",type:"vehicle-npc-overlap",entity:npc.userData.name});}if(Math.abs(vehicle.position.x-avatarRoot.position.x)<u.halfWidth+WORLD_RULES.avatarRadius-.04&&Math.abs(vehicle.position.z-avatarRoot.position.z)<u.halfLength+WORLD_RULES.avatarRadius-.04){counts.vehicleAvatar++;issues.push({severity:"high",type:"vehicle-avatar-overlap"});}}
  for(let i=0;i<npcs.length;i++)for(let j=i+1;j<npcs.length;j++){const a=npcs[i],b=npcs[j];if(Math.hypot(a.position.x-b.position.x,a.position.z-b.position.z)<a.userData.radius+b.userData.radius-.04){counts.npcNpc++;issues.push({severity:"medium",type:"npc-overlap",entities:[a.userData.name,b.userData.name]});}}
  for(const npc of npcs){const u=npc.userData;for(const c of colliders)if(Math.abs(npc.position.x-c.x)<c.rx+u.radius*.65-.02&&Math.abs(npc.position.z-c.z)<c.rz+u.radius*.65-.02){counts.npcStatic++;issues.push({severity:"medium",type:"npc-static-overlap",entity:u.name,collider:c.tag});}if(Math.hypot(npc.position.x-avatarRoot.position.x,npc.position.z-avatarRoot.position.z)<u.radius+WORLD_RULES.avatarRadius-.04){counts.npcAvatar++;issues.push({severity:"medium",type:"npc-avatar-overlap",entity:u.name});}if(u.blockedFor>2.5){counts.stuckNpcs++;issues.push({severity:"low",type:"npc-stuck",entity:u.name,seconds:+u.blockedFor.toFixed(1)});}if(u.goal&&isPositionBlocked(u.goal.x,u.goal.z,u.radius,{ignoreNpc:npc})){counts.blockedGoals++;issues.push({severity:"low",type:"npc-goal-blocked",entity:u.name});}}
  if(worldLastFrameAt&&performance.now()-worldLastFrameAt>2500){counts.renderStale++;issues.push({severity:"medium",type:"render-loop-stale",ageMs:Math.round(performance.now()-worldLastFrameAt)});}
  if(worldAssetFailures.length)issues.push({severity:"medium",type:"asset-load-failure",count:worldAssetFailures.length,last:worldAssetFailures[worldAssetFailures.length-1]?.assetKey||"asset"});
  for(const [id,entry] of loadedWorldAssets)if(entry.license==="unspecified"){counts.unverifiedAssetLicenses++;issues.push({severity:"low",type:"asset-license-unverified",asset:id});}
  if(worldLastRenderError)issues.push({severity:"medium",type:"renderer-error",message:worldLastRenderError.slice(0,100)});
  const severity=issues.some(i=>i.severity==="high")?"high":issues.some(i=>i.severity==="medium")?"medium":issues.length?"low":"clear";
  return {at:new Date().toISOString(),scene:activeSceneId,severity,issueCount:issues.length,counts,issues:issues.slice(0,30)};
}
function repairWorldAnomalies(now){
  let repaired=0;
  const remember=(type,id)=>{worldRepairCount++;worldLastRepairAt=new Date().toISOString();worldRepairEvents.push({at:worldLastRepairAt,type,id});if(worldRepairEvents.length>30)worldRepairEvents.shift();repaired++;};
  for(const vehicle of vehicles){
    const u=vehicle.userData;
    if(vehicleCanMove(vehicle,vehicle.position.x,vehicle.position.z))continue;
    let target=null;
    const candidates=[[u.lastSafeX,u.lastSafeZ],[u.lastSafeX,u.lastSafeZ+.65],[u.lastSafeX,u.lastSafeZ-.65],[u.lastSafeX-.65,u.lastSafeZ],[u.lastSafeX+.65,u.lastSafeZ],[u.lastSafeX,u.lastSafeZ+1.3],[u.lastSafeX,u.lastSafeZ-1.3]];
    for(const p of candidates)if(vehicleCanMove(vehicle,p[0],p[1])){target=p;break;}
    if(target){vehicle.position.set(target[0],0,target[1]);u.lastSafeX=target[0];u.lastSafeZ=target[1];}
    u.safetyHoldUntil=now+500;remember("vehicle-recovery",String(u.id));
  }
  for(const npc of npcs){
    const u=npc.userData;
    if(!isPositionBlocked(npc.position.x,npc.position.z,u.radius,{ignoreNpc:npc}))continue;
    let target=null;const offsets=[[0,0],[.55,0],[-.55,0],[0,.55],[0,-.55],[1,0],[-1,0],[0,1],[0,-1],[1.4,0],[-1.4,0],[0,1.4],[0,-1.4]];
    for(const [dx,dz] of offsets){const x=u.lastSafeX+dx,z=u.lastSafeZ+dz;if(!isPositionBlocked(x,z,u.radius,{ignoreNpc:npc})){target=[x,z];break;}}
    if(target){npc.position.set(target[0],0,target[1]);u.lastSafeX=target[0];u.lastSafeZ=target[1];u.goal=null;u.blockedFor=0;u.socialUntil=0;u.nextThinkAt=now+500;remember("npc-recovery",u.name);}
  }
  if(repaired&&now-worldLastWarningAt>2500){showToast("World Guard memulihkan "+repaired+" posisi yang tidak aman.");worldLastWarningAt=now;}
  return repaired;
}
function worldAiPredict(now){
  if(now-worldAiLastAt<180)return;worldAiLastAt=now;
  let predictedConflicts=0;
  for(const vehicle of vehicles){
    const u=vehicle.userData;
    if(now<(u.safetyHoldUntil||0)){predictedConflicts++;continue;}
    const nz=THREE.MathUtils.clamp(vehicle.position.z+u.direction*u.speed*.55,u.minZ,u.maxZ);
    if(!vehicleCanMove(vehicle,vehicle.position.x,nz)){u.safetyHoldUntil=now+300;predictedConflicts++;}else u.safetyHoldUntil=0;
  }
  setWorldAgentState("predictor",predictedConflicts?"WASPADA":"NORMAL",predictedConflicts+" konflik lintasan jangka pendek terdeteksi.",now);
  if(now-worldLastAuditAt>1200){
    worldLastAuditAt=now;
    setWorldAgentState("observer","AKTIF",npcs.length+" NPC, "+vehicles.length+" kendaraan, "+colliders.length+" collider dipantau.",now);
    let audit=worldAiAudit();
    setWorldAgentState("planner",audit.issueCount?"MERENCANAKAN":"SIAP",audit.issueCount?"Memilih tindakan aman untuk "+audit.issueCount+" temuan.":"Tidak ada konflik yang membutuhkan rencana koreksi.",now);
    const repaired=repairWorldAnomalies(now);
    if(repaired){audit=worldAiAudit();audit.repairedThisCycle=repaired;}
    audit.totalRepairs=worldRepairCount;worldAuditSnapshot=audit;
    setWorldAgentState("auditor",audit.severity==="clear"?"NORMAL":"WASPADA",audit.issueCount+" temuan; severity "+audit.severity+".",now);
    setWorldAgentState("repair",repaired?"MEMULIHKAN":"SIAP",repaired?repaired+" posisi dipulihkan ke lokasi aman.":"Menunggu temuan yang membutuhkan pemulihan.",now);
    const memory=renderer?.info?.memory||{geometries:0,textures:0};
    const resourceWarning=memory.geometries>1800||memory.textures>160;
    setWorldAgentState("resource",resourceWarning?"WASPADA":"NORMAL","GPU: "+memory.geometries+" geometri, "+memory.textures+" tekstur.",now);
    setWorldAgentState("observer","AKTIF","Scene "+SCENES[activeSceneId].title+"; "+npcs.length+" NPC dan "+vehicles.length+" kendaraan dipantau.",now);
    refreshWorldAgentPanel();
    if(worldAuditSnapshot.severity==="high"){statusLabel.textContent="Perlu perhatian";stateLabel.textContent="World Guard mendeteksi konflik gerak";if(now-worldLastWarningAt>4000){showToast("World Guard: gerak dihentikan untuk mencegah tabrakan.");worldLastWarningAt=now;}}
    else if(worldAuditSnapshot.severity==="clear"){statusLabel.textContent="Dunia aktif";stateLabel.textContent=SCENES[activeSceneId].mood+" · World Guard normal";}
    else{statusLabel.textContent="Memantau";stateLabel.textContent="World Guard · "+worldAuditSnapshot.issueCount+" anomali";}
  }
}
function updateWorldAgents(dt,now){
  for(const npc of npcs){const u=npc.userData,nearAvatar=Math.hypot(npc.position.x-avatarRoot.position.x,npc.position.z-avatarRoot.position.z);if(u.socialUntil>now){npc.rotation.y=Math.atan2(avatarRoot.position.x-npc.position.x,avatarRoot.position.z-npc.position.z);u.leftLeg.rotation.x=THREE.MathUtils.damp(u.leftLeg.rotation.x,0,8,dt);u.rightLeg.rotation.x=THREE.MathUtils.damp(u.rightLeg.rotation.x,0,8,dt);continue;}if(nearAvatar<1.35&&now>(u.socialCooldown||0)){u.socialUntil=now+950;u.socialCooldown=now+9500;u.goal=null;npc.rotation.y=Math.atan2(avatarRoot.position.x-npc.position.x,avatarRoot.position.z-npc.position.z);if(now-worldLastGreetingAt>3000){showToast(u.name+" menyapa Anda.");worldLastGreetingAt=now;}continue;}if(u.goal&&isPositionBlocked(u.goal.x,u.goal.z,u.radius,{ignoreNpc:npc})){u.goal=null;u.nextThinkAt=now;}if(!u.goal||now>=u.nextThinkAt||Math.hypot(u.goal.x-npc.position.x,u.goal.z-npc.position.z)<.45){let goal=null;for(let attempt=0;attempt<12&&!goal;attempt++){const x=THREE.MathUtils.clamp(npc.position.x+(Math.random()-.5)*8,-7.1,7.1),z=THREE.MathUtils.clamp(npc.position.z+(Math.random()-.5)*7,-7.2,7.2);if(!isPositionBlocked(x,z,u.radius,{ignoreNpc:npc}))goal={x,z};}u.goal=goal||{x:npc.position.x,z:npc.position.z};u.nextThinkAt=now+1800+Math.random()*1800;}
    const dx=u.goal.x-npc.position.x,dz=u.goal.z-npc.position.z,dist=Math.hypot(dx,dz);if(dist>.08){const step=Math.min(dist,u.speed*dt),nx=npc.position.x+dx/dist*step,nz=npc.position.z+dz/dist*step;let moved=false;if(!isPositionBlocked(nx,nz,u.radius,{ignoreNpc:npc})){npc.position.x=nx;npc.position.z=nz;moved=true;}else if(!isPositionBlocked(nx,npc.position.z,u.radius,{ignoreNpc:npc})){npc.position.x=nx;moved=true;}else if(!isPositionBlocked(npc.position.x,nz,u.radius,{ignoreNpc:npc})){npc.position.z=nz;moved=true;}if(moved){u.blockedFor=0;u.lastSafeX=npc.position.x;u.lastSafeZ=npc.position.z;npc.rotation.y=Math.atan2(dx,dz);u.walkTime+=dt*8;u.leftLeg.rotation.x=Math.sin(u.walkTime)*.42;u.rightLeg.rotation.x=-Math.sin(u.walkTime)*.42;u.leftArm.rotation.x=-Math.sin(u.walkTime)*.22;u.rightArm.rotation.x=Math.sin(u.walkTime)*.22;}else{u.blockedFor+=dt;if(u.blockedFor>1.2){u.goal=null;u.nextThinkAt=now+200;}}}else{u.leftLeg.rotation.x=THREE.MathUtils.damp(u.leftLeg.rotation.x,0,8,dt);u.rightLeg.rotation.x=THREE.MathUtils.damp(u.rightLeg.rotation.x,0,8,dt);}}
  for(const vehicle of vehicles){const u=vehicle.userData;if(now<(u.safetyHoldUntil||0))continue;let nz=vehicle.position.z+u.direction*u.speed*dt;if(nz>=u.maxZ||nz<=u.minZ){u.direction*=-1;nz=THREE.MathUtils.clamp(vehicle.position.z+u.direction*u.speed*dt,u.minZ,u.maxZ);vehicle.rotation.y=u.direction>0?0:Math.PI;}if(vehicleCanMove(vehicle,vehicle.position.x,nz)){vehicle.position.z=nz;u.lastSafeX=vehicle.position.x;u.lastSafeZ=nz;for(const wheel of u.wheels)wheel.rotation.x+=u.direction*u.speed*dt/.17;}else u.safetyHoldUntil=now+300;}
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
  for(const [key,entry] of [...loadedWorldAssets])if(entry.sceneId===activeSceneId&&!entry.persistent)removeWorldGltf(key);
  if(worldGroup){
    scene.remove(worldGroup);
    const disposedTextures=new Set();
    worldGroup.traverse(o=>{
      if(o.geometry)o.geometry.dispose();
      if(o.isLight&&o.shadow?.map){o.shadow.map.dispose();o.shadow.map=null;}
      if(o.isLight&&o.shadow?.mapPass){o.shadow.mapPass.dispose();o.shadow.mapPass=null;}
      if(o.material){
        for(const m of(Array.isArray(o.material)?o.material:[o.material])){
          if(Object.values(materials).includes(m))continue;
          for(const value of Object.values(m))if(value?.isTexture&&!disposedTextures.has(value)){value.dispose();disposedTextures.add(value);}
          m.dispose();
        }
      }
    });
  }
  if(avatarRoot){scene.remove(avatarRoot);avatarRoot.traverse(o=>{if(o.geometry)o.geometry.dispose();});}
  npcs.length=0;vehicles.length=0;colliders.length=0;waterMesh=null;
  worldLastAuditAt=0;worldAiLastAt=0;worldAuditSnapshot={severity:"clear",issueCount:0,issues:[],counts:{}};
}
function buildScene(sceneId) {
  const config=SCENES[sceneId];if(!config)throw new Error("Konfigurasi tempat tidak ditemukan: "+sceneId);
  clearWorld();
  activeSceneId=sceneId;
  for(const entry of loadedWorldAssets.values())entry.root.visible=entry.sceneId===sceneId;
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
  spawnNpcs();
  spawnVehicles();
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
  setProgress(100,"World Engine + World Guard aktif","Tiga scene, tujuh agen lokal, collision guard, prediksi, dan pemulihan terkontrol.");
  setWorldAgentState("sceneBuilder","SIAP","Scene "+config.title+" berhasil dibangun.");
  refreshWorldAgentPanel();
  updateCamera(1);
}
function collides(x,z) {
  return isPositionBlocked(x,z,WORLD_RULES.avatarRadius,{ignoreAvatar:true});
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
  for(const mixer of worldAssetMixers.values())mixer.update(dt);
  worldAiPredict(now);
  updateWorldAgents(dt,now);
  updateMovement(dt,now);
  updateCamera(dt);
  if(waterMesh)waterMesh.position.x=Math.sin(now*.00025)*.2;
  try{renderer.render(scene,camera);worldRenderFrames++;worldLastFrameAt=performance.now();worldLastRenderError=null;}
  catch(error){worldLastRenderError=String(error?.message||error).slice(0,180);if(now-worldLastWarningAt>4000){showToast("Renderer mengalami gangguan. World Guard mencatatnya.");worldLastWarningAt=now;}}
}
function getWorldDiagnostics(){
  const size=renderer?renderer.getSize(new THREE.Vector2()):new THREE.Vector2(),rect=stage.getBoundingClientRect();
  let webgl=false;try{webgl=!!renderer&&!renderer.getContext().isContextLost();}catch{}
  return {engine:"Three.js r164",assetInterop:"glTF 2.0 / GLB",simulation:WORLD_RULES.simulation,webgl,activeScene:activeSceneId,stage:{width:Math.round(rect.width),height:Math.round(rect.height)},drawingBuffer:renderer?{width:renderer.domElement.width,height:renderer.domElement.height}:null,renderFrames:worldRenderFrames,lastFrameAgeMs:worldLastFrameAt?Math.round(performance.now()-worldLastFrameAt):null,lastRenderError:worldLastRenderError,sceneObjects:scene?.children?.length||0,worldObjects:worldGroup?.children?.length||0,drawCalls:renderer?.info?.render?.calls||0,triangles:renderer?.info?.render?.triangles||0,player:avatarRoot?{x:+avatarRoot.position.x.toFixed(2),z:+avatarRoot.position.z.toFixed(2)}:null,gpuMemory:{geometries:renderer?.info?.memory?.geometries||0,textures:renderer?.info?.memory?.textures||0},npcs:npcs.map(n=>({id:n.userData.id,name:n.userData.name,x:+n.position.x.toFixed(2),z:+n.position.z.toFixed(2),blockedFor:+n.userData.blockedFor.toFixed(1)})),vehicles:vehicles.map(v=>({id:v.userData.id,kind:v.userData.kind,x:+v.position.x.toFixed(2),z:+v.position.z.toFixed(2),held:performance.now()<(v.userData.safetyHoldUntil||0)})),loadedAssets:[...loadedWorldAssets.entries()].map(([id,e])=>({id,sceneId:e.sceneId,sourceUrl:e.sourceUrl,license:e.license,attribution:e.attribution,animationClips:e.animationNames||[]})),loadingAssets:[...loadingWorldAssets.keys()],assetMixers:worldAssetMixers.size,assetFailures:worldAssetFailures.slice(-8),repairs:{total:worldRepairCount,lastAt:worldLastRepairAt,recent:worldRepairEvents.slice(-8)},agents:getWorldAgentSnapshot(),anomalyAudit:worldAuditSnapshot};
}
function verifyRecoverySelfTest(){
  if(!npcs.length||!colliders.length)return {passed:false,detail:"NPC atau collider tidak tersedia"};
  const npc=npcs[0],u=npc.userData,c=colliders.find(item=>item.tag==="tree")||colliders[0],old={x:npc.position.x,z:npc.position.z,lastSafeX:u.lastSafeX,lastSafeZ:u.lastSafeZ,goal:u.goal,nextThinkAt:u.nextThinkAt,blockedFor:u.blockedFor},count=worldRepairCount,lastAt=worldLastRepairAt,events=worldRepairEvents.slice(),warning=worldLastWarningAt;
  u.lastSafeX=old.x;u.lastSafeZ=old.z;npc.position.set(c.x,0,c.z);worldLastWarningAt=performance.now();
  let repaired=0,passed=false;
  try{repaired=repairWorldAnomalies(performance.now());passed=repaired>0&&!isPositionBlocked(npc.position.x,npc.position.z,u.radius,{ignoreNpc:npc});}
  finally{worldRepairCount=count;worldLastRepairAt=lastAt;worldRepairEvents.length=0;worldRepairEvents.push(...events);worldLastWarningAt=warning;if(!passed){npc.position.set(old.x,0,old.z);u.lastSafeX=old.lastSafeX;u.lastSafeZ=old.lastSafeZ;u.goal=old.goal;u.nextThinkAt=old.nextThinkAt;u.blockedFor=old.blockedFor;}}
  return {passed,detail:passed?"Anomali collider sintetis dipulihkan ke titik aman":"Recovery tidak memulihkan NPC ke posisi valid"};
}
function runWorldSelfTest(){
  const d=getWorldDiagnostics(),checks=[],add=(name,passed,detail)=>checks.push({name,passed:!!passed,detail});
  add("webgl-context",d.webgl,"WebGL context aktif");
  add("render-loop",d.renderFrames>0&&d.lastFrameAgeMs!==null&&d.lastFrameAgeMs<2500,"Frame="+d.renderFrames+", umur="+d.lastFrameAgeMs+"ms");
  add("scene-rendered",d.worldObjects>0&&d.drawCalls>0&&d.triangles>0,"Objek dunia="+d.worldObjects+", draw calls="+d.drawCalls+", triangles="+d.triangles);
  add("scene-config",!!SCENES[activeSceneId]&&SCENES[activeSceneId].objects.length>0,"Konfigurasi "+activeSceneId+" tersedia");
  add("static-collision",colliders.length>0&&collides(colliders[0].x,colliders[0].z),"Collider statis menghentikan gerak pada pusat objek");
  add("npc-separation",npcs.length>=3&&npcs.every((a,i)=>npcs.slice(i+1).every(b=>Math.hypot(a.position.x-b.position.x,a.position.z-b.position.z)>=a.userData.radius+b.userData.radius-.04)),"NPC="+npcs.length+"; jarak antar-NPC valid");
  const collisionAudit=worldAiAudit();
  add("vehicle-safety",vehicles.length===0||(collisionAudit.counts.vehicleVehicle===0&&collisionAudit.counts.vehicleStatic===0&&collisionAudit.counts.vehicleNpc===0&&collisionAudit.counts.vehicleAvatar===0),"Kendaraan="+vehicles.length+"; tidak overlap kendaraan, collider statis, NPC, atau avatar");
  const probeVehicle={position:{x:0,z:0},userData:{halfWidth:.42,halfLength:.7}};
  add("vehicle-static-collision",!!colliders[0]&&!vehicleCanMove(probeVehicle,colliders[0].x,colliders[0].z),"Probe kendaraan pada collider statis diblokir");
  add("vehicle-npc-collision",!!npcs[0]&&!vehicleCanMove(probeVehicle,npcs[0].position.x,npcs[0].position.z),"Probe kendaraan pada posisi NPC diblokir");
  add("vehicle-avatar-collision",!!avatarRoot&&!vehicleCanMove(probeVehicle,avatarRoot.position.x,avatarRoot.position.z),"Probe kendaraan pada posisi avatar diblokir");
  const probeOtherVehicle={position:{x:-10,z:8},userData:{halfWidth:.42,halfLength:.7}};
  vehicles.push(probeOtherVehicle);
  const probeBlockedByVehicle=!vehicleCanMove(probeVehicle,probeOtherVehicle.position.x,probeOtherVehicle.position.z);
  vehicles.pop();
  add("vehicle-vehicle-collision",probeBlockedByVehicle,"Probe dua kendaraan sintetis saling memblokir di titik uji aman");
  add("avatar-vehicle-block",vehicles.length===0||vehicles.every(v=>isPositionBlocked(v.position.x,v.position.z,WORLD_RULES.avatarRadius,{ignoreAvatar:true})),"Area kendaraan tidak dapat ditembus avatar");
  add("npc-collider-safety",collisionAudit.counts.npcStatic===0&&collisionAudit.counts.npcNpc===0&&collisionAudit.counts.npcAvatar===0,"NPC tidak overlap collider statis, NPC lain, atau avatar");
  add("asset-adapter",typeof loadWorldGltf==="function"&&typeof removeWorldGltf==="function"&&typeof gltfLoader.loadAsync==="function","Loader glTF/GLB dan cleanup tersedia");
  add("asset-animation-registry",worldAssetMixers instanceof Map&&[...worldAssetMixers.keys()].every(key=>loadedWorldAssets.has(key)),"Mixer animasi terdaftar dan tidak yatim");
  const recovery=verifyRecoverySelfTest();add("anomaly-recovery",recovery.passed,recovery.detail);
  const audit=worldAiAudit();worldAuditSnapshot=audit;
  add("anomaly-severity",audit.severity!=="high","Severity="+audit.severity+", temuan="+audit.issueCount);
  const failed=checks.filter(c=>!c.passed);
  return {at:new Date().toISOString(),status:failed.length?"FAIL":"PASS",passed:checks.length-failed.length,failed:failed.length,checks,audit};
}
function ensureSceneAssets(sceneId){
  if(sceneId!=="cafe"||loadedWorldAssets.has("cafe-avocado")||loadingWorldAssets.has("cafe-avocado"))return;
  setWorldAgentState("sceneBuilder","MEMBANGUN","Memuat prop Avocado CC0 untuk meja kafe.");
  refreshWorldAgentPanel();
  loadWorldGltf("cafe-avocado","/assets/avocado.glb",{sceneId:"cafe",persistent:true,position:[0,0,1],scale:.55,groundY:.84,license:"CC0-1.0",attribution:"© 2017 Public; Microsoft for Everything; KhronosGroup glTF-Sample-Assets"}).then(()=>{
    setWorldAgentState("sceneBuilder","SIAP","Aset Avocado CC0 terpasang di Cafe Kita.");
    refreshWorldAgentPanel();
  }).catch(()=>{
    setWorldAgentState("sceneBuilder","WASPADA","Model Avocado gagal dimuat; scene prosedural tetap aktif.");
    refreshWorldAgentPanel();
  });
}
function switchScene(sceneId){
  if(!SCENES[sceneId])throw new Error("Scene tidak dikenal: "+sceneId);
  if(sceneId===activeSceneId)return false;
  buildScene(sceneId);ensureSceneAssets(sceneId);showToast("Memasuki "+SCENES[sceneId].title);return true;
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
    try{switchScene(button.dataset.scene);}
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
    setProgress(100,"Siap dijelajahi","Renderer aktif. Tiga scene dan tujuh agen lokal tersedia; akun dan multiplayer belum diaktifkan.");
    refreshWorldAgentPanel();
  }catch(error){reportFatal(error);}
}
window.addEventListener("unhandledrejection",e=>console.error("Promise gagal:",e.reason));
window.RUANG_KITA_NEXT=Object.freeze({
  version:"next-phase-2-world-intelligence",
  engine:"Three.js r164",
  assetInterop:"glTF 2.0 / GLB",
  sceneIds:Object.freeze(Object.keys(SCENES)),
  activeScene:()=>activeSceneId,
  switchScene,
  simulation:WORLD_RULES.simulation,
  loadModel:loadWorldGltf,
  removeModel:removeWorldGltf,
  loadedAssets:()=>[...loadedWorldAssets.keys()],
  agents:getWorldAgentSnapshot,
  diagnostics:getWorldDiagnostics,
  auditWorld:worldAiAudit,
  runSelfTest:runWorldSelfTest
});
start();