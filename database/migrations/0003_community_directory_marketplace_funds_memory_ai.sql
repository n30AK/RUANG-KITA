-- RUANG KITA community profiles, directory, marketplace, social funds, memory and AI knowledge
-- DRAFT ONLY. Depends on 0001_initial_schema.sql and 0002_rooms_podcast_and_guest_access.sql.
-- Do not apply to Neon production. Authorization/RLS policies and allow/deny tests are required first.
-- Financial records here are bookkeeping records only; this migration does not process payments.

BEGIN;

-- Community home-page fields and verification policy.
ALTER TABLE public.communities
  ADD COLUMN IF NOT EXISTS vision text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS mission text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS community_type text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS verified_members_only boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_policy text NOT NULL DEFAULT 'admin_review'
    CHECK (verification_policy IN ('admin_review', 'invite_only', 'external_verification', 'disabled')),
  ADD COLUMN IF NOT EXISTS history_intro text NOT NULL DEFAULT '';

-- Explicit officer assignments; membership role remains the source of authorization.
CREATE TABLE IF NOT EXISTS public.community_officers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 120),
  bio text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  visible_to text NOT NULL DEFAULT 'members' CHECK (visible_to IN ('public', 'members', 'admins')),
  starts_on date,
  ends_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_on IS NULL OR starts_on IS NULL OR ends_on >= starts_on)
);
CREATE INDEX IF NOT EXISTS community_officers_lookup_idx
  ON public.community_officers (community_id, display_order);

-- Member directory data is opt-in and visibility-aware; never expose contact details by default.
CREATE TABLE IF NOT EXISTS public.member_directory_profiles (
  user_id text PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  headline text NOT NULL DEFAULT '',
  city text,
  skills text[] NOT NULL DEFAULT '{}',
  interests text[] NOT NULL DEFAULT '{}',
  business_summary text,
  seeking text[] NOT NULL DEFAULT '{}',
  directory_opt_in boolean NOT NULL DEFAULT false,
  profile_visibility text NOT NULL DEFAULT 'community'
    CHECK (profile_visibility IN ('private', 'community', 'public')),
  contact_sharing text NOT NULL DEFAULT 'request'
    CHECK (contact_sharing IN ('never', 'request', 'public')),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS member_directory_city_idx
  ON public.member_directory_profiles (city) WHERE directory_opt_in = true;
CREATE INDEX IF NOT EXISTS member_directory_skills_gin_idx
  ON public.member_directory_profiles USING gin (skills);
CREATE INDEX IF NOT EXISTS member_directory_interests_gin_idx
  ON public.member_directory_profiles USING gin (interests);

-- Auditable community activity stream; payload must not contain secrets or sensitive message bodies.
CREATE TABLE IF NOT EXISTS public.community_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  actor_id text REFERENCES public.profiles(id) ON DELETE SET NULL,
  activity_type text NOT NULL CHECK (activity_type IN (
    'community_created', 'profile_updated', 'officer_changed', 'announcement_published',
    'event_created', 'event_completed', 'content_added', 'podcast_published',
    'listing_published', 'fund_report_published', 'milestone_recorded'
  )),
  object_type text,
  object_id uuid,
  summary text NOT NULL CHECK (length(trim(summary)) BETWEEN 1 AND 280),
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'admins')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS community_activity_feed_idx
  ON public.community_activity (community_id, created_at DESC);

-- Marketplace listings: offers, services, jobs, collaborations, internships and procurement notices.
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  listing_type text NOT NULL CHECK (listing_type IN (
    'product', 'service', 'job', 'collaboration', 'internship', 'procurement'
  )),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 2 AND 180),
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'other',
  price_amount numeric(14,2) CHECK (price_amount IS NULL OR price_amount >= 0),
  currency char(3) NOT NULL DEFAULT 'IDR',
  location_text text,
  external_contact_url text,
  whatsapp_contact text,
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'admins')),
  moderation_status text NOT NULL DEFAULT 'pending'
    CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'removed')),
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at IS NULL OR expires_at > created_at)
);
CREATE INDEX IF NOT EXISTS marketplace_listing_discovery_idx
  ON public.marketplace_listings (community_id, listing_type, moderation_status, published_at DESC);
CREATE INDEX IF NOT EXISTS marketplace_listing_expiry_idx
  ON public.marketplace_listings (expires_at) WHERE expires_at IS NOT NULL;

-- Social fund and activity bookkeeping. No card/bank credentials or payment processing.
CREATE TABLE IF NOT EXISTS public.community_funds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 2 AND 160),
  purpose text NOT NULL DEFAULT '',
  fund_type text NOT NULL CHECK (fund_type IN ('dues', 'donation', 'activity', 'aid', 'general')),
  currency char(3) NOT NULL DEFAULT 'IDR',
  target_amount numeric(14,2) CHECK (target_amount IS NULL OR target_amount >= 0),
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'admins')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'closed')),
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  approved_by text REFERENCES public.profiles(id) ON DELETE RESTRICT,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.fund_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id uuid NOT NULL REFERENCES public.community_funds(id) ON DELETE RESTRICT,
  transaction_type text NOT NULL CHECK (transaction_type IN ('income', 'expense', 'adjustment')),
  category text NOT NULL DEFAULT 'other',
  description text NOT NULL CHECK (length(trim(description)) BETWEEN 1 AND 280),
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  currency char(3) NOT NULL DEFAULT 'IDR',
  occurred_at timestamptz NOT NULL DEFAULT now(),
  recorded_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  receipt_asset_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'voided')),
  approved_by text REFERENCES public.profiles(id) ON DELETE RESTRICT,
  approved_at timestamptz,
  rejection_reason text,
  idempotency_key text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (approved_by IS NULL OR approved_by <> recorded_by)
);
CREATE INDEX IF NOT EXISTS fund_transactions_ledger_idx
  ON public.fund_transactions (fund_id, occurred_at DESC, status);
CREATE TABLE IF NOT EXISTS public.fund_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES public.fund_transactions(id) ON DELETE CASCADE,
  reviewer_id text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  decision text NOT NULL CHECK (decision IN ('approved', 'rejected')),
  note text NOT NULL DEFAULT '',
  decided_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (transaction_id, reviewer_id)
);

-- Community memory: milestones, stories, albums and archive entries reference approved media.
CREATE TABLE IF NOT EXISTS public.community_memory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_by text NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  item_type text NOT NULL CHECK (item_type IN (
    'milestone', 'story', 'photo_album', 'video', 'document', 'achievement', 'event_archive'
  )),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 180),
  body text NOT NULL DEFAULT '',
  event_date date,
  media_asset_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  source_event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  visibility text NOT NULL DEFAULT 'members' CHECK (visibility IN ('public', 'members', 'admins')),
  moderation_status text NOT NULL DEFAULT 'pending'
    CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'removed')),
  retention_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS community_memory_timeline_idx
  ON public.community_memory_items (community_id, event_date DESC NULLS LAST, created_at DESC);

-- Permission-scoped knowledge sources and derived AI artefacts.
CREATE TABLE IF NOT EXISTS public.ai_knowledge_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  content_item_id uuid REFERENCES public.content_items(id) ON DELETE CASCADE,
  memory_item_id uuid REFERENCES public.community_memory_items(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  episode_id uuid REFERENCES public.podcast_episodes(id) ON DELETE CASCADE,
  source_title text NOT NULL,
  source_visibility text NOT NULL CHECK (source_visibility IN ('public', 'members', 'admins')),
  processing_status text NOT NULL DEFAULT 'queued'
    CHECK (processing_status IN ('queued', 'processing', 'ready', 'failed', 'disabled')),
  content_hash text,
  last_error_code text,
  created_by text REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(content_item_id, memory_item_id, event_id, episode_id) = 1),
  UNIQUE (content_item_id),
  UNIQUE (memory_item_id),
  UNIQUE (event_id),
  UNIQUE (episode_id)
);
CREATE INDEX IF NOT EXISTS ai_knowledge_source_scope_idx
  ON public.ai_knowledge_sources (community_id, source_visibility, processing_status);

CREATE TABLE IF NOT EXISTS public.ai_knowledge_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES public.ai_knowledge_sources(id) ON DELETE CASCADE,
  artifact_type text NOT NULL CHECK (artifact_type IN (
    'transcript', 'summary', 'topics', 'key_points', 'faq', 'embedding_reference'
  )),
  content_text text,
  structured_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  model_provider text,
  model_name text,
  consent_record_id uuid,
  generated_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by text REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'published', 'rejected')),
  UNIQUE (source_id, artifact_type)
);

COMMENT ON TABLE public.member_directory_profiles IS
  'Opt-in directory only. Server authorization must enforce profile_visibility, contact_sharing and community membership.';
COMMENT ON TABLE public.community_funds IS
  'Bookkeeping only. No payment gateway, bank credentials, or automatic money movement.';
COMMENT ON TABLE public.fund_transactions IS
  'Ledger entries require server-side authorization, separation of duties, approval and immutable audit events.';
COMMENT ON TABLE public.ai_knowledge_sources IS
  'Every AI retrieval must filter by authenticated tenant membership and source_visibility before context assembly.';
COMMENT ON TABLE public.ai_knowledge_artifacts IS
  'AI outputs are drafts until reviewed. Store no hidden chain-of-thought or unnecessary sensitive personal data.';

COMMIT;
