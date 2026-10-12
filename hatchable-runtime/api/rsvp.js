import { db } from 'hatchable';
export const access='user';
export const methods=['POST'];
export default async function(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const user=req.user,eventId=String(req.body?.event_id||''),response=String(req.body?.response||'');
 if(!/^[0-9a-f-]{36}$/i.test(eventId)||!['yes','maybe','no'].includes(response))return res.status(400).json({error:'Pilihan RSVP tidak valid.'});
 const {rows:allowed}=await db.query(`SELECT e.id FROM community_events e JOIN community_memberships m ON m.community_id=e.community_id WHERE e.id=$1 AND m.user_id=$2 AND m.status='active' LIMIT 1`,[eventId,user.id]);
 if(!allowed.length)return res.status(403).json({error:'Anda harus menjadi anggota komunitas untuk merespons agenda.'});
 const {rows}=await db.query(`INSERT INTO event_rsvps(event_id,response) VALUES($1,$2)
 ON CONFLICT(event_id,user_id) DO UPDATE SET response=EXCLUDED.response,updated_at=now()
 RETURNING event_id,response`,[eventId,response]);
 return res.json({ok:true,rsvp:rows[0]});
}