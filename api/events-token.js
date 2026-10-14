import { db, events } from "hatchable";

export const access = "user";
export const methods = ["GET"];

export default async function (req, res) {
  const roomId = String(req.query?.room_id || "");
  if (!/^[0-9a-f-]{36}$/i.test(roomId)) return res.status(400).json({ error: "ID ruang tidak valid." });
  const membership = await db.query(
    "SELECT 1 FROM room_members WHERE room_id = $1 AND user_id = $2",
    [roomId, req.user.id]
  );
  if (!membership.rows.length) return res.status(403).json({ error: "Akses realtime hanya tersedia bagi anggota ruang." });
  return res.json(await events.grant(["room:" + roomId]));
}