-- RUANG KITA rooms, podcast, and cross-community guest access
-- Review and apply only to a Neon development branch first.
-- This migration is NOT intended to be applied to production without explicit approval.
-- Keep database access server-side until Neon Auth identity mapping and authorization are verified.

BEGIN;

CREATE TABLE IF NOT EXISTS public.community_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 2 AND 120),
  slug text NOT NULL,
  scene_key text NOT NULL DEFAULT 'cafe',
  description text NOT NULL DEFAULT '',
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'invite_only')),
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, slug)
);

CREATE TABLE IF NOT EXISTS public.room_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.community_rooms(id) ON DELETE CASCADE,
  label text NOT NULL CHECK (length(trim(label)) BETWEEN 1 AND 100),
  position_x numeric(7,3) NOT NULL DEFAULT 0 CHECK (position_x BETWEEN 0 AND 100),
  position_y numeric(7,3) NOT NULL DEFAULT 0 CHECK (position_y BETWEEN 0 AND 100),
  capacity smallint NOT NULL DEFAULT 6 CHECK (capacity BETWEEN 1 AND 100),
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'admins')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id, label)
);

CREATE TABLE IF NOT EXISTS public.room_table_seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid NOT NULL REFERENCES public.room_tables(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seat_label text,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (table_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.podcast_shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 180),
  slug text NOT NULL,
  description text NOT NULL DEFAULT '',
  cover_asset_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'admins')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, slug)
);

CREATE TABLE IF NOT EXISTS public.podcast_show_hosts (
  show_id uuid NOT NULL REFERENCES public.podcast_shows(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'host' CHECK (role IN ('host', 'co_host', 'producer')),
  added_by text REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (show_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.podcast_episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id uuid NOT NULL REFERENCES public.podcast_shows(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 200),
  description text NOT NULL DEFAULT '',
  episode_number integer CHECK (episode_number IS NULL OR episode_number > 0),
  media_asset_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  external_url text,
  transcript text,
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'admins')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  scheduled_at timestamptz,
  published_at timestamptz,
  duration_seconds integer CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (media_asset_id IS NOT NULL OR external_url IS NOT NULL OR status = 'draft')
);

CREATE TABLE IF NOT EXISTS public.podcast_episode_bookmarks (
  episode_id uuid NOT NULL REFERENCES public.podcast_episodes(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (episode_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.community_follows (
  follower_community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  followed_community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_community_id, followed_community_id),
  CHECK (follower_community_id <> followed_community_id)
);

CREATE TABLE IF NOT EXISTS public.podcast_audio_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  show_id uuid REFERENCES public.podcast_shows(id) ON DELETE SET NULL,
  episode_id uuid REFERENCES public.podcast_episodes(id) ON DELETE SET NULL,
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 180),
  description text NOT NULL DEFAULT '',
  session_type text NOT NULL DEFAULT 'live_audio' CHECK (session_type IN ('live_audio', 'recording', 'discussion')),
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'invite_only')),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'live', 'ended', 'cancelled')),
  starts_at timestamptz,
  ends_at timestamptz,
  external_meeting_url text,
  recording_asset_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  recording_consent_required boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at >= starts_at)
);

CREATE TABLE IF NOT EXISTS public.podcast_audio_session_roles (
  session_id uuid NOT NULL REFERENCES public.podcast_audio_sessions(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'listener' CHECK (role IN ('host', 'co_host', 'speaker', 'listener', 'moderator')),
  granted_by text REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (session_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.cross_community_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  target_community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.podcast_audio_sessions(id) ON DELETE CASCADE,
  episode_id uuid REFERENCES public.podcast_episodes(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  invitee_user_id text REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_email text,
  token_hash text NOT NULL UNIQUE,
  access_scope text NOT NULL DEFAULT 'session_guest' CHECK (access_scope IN ('session_guest', 'episode_guest', 'community_visit')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'revoked')),
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (invitee_user_id IS NOT NULL OR invitee_email IS NOT NULL),
  CHECK (session_id IS NOT NULL OR episode_id IS NOT NULL OR target_community_id IS NOT NULL),
  CHECK (expires_at > created_at)
);

CREATE TABLE IF NOT EXISTS public.podcast_recording_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.podcast_audio_sessions(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  consented boolean NOT NULL,
  consent_text_version text NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  withdrawn_at timestamptz,
  UNIQUE (session_id, user_id, consent_text_version)
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id text PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  agenda_reminders boolean NOT NULL DEFAULT true,
  weekly_digest boolean NOT NULL DEFAULT false,
  podcast_updates boolean NOT NULL DEFAULT true,
  community_invites boolean NOT NULL DEFAULT true,
  quiet_hours_start time,
  quiet_hours_end time,
  timezone text NOT NULL DEFAULT 'Asia/Jakarta',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((quiet_hours_start IS NULL) = (quiet_hours_end IS NULL))
);

CREATE INDEX IF NOT EXISTS idx_rooms_community_visibility ON public.community_rooms (community_id, visibility);
CREATE INDEX IF NOT EXISTS idx_room_tables_room ON public.room_tables (room_id);
CREATE INDEX IF NOT EXISTS idx_room_seats_user ON public.room_table_seats (user_id);
CREATE INDEX IF NOT EXISTS idx_podcast_shows_community_status ON public.podcast_shows (community_id, status, visibility);
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_show_status ON public.podcast_episodes (show_id, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_audio_sessions_community_start ON public.podcast_audio_sessions (community_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_cross_invites_status_expiry ON public.cross_community_invitations (status, expires_at);
CREATE INDEX IF NOT EXISTS idx_cross_invites_invitee ON public.cross_community_invitations (invitee_user_id, status);
CREATE INDEX IF NOT EXISTS idx_recording_consents_session ON public.podcast_recording_consents (session_id, user_id);

COMMENT ON TABLE public.cross_community_invitations IS 'Guest passes must be validated server-side, expire, be revocable, and grant only the stated scope.';
COMMENT ON TABLE public.podcast_recording_consents IS 'Record consent before recording; withdrawing consent must be handled by application policy.';
COMMENT ON TABLE public.notification_preferences IS 'Use explicit opt-in for weekly digests; honor quiet hours and user-level mute controls.';

COMMIT;
