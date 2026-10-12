import { db, auth } from 'hatchable';
export const access='public';
export const methods=['GET'];
export default async function(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const user=await auth.getUser(req);
 const communityId=typeof req.query?.community_id==='string'?req.query.community_id:'';
 if(communityId&&!/^[0-9a-f-]{36}$/i.test(communityId))return res.status(400).json({error:'ID komunitas tidak valid.'});
 const params=[user?user.id:null];
 let filter='';
 if(communityId){params.push(communityId);filter=' AND e.community_id=$2';}
 const {rows}=await db.query(`SELECT e.id,e.community_id,e.title,e.description,e.starts_at,e.ends_at,e.location,e.meeting_url,e.visibility,c.name AS community_name
 FROM community_events e JOIN communities c ON c.id=e.community_id
 WHERE e.starts_at>=now()-interval '30 days'
 AND (e.visibility='public' OR EXISTS(SELECT 1 FROM community_memberships m WHERE m.community_id=e.community_id AND m.user_id=$1 AND m.status='active'))${filter}
 ORDER BY e.starts_at ASC LIMIT 100`,params);
 return res.json({events:rows});
}