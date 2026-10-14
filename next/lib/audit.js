import { db } from "hatchable";

const ALLOWED_ACTIONS = new Set([
  "room.created",
  "room.joined",
  "invite.created",
  "invite.accepted"
]);

export async function recordAudit(actorId, action, resourceType, resourceId, metadata = {}) {
  if (!actorId || !ALLOWED_ACTIONS.has(action)) return;
  const safeMetadata = metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata : {};
  try {
    await db.query(
      "INSERT INTO community_audit_events (actor_id, action, resource_type, resource_id, metadata) VALUES ($1, $2, $3, $4, $5::jsonb)",
      [String(actorId), action, String(resourceType).slice(0, 40), String(resourceId || "").slice(0, 100), JSON.stringify(safeMetadata)]
    );
  } catch (error) {
    // Audit failure is observable to operators but never leaks user data or breaks a committed user action.
    console.error("Community audit write failed:", error?.code || "unknown");
  }
}