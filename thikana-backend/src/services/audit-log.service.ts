import type { Types } from "mongoose";
import { AuditLog } from "../models/audit-log.model";
import type { AuditAction, UserRole } from "../types/domain";

export const createAuditLog = async (input: {
  actorId: Types.ObjectId | string;
  actorRole: UserRole;
  action: AuditAction;
  targetUserId: Types.ObjectId | string;
  previousValue?: unknown;
  newValue?: unknown;
  note?: string;
  ipAddress?: string;
  userAgent?: string;
}) => {
  return AuditLog.create({
    actorId: input.actorId,
    actorRole: input.actorRole,
    action: input.action,
    targetUserId: input.targetUserId,
    previousValue: input.previousValue,
    newValue: input.newValue,
    note: input.note,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });
};
