import { db } from 'hatchable';
export const access='user';
export const methods=['POST'];
export default async function(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const user=req.user,id=String(req.body?.community_id||''),title=typeof req.body?.title==='string'?req.body.title.trim().slice(0,160):'',body=typeof req.body?.body==='string'?req.body.body.trim().slice(0,10000):'',visibility=req.body?.visibility==='public'?'public':'members';
 if(!/^[0-9a-f-]{36}$/i.test(id)||title.length<2||body.length<1)return res.status(400).json({error:'Isi pengumuman belum lengkap.'});
 const {rows:roles}=await db.query(`SELECT role FROM community_memberships WHERE community_id=$1 AND user_id=$2 AND status='active' LIMIT 1`,[id,user.id]);
 if(!roles.length||!['owner','admin','moderator'].includes(roles[0].role))return res.status(403).json({error:'Hanya pengelola komunitas yang dapat menerbitkan pengumuman.'});
 const {rows}=await db.query(`INSERT INTO community_announcements(community_id,author_user_id,title,body,visibility) VALUES($1,$2,$3,$4,$5) RETURNING id,community_id,title,body,pinned,visibility,created_at`,[id,user.id,title,body,visibility]);
 await db.query(`INSERT INTO community_audit_log(community_id,actor_user_id,action,target_type,target_id) VALUES($1,$2,'announcement.created','announcement',$3)`,[id,user.id,rows[0].id]);
 return res.status(201).json({announcement:rows[0]});
}