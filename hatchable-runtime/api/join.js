import { db } from 'hatchable';
export const access='user';
export const methods=['POST'];
export default async function(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const user=req.user,id=String(req.body?.community_id||'');
 if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({error:'ID komunitas tidak valid.'});
 const {rows:target}=await db.query(`SELECT id,name,slug FROM communities WHERE id=$1 AND visibility='public' LIMIT 1`,[id]);
 if(!target.length)return res.status(404).json({error:'Komunitas publik tidak ditemukan.'});
 await db.query(`INSERT INTO community_memberships(community_id,role,status) VALUES($1,'member','active')
 ON CONFLICT(community_id,user_id) DO UPDATE SET status='active'`,[id]);
 await db.query(`INSERT INTO community_audit_log(community_id,actor_user_id,action,target_type,target_id) VALUES($1,$2,'member.joined','membership',$2)`,[id,user.id]);
 return res.json({ok:true,community:target[0]});
}