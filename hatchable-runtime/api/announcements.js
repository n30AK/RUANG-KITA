import { db, auth } from 'hatchable';
export const access='public';
export const methods=['GET'];
export default async function(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const id=String(req.query?.community_id||'');
 if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({error:'ID komunitas tidak valid.'});
 const user=await auth.getUser(req);
 const {rows}=await db.query(`SELECT a.id,a.community_id,a.title,a.body,a.pinned,a.visibility,a.created_at
 FROM community_announcements a JOIN communities c ON c.id=a.community_id
 WHERE a.community_id=$1 AND (c.visibility='public' OR EXISTS(SELECT 1 FROM community_memberships m WHERE m.community_id=c.id AND m.user_id=$2 AND m.status='active'))
 AND (a.visibility='public' OR EXISTS(SELECT 1 FROM community_memberships m WHERE m.community_id=a.community_id AND m.user_id=$2 AND m.status='active'))
 ORDER BY a.pinned DESC,a.created_at DESC LIMIT 100`,[id,user?user.id:null]);
 return res.json({announcements:rows});
}