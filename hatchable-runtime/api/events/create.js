import { db } from 'hatchable';
export const access='user';
export const methods=['POST'];
export default async function(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const user=req.user,communityId=String(req.body?.community_id||'');
 const title=typeof req.body?.title==='string'?req.body.title.trim().slice(0,160):'';
 const description=typeof req.body?.description==='string'?req.body.description.trim().slice(0,5000):'';
 const location=typeof req.body?.location==='string'?req.body.location.trim().slice(0,250):'';
 const meetingUrl=typeof req.body?.meeting_url==='string'?req.body.meeting_url.trim().slice(0,1000):'';
 const visibility=req.body?.visibility==='public'?'public':'members';
 const start=new Date(req.body?.starts_at),end=req.body?.ends_at?new Date(req.body.ends_at):null;
 if(!/^[0-9a-f-]{36}$/i.test(communityId)||title.length<2||!Number.isFinite(start.getTime())||(end&&!Number.isFinite(end.getTime()))||(end&&end<start))return res.status(400).json({error:'Periksa nama acara dan waktu mulai/selesai.'});
 if(meetingUrl&&!/^https:\/\//i.test(meetingUrl))return res.status(400).json({error:'Tautan rapat harus menggunakan HTTPS.'});
 const {rows:allowed}=await db.query(`SELECT role FROM community_memberships WHERE community_id=$1 AND user_id=$2 AND status='active' LIMIT 1`,[communityId,user.id]);
 if(!allowed.length||!['owner','admin','moderator'].includes(allowed[0].role))return res.status(403).json({error:'Hanya pengelola komunitas yang dapat membuat agenda.'});
 const {rows}=await db.query(`INSERT INTO community_events(community_id,created_by,title,description,starts_at,ends_at,location,meeting_url,visibility)
 VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id,community_id,title,description,starts_at,ends_at,location,meeting_url,visibility`,
 [communityId,user.id,title,description,start.toISOString(),end?end.toISOString():null,location,meetingUrl,visibility]);
 await db.query(`INSERT INTO community_audit_log(community_id,actor_user_id,action,target_type,target_id) VALUES($1,$2,'event.created','event',$3)`,[communityId,user.id,rows[0].id]);
 return res.status(201).json({event:rows[0]});
}