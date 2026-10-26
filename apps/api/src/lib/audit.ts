import { db } from "../config/db";
import { auditLogs } from "../db/schema";

type AuditActor = { id?: string; email?: string } | undefined;

export const logAudit = async (
  actor: AuditActor,
  action: string,
  entity: string,
  entityId?: string | null,
  meta?: Record<string, unknown>
) => {
  try {
    await db.insert(auditLogs).values({
      adminId: actor?.id || null,
      adminEmail: actor?.email || null,
      action,
      entity,
      entityId: entityId || null,
      meta: meta || null,
    });
  } catch (error) {
    // Audit logging must never break the main operation
    console.error("Audit log failed:", error);
  }
};
