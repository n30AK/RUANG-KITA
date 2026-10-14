import { db, events } from "hatchable";

export const access = "user";
export const methods = ["GET", "POST"];

function cleanText(value, max) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

async function canReadRoom(roomId, userId) {
  const result = await db.query(
    "SELECT r.id, r.name FROM community_rooms r JOIN room_members m ON m.room_id = r.id WHERE r.id = $1 AND m.user_id = $2",
    [roomId, userId]
  );
  return result.rows[0] || null;
}

export default async function (req, res) {
  const userId = req.user.id;
  const roomId = String(req.method === "GET" ? req.query?.room_id || "" : req.body?.room_id || "");
  if (!/^[0-9a-f-]{36}$/i.test(roomId)) return res.status(400).json({ error: "ID ruang tidak valid." });
  const room = await canReadRoom(roomId, userId);
  if (!room) return res.status(403).json({ error: "Gabung ke ruang terlebih dahulu." });

  if (req.method === "GET") {
    const { rows } = await db.query(
      "SELECT id, room_id, user_id, display_name, body, created_at FROM room_messages WHERE room_id = $1 ORDER BY created_at DESC LIMIT 60",
      [roomId]
    );
    return res.json({ room, messages: rows.reverse() });
  }

  const body = cleanText(req.body?.body, 1200);
  if (!body) return res.status(400).json({ error: "Pesan tidak boleh kosong." });
  const rate = await db.query("SELECT COUNT(*)::int AS total FROM room_messages WHERE user_id = $1 AND created_at > NOW() - INTERVAL '1 minute'", [userId]);
  if (Number(rate.rows[0]?.total || 0) >= 20) return res.status(429).json({ error: "Terlalu banyak pesan. Coba lagi sebentar." });
  const displayName = cleanText(req.user.name || String(req.user.email || "Anggota").split("@")[0], 60) || "Anggota";
  const { rows } = await db.query(
    "INSERT INTO room_messages (room_id, user_id, display_name, body) VALUES ($1, $2, $3, $4) RETURNING id, room_id, user_id, display_name, body, created_at",
    [roomId, userId, displayName, body]
  );
  const message = rows[0];
  // Realtime is a notification only; clients refetch the authoritative snapshot.
  // A notification failure must not turn a successfully persisted message into an apparent failed send.
  try { await events.publish("room:" + roomId, "message.created", { id: message.id }); }
  catch (error) { console.error("Community event publish failed:", error?.code || "unknown"); }
  return res.status(201).json({ message });
}