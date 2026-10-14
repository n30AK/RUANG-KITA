CREATE TABLE IF NOT EXISTS room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES community_rooms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Anggota',
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1200),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)