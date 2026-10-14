import { db } from "hatchable";

export const access = "user";
export const methods = ["GET"];

export default async function (req, res) {
  const { rows } = await db.query(
    "SELECT id, action, resource_type, resource_id, metadata, created_at FROM community_audit_events WHERE actor_id = $1 ORDER BY created_at DESC LIMIT 50",
    [req.user.id]
  );
  return res.json({ events: rows });
}