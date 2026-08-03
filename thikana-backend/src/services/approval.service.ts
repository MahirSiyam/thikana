import type { Types } from "mongoose";
import { OwnerProfile } from "../models/owner-profile.model";
import { ServiceProviderProfile } from "../models/service-provider-profile.model";
import { TenantProfile } from "../models/tenant-profile.model";
import { User, type UserDocument } from "../models/user.model";
import type { AdminUserListQuery } from "../validation/admin.validation";
import { createAuditLog } from "./audit-log.service";
import {
  getSignedAssetUrl,
  isCloudinaryConfigured,
} from "./cloudinary.service";
import {
  safeSendEmail,
  sendAccountApprovedEmail,
  sendAccountReactivatedEmail,
  sendAccountRejectedEmail,
  sendAccountSuspendedEmail,
} from "./email.service";
import { toSafeUser, type SafeUser } from "./user.service";

type AssetLike = {
  publicId?: string;
  resourceType?: "image" | "raw";
  format?: string;
  bytes?: number;
  secureUrl?: string;
  uploadedAt?: Date | string;
} | null | undefined;

const resolveDocumentUrl = (asset: AssetLike): string | null => {
  if (!asset?.publicId) return null;
  if (isCloudinaryConfigured()) {
    try {
      return getSignedAssetUrl({
        publicId: asset.publicId,
        resourceType: asset.resourceType || "image",
        expiresInSeconds: 60 * 60 * 6,
      });
    } catch {
      // fall through
    }
  }
  return asset.secureUrl || null;
};

const serializeAsset = (asset: AssetLike) => {
  if (!asset?.publicId) return null;
  return {
    publicId: asset.publicId,
    resourceType: asset.resourceType || "image",
    format: asset.format,
    bytes: asset.bytes,
    uploadedAt: asset.uploadedAt,
    secureUrl: resolveDocumentUrl(asset),
  };
};

export class ApprovalError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const loginUrl = () =>
  `${process.env.FRONTEND_URL || "http://localhost:3000"}/signin`;

const requireEmailVerifiedForApproval = () =>
  process.env.APPROVAL_REQUIRES_EMAIL_VERIFIED !== "false";

const loadTargetUser = async (userId: string): Promise<UserDocument> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApprovalError("User not found", "USER_NOT_FOUND", 404);
  }
  if (user.role === "admin") {
    throw new ApprovalError(
      "Admin accounts cannot be managed through approval endpoints",
      "INVALID_TARGET",
      403
    );
  }
  return user;
};

const ensureProfileExists = async (user: UserDocument): Promise<void> => {
  let profile = null;
  if (user.role === "tenant") {
    profile = await TenantProfile.findOne({ userId: user._id });
  } else if (user.role === "owner") {
    profile = await OwnerProfile.findOne({ userId: user._id });
  } else if (user.role === "service_provider") {
    profile = await ServiceProviderProfile.findOne({ userId: user._id });
  }

  if (!profile) {
    throw new ApprovalError(
      "Role profile is missing for this user",
      "PROFILE_MISSING",
      409
    );
  }
};

export const approveUser = async (input: {
  userId: string;
  admin: UserDocument;
  note?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<SafeUser> => {
  const user = await loadTargetUser(input.userId);
  await ensureProfileExists(user);

  if (user.approvalStatus === "approved" && user.accountStatus === "active") {
    return toSafeUser(user);
  }

  if (requireEmailVerifiedForApproval() && !user.emailVerified) {
    throw new ApprovalError(
      "User email must be verified before approval",
      "EMAIL_NOT_VERIFIED",
      409
    );
  }

  if (user.approvalStatus === "rejected") {
    throw new ApprovalError(
      "Rejected users cannot be approved directly. Ask them to resubmit.",
      "INVALID_STATE_TRANSITION",
      409
    );
  }

  const previousValue = {
    approvalStatus: user.approvalStatus,
    accountStatus: user.accountStatus,
  };

  const updated = await User.findOneAndUpdate(
    {
      _id: user._id,
      approvalStatus: { $in: ["pending", "approved"] },
      accountStatus: { $ne: "disabled" },
    },
    {
      $set: {
        approvalStatus: "approved",
        accountStatus: "active",
        approvedAt: new Date(),
        approvedBy: input.admin._id,
        rejectedAt: undefined,
        rejectedBy: undefined,
        rejectionReason: undefined,
      },
    },
    { returnDocument: "after" }
  );

  if (!updated) {
    throw new ApprovalError(
      "Could not approve user in the current state",
      "INVALID_STATE_TRANSITION",
      409
    );
  }

  await createAuditLog({
    actorId: input.admin._id,
    actorRole: "admin",
    action: "USER_APPROVED",
    targetUserId: updated._id,
    previousValue,
    newValue: {
      approvalStatus: updated.approvalStatus,
      accountStatus: updated.accountStatus,
    },
    note: input.note,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  await safeSendEmail("accountApproved", () =>
    sendAccountApprovedEmail({
      email: updated.email,
      name: updated.fullName,
      role: updated.role,
      loginUrl: loginUrl(),
    })
  );

  return toSafeUser(updated);
};

export const rejectUser = async (input: {
  userId: string;
  admin: UserDocument;
  reason?: string;
  note?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<SafeUser> => {
  const user = await loadTargetUser(input.userId);

  if (user.approvalStatus === "rejected") {
    return toSafeUser(user);
  }

  if (user.approvalStatus === "approved") {
    throw new ApprovalError(
      "Approved users cannot be rejected. Suspend them instead.",
      "INVALID_STATE_TRANSITION",
      409
    );
  }

  const previousValue = {
    approvalStatus: user.approvalStatus,
    accountStatus: user.accountStatus,
  };

  const updated = await User.findOneAndUpdate(
    { _id: user._id, approvalStatus: "pending" },
    {
      $set: {
        approvalStatus: "rejected",
        accountStatus: "disabled",
        rejectedAt: new Date(),
        rejectedBy: input.admin._id,
        rejectionReason: input.reason,
      },
    },
    { returnDocument: "after" }
  );

  if (!updated) {
    throw new ApprovalError(
      "Could not reject user in the current state",
      "INVALID_STATE_TRANSITION",
      409
    );
  }

  await createAuditLog({
    actorId: input.admin._id,
    actorRole: "admin",
    action: "USER_REJECTED",
    targetUserId: updated._id,
    previousValue,
    newValue: {
      approvalStatus: updated.approvalStatus,
      accountStatus: updated.accountStatus,
      rejectionReason: updated.rejectionReason,
    },
    note: input.note || input.reason,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  await safeSendEmail("accountRejected", () =>
    sendAccountRejectedEmail({
      email: updated.email,
      name: updated.fullName,
      reason: input.reason,
    })
  );

  return toSafeUser(updated);
};

export const suspendUser = async (input: {
  userId: string;
  admin: UserDocument;
  reason?: string;
  note?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<SafeUser> => {
  const user = await loadTargetUser(input.userId);

  if (user.accountStatus === "suspended") {
    return toSafeUser(user);
  }

  if (user.approvalStatus !== "approved") {
    throw new ApprovalError(
      "Only approved users can be suspended",
      "INVALID_STATE_TRANSITION",
      409
    );
  }

  const previousValue = {
    approvalStatus: user.approvalStatus,
    accountStatus: user.accountStatus,
  };

  const updated = await User.findOneAndUpdate(
    { _id: user._id, approvalStatus: "approved", accountStatus: "active" },
    {
      $set: {
        accountStatus: "suspended",
        suspendedAt: new Date(),
        suspendedBy: input.admin._id,
        suspensionReason: input.reason,
      },
    },
    { returnDocument: "after" }
  );

  if (!updated) {
    throw new ApprovalError(
      "Could not suspend user in the current state",
      "INVALID_STATE_TRANSITION",
      409
    );
  }

  await createAuditLog({
    actorId: input.admin._id,
    actorRole: "admin",
    action: "USER_SUSPENDED",
    targetUserId: updated._id,
    previousValue,
    newValue: {
      accountStatus: updated.accountStatus,
      suspensionReason: updated.suspensionReason,
    },
    note: input.note || input.reason,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  await safeSendEmail("accountSuspended", () =>
    sendAccountSuspendedEmail({
      email: updated.email,
      name: updated.fullName,
      reason: input.reason,
    })
  );

  return toSafeUser(updated);
};

export const reactivateUser = async (input: {
  userId: string;
  admin: UserDocument;
  note?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<SafeUser> => {
  const user = await loadTargetUser(input.userId);

  if (user.accountStatus === "active" && user.approvalStatus === "approved") {
    return toSafeUser(user);
  }

  if (user.accountStatus !== "suspended") {
    throw new ApprovalError(
      "Only suspended users can be reactivated",
      "INVALID_STATE_TRANSITION",
      409
    );
  }

  const previousValue = {
    approvalStatus: user.approvalStatus,
    accountStatus: user.accountStatus,
  };

  const updated = await User.findOneAndUpdate(
    { _id: user._id, accountStatus: "suspended" },
    {
      $set: {
        accountStatus: "active",
        suspendedAt: undefined,
        suspendedBy: undefined,
        suspensionReason: undefined,
      },
    },
    { returnDocument: "after" }
  );

  if (!updated) {
    throw new ApprovalError(
      "Could not reactivate user in the current state",
      "INVALID_STATE_TRANSITION",
      409
    );
  }

  await createAuditLog({
    actorId: input.admin._id,
    actorRole: "admin",
    action: "USER_REACTIVATED",
    targetUserId: updated._id,
    previousValue,
    newValue: {
      accountStatus: updated.accountStatus,
    },
    note: input.note,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  await safeSendEmail("accountReactivated", () =>
    sendAccountReactivatedEmail({
      email: updated.email,
      name: updated.fullName,
      loginUrl: loginUrl(),
    })
  );

  return toSafeUser(updated);
};

export const listUsersForAdmin = async (query: AdminUserListQuery) => {
  const filter: Record<string, unknown> = {};

  if (query.role) filter.role = query.role;
  if (query.approvalStatus) filter.approvalStatus = query.approvalStatus;
  if (query.accountStatus) filter.accountStatus = query.accountStatus;
  if (typeof query.emailVerified === "boolean") {
    filter.emailVerified = query.emailVerified;
  }

  if (query.search) {
    const search = query.search.trim();
    const or: Record<string, unknown>[] = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];

    if (/^[a-f\d]{24}$/i.test(search)) {
      or.push({ _id: search });
    }

    filter.$or = or;
  }

  const skip = (query.page - 1) * query.limit;
  const sort: Record<string, 1 | -1> = {
    [query.sortBy]: query.sortOrder === "asc" ? 1 : -1,
  };

  const [items, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(query.limit),
    User.countDocuments(filter),
  ]);

  const providerIds = items
    .filter((user) => user.role === "service_provider")
    .map((user) => user._id);

  const providerProfiles =
    providerIds.length > 0
      ? await ServiceProviderProfile.find({
          userId: { $in: providerIds },
        }).lean()
      : [];

  const profileByUserId = new Map(
    providerProfiles.map((profile) => [String(profile.userId), profile])
  );

  return {
    items: items.map((user) => {
      const safe = toSafeUser(user);
      const base = {
        ...safe,
        approvedAt: user.approvedAt ?? null,
        rejectedAt: user.rejectedAt ?? null,
      };

      if (user.role !== "service_provider") {
        return base;
      }

      const profile = profileByUserId.get(String(user._id));
      const hasNid = Boolean(
        (user.identityDocuments?.nidFront as AssetLike)?.publicId
      );
      const hasSelfie = Boolean(
        (user.identityDocuments?.selfie as AssetLike)?.publicId
      );
      const hasCert = Boolean(
        (profile?.tradeCertificate as AssetLike | undefined)?.publicId
      );

      return {
        ...base,
        providerProfile: profile
          ? {
              serviceCategory: profile.serviceCategory ?? null,
              serviceAreas: profile.serviceAreas ?? [],
              yearsOfExperience: profile.yearsOfExperience ?? null,
              hasTradeCertificate: hasCert,
            }
          : null,
        documentStatus: {
          nid: hasNid,
          selfie: hasSelfie,
          cert: hasCert,
        },
      };
    }),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
};

export const getUserDetailsForAdmin = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApprovalError("User not found", "USER_NOT_FOUND", 404);
  }

  const identityDocuments = {
    nidFront: serializeAsset(user.identityDocuments?.nidFront as AssetLike),
    nidBack: serializeAsset(user.identityDocuments?.nidBack as AssetLike),
    selfie: serializeAsset(user.identityDocuments?.selfie as AssetLike),
  };

  let profile: Record<string, unknown> | null = null;

  if (user.role === "tenant") {
    const tenant = await TenantProfile.findOne({ userId: user._id }).lean();
    if (tenant) {
      profile = {
        lookingAs: tenant.lookingAs,
        preferredLocation: tenant.preferredLocation,
        budgetRange: tenant.budgetRange,
      };
    }
  } else if (user.role === "owner") {
    const owner = await OwnerProfile.findOne({ userId: user._id }).lean();
    if (owner) {
      const ownershipProof = serializeAsset(owner.ownershipProof as AssetLike);
      profile = {
        propertyCount: owner.propertyCount,
        preferredContactMethod: owner.preferredContactMethod,
        ownershipProof,
        ownershipProofUrl: ownershipProof?.secureUrl || null,
      };
    }
  } else if (user.role === "service_provider") {
    const provider = await ServiceProviderProfile.findOne({
      userId: user._id,
    }).lean();
    if (provider) {
      const tradeCertificate = serializeAsset(
        provider.tradeCertificate as AssetLike
      );
      profile = {
        serviceCategory: provider.serviceCategory,
        yearsOfExperience: provider.yearsOfExperience,
        serviceAreas: provider.serviceAreas,
        bio: provider.bio,
        tradeCertificate,
        tradeCertificateUrl: tradeCertificate?.secureUrl || null,
      };
    }
  }

  return {
    user: toSafeUser(user),
    profile,
    identityDocuments,
    documents: {
      nidFrontUrl: identityDocuments.nidFront?.secureUrl || null,
      nidBackUrl: identityDocuments.nidBack?.secureUrl || null,
      selfieUrl: identityDocuments.selfie?.secureUrl || null,
      ownershipProofUrl:
        (profile?.ownershipProofUrl as string | null | undefined) || null,
      tradeCertificateUrl:
        (profile?.tradeCertificateUrl as string | null | undefined) || null,
    },
    adminMeta: {
      approvedAt: user.approvedAt,
      approvedBy: user.approvedBy as Types.ObjectId | undefined,
      rejectedAt: user.rejectedAt,
      rejectedBy: user.rejectedBy as Types.ObjectId | undefined,
      rejectionReason: user.rejectionReason,
      suspendedAt: user.suspendedAt,
      suspendedBy: user.suspendedBy as Types.ObjectId | undefined,
      suspensionReason: user.suspensionReason,
      lastLoginAt: user.lastLoginAt,
    },
  };
};
