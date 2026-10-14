import { db } from "hatchable";

export const access = "user";
export const methods = ["POST"];

export default async function (req, res) {
  const roomId = String(req.body?.room_id || "");
  if (!/^[0-9a-f-]{36}$/i.test(roomId)) return res.status(400).json({ error: "ID ruang tidak valid." });
  const { rows } = await db.query(
    "INSERT INTO room_members (room_id, user_id, role) SELECT id, $2, 'member' FROM community_rooms WHERE id = $1 AND is_public = TRUE ON CONFLICT (room_id, user_id) DO NOTHING RETURNING room_id",
    [roomId, req.user.id]
  );
  if (rows.length) {
    await db.query("UPDATE community_rooms SET member_count = member_count + 1 WHERE id = $1", [roomId]);
    return res.json({ ok: true, joined: true });
  }
  const existing = await db.query(
    "SELECT m.room_id FROM room_members m JOIN community_rooms r ON r.id = m.room_id WHERE m.room_id = $1 AND m.user_id = $2",
    [roomId, req.user.id]
  );
  if (existing.rows.length) return res.json({ ok: true, joined: true, already_member: true });
  return res.status(404).json({ error: "Ruang tidak ditemukan atau bersifat privat." });
}