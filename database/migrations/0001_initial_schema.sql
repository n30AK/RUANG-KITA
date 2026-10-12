-- RUANG KITA initial relational schema
-- Review and test on a development branch before applying to production.
-- Do not store secrets in this repository.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.profiles (
  id text PRIMARY KEY,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  bio text,
  locale text NOT NULL DEFAULT 'id-ID',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 2 AND 120),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text NOT NULL DEFAULT '',
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'invite_only')),
  logo_url text,
  cover_url text,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  email text,
  token_hash text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at > created_at)
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  author_id text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 180),
  body text NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 180),
  description text NOT NULL DEFAULT '',
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  timezone text NOT NULL DEFAULT 'Asia/Jakarta',
  location_text text,
  meeting_url text,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR ends_at >= starts_at)
);

CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  response text NOT NULL DEFAULT 'going' CHECK (response IN ('going', 'maybe', 'not_going')),
  responded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 200),
  summary text NOT NULL DEFAULT '',
  content_type text NOT NULL CHECK (content_type IN ('document', 'link', 'podcast', 'video', 'minutes', 'faq')),
  url text,
  body text,
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'admins')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  uploaded_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  storage_provider text NOT NULL,
  storage_key text NOT NULL,
  mime_type text,
  size_bytes bigint CHECK (size_bytes IS NULL OR size_bytes >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (storage_provider, storage_key)
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
  actor_id text REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE,
  reporter_id text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  target_type text NOT NULL,
  target_id text NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by text REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  policy_version text NOT NULL,
  granted boolean NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, consent_type, policy_version)
);

CREATE INDEX IF NOT EXISTS idx_memberships_user_status ON public.memberships (user_id, status);
CREATE INDEX IF NOT EXISTS idx_memberships_community_role ON public.memberships (community_id, role);
CREATE INDEX IF NOT EXISTS idx_announcements_community_published ON public.announcements (community_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_community_starts ON public.events (community_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user ON public.event_rsvps (user_id, response);
CREATE INDEX IF NOT EXISTS idx_content_items_community_published ON public.content_items (community_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_tags ON public.content_items USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_audit_logs_community_created ON public.audit_logs (community_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status_created ON public.reports (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invitations_community_expiry ON public.invitations (community_id, expires_at);

COMMIT;
