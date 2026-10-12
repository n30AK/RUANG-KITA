import { db } from 'hatchable';
export const access='user';
export const methods=['POST'];
export default async function(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const user=req.user,token=typeof req.body?.token==='string'?req.body.token:'';
 if(token.length<20||token.length>100)return res.status(400).json({error:'Tautan undangan tidak valid.'});
 const {rows:claimed}=await db.query(`UPDATE community_invites SET uses=uses+1
 WHERE token=$1 AND revoked_at IS NULL AND expires_at>now() AND uses<max_uses
 RETURNING community_id,role`,[token]);
 if(!claimed.length)return res.status(404).json({error:'Undangan tidak berlaku atau telah mencapai batas penggunaan.'});
 const invite=claimed[0];
 try{
  await db.query(`INSERT INTO community_memberships(community_id,role,status) VALUES($1,$2,'active')
   ON CONFLICT(community_id,user_id) DO UPDATE SET status='active'`,[invite.community_id,invite.role]);
 }catch(error){
  await db.query('UPDATE community_invites SET uses=GREATEST(0,uses-1) WHERE token=$1',[token]).catch(()=>{});
  throw error;
 }
 const {rows}=await db.query('SELECT id,name,slug FROM communities WHERE id=$1',[invite.community_id]);
 await db.query(`INSERT INTO community_audit_log(community_id,actor_user_id,action,target_type,target_id) VALUES($1,$2,'invite.accepted','membership',$2)`,[invite.community_id,user.id]);
 return res.json({ok:true,community:rows[0]});
}