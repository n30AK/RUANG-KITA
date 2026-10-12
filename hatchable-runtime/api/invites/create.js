import { db } from 'hatchable';
export const access='user';
export const methods=['POST'];
export default async function(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const user=req.user,id=String(req.body?.community_id||'');
 if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({error:'ID komunitas tidak valid.'});
 const {rows:roles}=await db.query(`SELECT role FROM community_memberships WHERE community_id=$1 AND user_id=$2 AND status='active' LIMIT 1`,[id,user.id]);
 if(!roles.length||!['owner','admin'].includes(roles[0].role))return res.status(403).json({error:'Hanya pemilik atau admin yang dapat membuat undangan.'});
 const token=crypto.randomUUID().replace(/-/g,'')+crypto.randomUUID().replace(/-/g,'');
 const days=Math.min(30,Math.max(1,Number(req.body?.expires_days)||7)),maxUses=Math.min(100,Math.max(1,Number(req.body?.max_uses)||20));
 const {rows}=await db.query(`INSERT INTO community_invites(community_id,token,created_by,expires_at,max_uses) VALUES($1,$2,$3,now()+($4::text||' days')::interval,$5) RETURNING token,expires_at,max_uses`,[id,token,user.id,days,maxUses]);
 await db.query(`INSERT INTO community_audit_log(community_id,actor_user_id,action,target_type,details) VALUES($1,$2,'invite.created','invite',jsonb_build_object('expires_at',$3::text))`,[id,user.id,rows[0].expires_at]);
 return res.status(201).json({invite:{...rows[0],url:'/undangan?token='+rows[0].token}});
}