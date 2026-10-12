import { db, auth } from 'hatchable';
export const access='public';
export const methods=['GET'];
export default async function(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Metode tidak diizinkan.'});
 await auth.getUser(req); // Optional identity: invite preview remains public because the token is the access credential.
 const token=typeof req.query?.token==='string'?req.query.token:'';
 if(token.length<20||token.length>100)return res.status(400).json({error:'Tautan undangan tidak valid.'});
 const {rows}=await db.query(`SELECT i.community_id,c.name,c.description,c.scene,i.expires_at,i.max_uses,i.uses
 FROM community_invites i JOIN communities c ON c.id=i.community_id WHERE i.token=$1 AND i.revoked_at IS NULL AND i.expires_at>now() AND i.uses<i.max_uses LIMIT 1`,[token]);
 if(!rows.length)return res.status(404).json({error:'Undangan tidak ditemukan, kedaluwarsa, atau sudah tidak berlaku.'});
 return res.json({invite:rows[0]});
}