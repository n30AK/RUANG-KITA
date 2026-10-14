import { db } from "hatchable";

export const access = "user";
export const methods = ["GET", "POST"];

function cleanText(value, max) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

export default async function (req, res) {
  const userId = req.user.id;
  if (req.method === "GET") {
    const { rows } = await db.query(
      "SELECT r.id, r.name, r.description, r.slug, r.is_public, r.created_at, r.member_count, EXISTS (SELECT 1 FROM room_members mine WHERE mine.room_id = r.id AND mine.user_id = $1) AS is_member FROM community_rooms r WHERE r.is_public = TRUE OR EXISTS (SELECT 1 FROM room_members mine WHERE mine.room_id = r.id AND mine.user_id = $1) ORDER BY r.created_at DESC LIMIT 100",
      [userId]
    );
    return res.json({ rooms: rows });
  }

  const name = cleanText(req.body?.name, 64);
  const description = cleanText(req.body?.description, 240);
  if (name.length < 2) return res.status(400).json({ error: "Nama ruang minimal 2 karakter." });

  const count = await db.query("SELECT COUNT(*)::int AS total FROM community_rooms WHERE created_by = $1", [userId]);
  if (Number(count.rows[0]?.total || 0) >= 3) {
    return res.status(429).json({ error: "Batas MVP: maksimal 3 ruang dibuat per akun." });
  }

  const base = name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "ruang";
  const suffix = Array.from(crypto.getRandomValues(new Uint8Array(3))).map(n => n.toString(16).padStart(2,"0")).join("");
  const slug = base + "-" + suffix;
  const { rows } = await db.query(
    "WITH created AS (INSERT INTO community_rooms (name, description, slug, created_by) VALUES ($1, $2, $3, $4) RETURNING id, name, description, slug, is_public, created_at), joined AS (INSERT INTO room_members (room_id, user_id, role) SELECT id, $4, 'owner' FROM created RETURNING room_id) SELECT created.* FROM created JOIN joined ON joined.room_id = created.id",
    [name, description, slug, userId]
  );
  if (!rows.length) return res.status(500).json({ error: "Ruang belum dapat dibuat." });
  await db.query("UPDATE community_rooms SET member_count = 1 WHERE id = $1", [rows[0].id]);
  return res.status(201).json({ room: { ...rows[0], member_count: 1, is_member: true } });
}