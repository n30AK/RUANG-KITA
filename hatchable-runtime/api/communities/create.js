import { db } from 'hatchable';
export const access='user';
export const methods=['POST'];
const scenes=new Set(['cafe','angkringan','pendopo','expo','karaoke','school','family','office','neighborhood','worship','sports','hobby','learning','umkm','volunteer','travel','health','alumni','podcast']);
function cleanText(v,max){return typeof v==='string'?v.trim().slice(0,max):'';}
function slugify(v){return v.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,55)||'komunitas';}
export default async function(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const user=req.user;
 const name=cleanText(req.body?.name,100),description=cleanText(req.body?.description,2000),category=cleanText(req.body?.category,60)||'Umum',scene=cleanText(req.body?.scene,40)||'cafe',visibility=cleanText(req.body?.visibility,20)||'private';
 if(name.length<2)return res.status(400).json({error:'Nama komunitas minimal 2 karakter.'});
 if(!scenes.has(scene))return res.status(400).json({error:'Pilihan suasana tidak valid.'});
 if(!['public','private','invite_only'].includes(visibility))return res.status(400).json({error:'Pilihan akses tidak valid.'});
 const slug=slugify(name)+'-'+crypto.randomUUID().slice(0,8);
 const {rows}=await db.query(`INSERT INTO communities(name,slug,description,category,scene,visibility,created_by) VALUES($1,$2,$3,$4,$5,$6,$7)
 RETURNING id,name,slug,description,category,scene,visibility,created_at`,[name,slug,description,category,scene,visibility,user.id]);
 const community=rows[0];
 try{
  await db.query(`INSERT INTO community_memberships(community_id,role,status) VALUES($1,'owner','active')`,[community.id]);
  await db.query(`INSERT INTO community_audit_log(community_id,actor_user_id,action,target_type,details) VALUES($1,$2,'community.created','community',jsonb_build_object('visibility',$3::text))`,[community.id,user.id,visibility]);
 }catch(error){
  await db.query('DELETE FROM communities WHERE id=$1',[community.id]).catch(()=>{});
  throw error;
 }
 return res.status(201).json({community});
}