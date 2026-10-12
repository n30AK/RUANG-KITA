import { db, auth } from 'hatchable';
export const access='public';
export const methods=['GET'];
export default async function(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const id=String(req.params?.id||'');
 if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(404).json({error:'Ruang tidak ditemukan.'});
 const user=await auth.getUser(req);
 const {rows}=await db.query(`SELECT c.id,c.name,c.slug,c.description,c.category,c.scene,c.visibility,c.created_at,
 COALESCE((SELECT s.member_count FROM community_stats s WHERE s.community_id=c.id),0) AS member_count,
 EXISTS(SELECT 1 FROM community_memberships m WHERE m.community_id=c.id AND m.user_id=$2 AND m.status='active') AS is_member,
 (SELECT m.role FROM community_memberships m WHERE m.community_id=c.id AND m.user_id=$2 AND m.status='active' LIMIT 1) AS role
 FROM communities c WHERE c.id=$1 AND (c.visibility='public' OR EXISTS(SELECT 1 FROM community_memberships m WHERE m.community_id=c.id AND m.user_id=$2 AND m.status='active')) LIMIT 1`,[id,user?user.id:null]);
 if(!rows.length)return res.status(404).json({error:'Ruang tidak ditemukan atau Anda tidak memiliki akses.'});
 return res.json({community:rows[0]});
}