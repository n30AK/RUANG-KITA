CREATE TABLE community_stats (
  community_id uuid PRIMARY KEY REFERENCES communities(id) ON DELETE CASCADE,
  member_count integer NOT NULL DEFAULT 0 CHECK (member_count >= 0)
);
CREATE FUNCTION rk_init_community_stats() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO community_stats(community_id,member_count) VALUES(NEW.id,0)
  ON CONFLICT(community_id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER rk_community_stats_init AFTER INSERT ON communities
FOR EACH ROW EXECUTE FUNCTION rk_init_community_stats();
CREATE FUNCTION rk_update_community_member_count() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  cid uuid;
BEGIN
  IF TG_OP='INSERT' THEN
    cid := NEW.community_id;
    IF NEW.status='active' THEN
      UPDATE community_stats SET member_count=member_count+1 WHERE community_id=cid;
    END IF;
    RETURN NEW;
  ELSIF TG_OP='DELETE' THEN
    cid := OLD.community_id;
    IF OLD.status='active' THEN
      UPDATE community_stats SET member_count=GREATEST(0,member_count-1) WHERE community_id=cid;
    END IF;
    RETURN OLD;
  ELSE
    cid := NEW.community_id;
    IF OLD.status<>'active' AND NEW.status='active' THEN
      UPDATE community_stats SET member_count=member_count+1 WHERE community_id=cid;
    ELSIF OLD.status='active' AND NEW.status<>'active' THEN
      UPDATE community_stats SET member_count=GREATEST(0,member_count-1) WHERE community_id=cid;
    END IF;
    RETURN NEW;
  END IF;
END;
$$;
CREATE TRIGGER rk_community_membership_count
AFTER INSERT OR UPDATE OF status OR DELETE ON community_memberships
FOR EACH ROW EXECUTE FUNCTION rk_update_community_member_count();
INSERT INTO community_stats(community_id,member_count)
SELECT c.id, count(m.id)::int
FROM communities c LEFT JOIN community_memberships m ON m.community_id=c.id AND m.status='active'
GROUP BY c.id
ON CONFLICT(community_id) DO UPDATE SET member_count=EXCLUDED.member_count;