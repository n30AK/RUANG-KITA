import { db, auth } from 'hatchable';
export const access='public';
export const methods=['GET'];
export default async function(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const user=await auth.getUser(req);
 const {rows}=await db.query(`SELECT e.id,e.community_id,e.title,e.description,e.starts_at,e.ends_at,e.location,e.meeting_url,e.visibility,c.name AS community_name
  FROM community_events e JOIN communities c ON c.id=e.community_id
  WHERE e.starts_at>=now()-interval '30 days' AND
   (e.visibility='public' OR EXISTS(SELECT 1 FROM community_memberships m WHERE m.community_id=e.community_id AND m.user_id=$1 AND m.status='active'))
  ORDER BY e.starts_at ASC LIMIT 100`,[user?user.id:null]);
 return res.json({events:rows});
}