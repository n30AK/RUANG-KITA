import { db, auth } from 'hatchable';
export const access='public';
export const methods=['GET'];
export default async function(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Metode tidak diizinkan.'});
 const user=await auth.getUser(req);
 const {rows}=await db.query(`SELECT c.id,c.name,c.slug,c.description,c.category,c.scene,c.visibility,c.created_at,
  COALESCE((SELECT s.member_count FROM community_stats s WHERE s.community_id=c.id),0) AS member_count,
  EXISTS(SELECT 1 FROM community_memberships mine WHERE mine.community_id=c.id AND mine.user_id=$1 AND mine.status='active') AS is_member,
  (SELECT mine.role FROM community_memberships mine WHERE mine.community_id=c.id AND mine.user_id=$1 AND mine.status='active' LIMIT 1) AS role,
  (c.created_by=$1) AS created_by_me
  FROM communities c
  WHERE c.visibility='public' OR EXISTS(SELECT 1 FROM community_memberships mine WHERE mine.community_id=c.id AND mine.user_id=$1 AND mine.status='active')
  ORDER BY c.created_at DESC LIMIT 100`,[user?user.id:null]);
 return res.json({communities:rows});
}