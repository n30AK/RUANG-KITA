import { db } from "hatchable";

export const access = "user";
export const methods = ["POST"];

function toHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function hashToken(token) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return toHex(new Uint8Array(digest));
}

export default async function (req, res) {
  const token = String(req.body?.token || "").trim().toLowerCase();
  if (!/^[0-9a-f]{48}$/.test(token)) return res.status(400).json({ error: "Kode undangan tidak valid." });
  const tokenHash = await hashToken(token);
  const { rows } = await db.query(
    "WITH valid_invite AS (UPDATE room_invites SET use_count = use_count + 1 WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW() AND use_count < max_uses AND NOT EXISTS (SELECT 1 FROM room_members m WHERE m.room_id = room_invites.room_id AND m.user_id = $2) RETURNING room_id), joined AS (INSERT INTO room_members (room_id, user_id, role) SELECT room_id, $2, 'member' FROM valid_invite ON CONFLICT (room_id, user_id) DO NOTHING RETURNING room_id) SELECT room_id FROM joined",
    [tokenHash, req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Undangan sudah kedaluwarsa, tidak valid, atau telah digunakan." });
  return res.json({ ok: true, room_id: rows[0].room_id });
}