CREATE TABLE communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 2000),
  category text NOT NULL DEFAULT 'Umum',
  scene text NOT NULL DEFAULT 'cafe',
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('public','private','invite_only')),
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE community_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','moderator','member')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','removed')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, user_id)
);
CREATE INDEX community_memberships_user_idx ON community_memberships(user_id, status);
CREATE INDEX community_memberships_community_idx ON community_memberships(community_id, status);
CREATE TABLE community_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  author_user_id text NOT NULL,
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 160),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  pinned boolean NOT NULL DEFAULT false,
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public','members')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX announcements_community_idx ON community_announcements(community_id, created_at DESC);
CREATE TABLE community_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  created_by text NOT NULL,
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 160),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 5000),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  location text NOT NULL DEFAULT '',
  meeting_url text NOT NULL DEFAULT '',
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public','members')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR ends_at >= starts_at)
);
CREATE INDEX community_events_start_idx ON community_events(starts_at);
CREATE TABLE event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  response text NOT NULL CHECK (response IN ('yes','maybe','no')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);
CREATE TABLE community_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  created_by text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member','moderator')),
  expires_at timestamptz NOT NULL,
  max_uses integer NOT NULL DEFAULT 20 CHECK (max_uses BETWEEN 1 AND 500),
  uses integer NOT NULL DEFAULT 0 CHECK (uses >= 0),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE community_audit_log (
  id bigserial PRIMARY KEY,
  community_id uuid REFERENCES communities(id) ON DELETE SET NULL,
  actor_user_id text NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX community_audit_community_idx ON community_audit_log(community_id, created_at DESC);