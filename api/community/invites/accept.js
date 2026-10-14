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
  const userId = req.user.id;
  const reserved = await db.query(
    "UPDATE room_invites SET use_count = use_count + 1 WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW() AND use_count < max_uses AND NOT EXISTS (SELECT 1 FROM room_members m WHERE m.room_id = room_invites.room_id AND m.user_id = $2) RETURNING id, room_id",
    [tokenHash, userId]
  );
  if (!reserved.rows.length) return res.status(404).json({ error: "Undangan sudah kedaluwarsa, tidak valid, telah digunakan, atau Anda sudah menjadi anggota." });

  const invite = reserved.rows[0];
  try {
    const member = await db.query(
      "INSERT INTO room_members (room_id, user_id, role) VALUES ($1, $2, 'member') ON CONFLICT (room_id, user_id) DO NOTHING RETURNING room_id",
      [invite.room_id, userId]
    );
    if (!member.rows.length) {
      await db.query("UPDATE room_invites SET use_count = GREATEST(0, use_count - 1) WHERE id = $1", [invite.id]);
      return res.status(409).json({ error: "Keanggotaan sudah ada; undangan tidak digunakan." });
    }
    await db.query("UPDATE community_rooms SET member_count = member_count + 1 WHERE id = $1", [invite.room_id]);
    return res.json({ ok: true, room_id: invite.room_id });
  } catch (error) {
    await db.query("DELETE FROM room_members WHERE room_id = $1 AND user_id = $2", [invite.room_id, userId]).catch(() => {});
    await db.query("UPDATE room_invites SET use_count = GREATEST(0, use_count - 1) WHERE id = $1", [invite.id]).catch(() => {});
    throw error;
  }
}