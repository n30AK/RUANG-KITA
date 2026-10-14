import { db } from "hatchable";
import { recordAudit } from "lib/audit.js";

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
  const roomId = String(req.body?.room_id || "");
  if (!/^[0-9a-f-]{36}$/i.test(roomId)) return res.status(400).json({ error: "ID ruang tidak valid." });
  const member = await db.query(
    "SELECT role FROM room_members WHERE room_id = $1 AND user_id = $2",
    [roomId, req.user.id]
  );
  if (!member.rows.length || !["owner", "moderator"].includes(member.rows[0].role)) {
    return res.status(403).json({ error: "Hanya pemilik atau moderator yang dapat membuat undangan." });
  }
  const token = toHex(crypto.getRandomValues(new Uint8Array(24)));
  const tokenHash = await hashToken(token);
  const { rows } = await db.query(
    "INSERT INTO room_invites (room_id, token_hash, created_by, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '7 days') RETURNING id, expires_at",
    [roomId, tokenHash, req.user.id]
  );
  await recordAudit(req.user.id, "invite.created", "invite", rows[0].id, { room_id: roomId, expires_at: rows[0].expires_at });
  return res.status(201).json({ invite: { id: rows[0].id, token, expires_at: rows[0].expires_at } });
}