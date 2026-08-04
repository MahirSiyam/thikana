import type { UserDocument } from "../models/user.model";
import { User } from "../models/user.model";
import {
  getSignedAssetUrl,
  isCloudinaryConfigured,
} from "./cloudinary.service";
import { ROLE_DASHBOARD_ROUTES, type UserRole } from "../types/domain";

export type SafeUser = {
  id: string;
  firebaseUid: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  emailVerified: boolean;
  approvalStatus: UserDocument["approvalStatus"];
  accountStatus: UserDocument["accountStatus"];
  canAccessDashboard: boolean;
  dashboardRoute: string | null;
  avatarUrl: string | null;
  address?: UserDocument["address"];
  rejectionReason?: string | null;
  suspensionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const canAccessDashboard = (user: {
  emailVerified: boolean;
  approvalStatus: string;
  accountStatus: string;
}): boolean =>
  user.emailVerified === true &&
  user.approvalStatus === "approved" &&
  user.accountStatus === "active";

const resolveAssetUrl = (asset?: {
  publicId?: string;
  resourceType?: "image" | "raw";
  secureUrl?: string | null;
} | null): string | null => {
  if (!asset?.publicId) return null;

  // Authenticated Cloudinary assets need a signed URL for browser display.
  if (isCloudinaryConfigured()) {
    try {
      return getSignedAssetUrl({
        publicId: asset.publicId,
        resourceType: asset.resourceType || "image",
        expiresInSeconds: 60 * 60 * 6,
        avatar: true,
      });
    } catch {
      // fall through to stored URL
    }
  }

  return asset.secureUrl || null;
};

type AvatarSource = {
  profileImage?: {
    publicId?: string;
    resourceType?: "image" | "raw";
    secureUrl?: string | null;
  } | null;
  identityDocuments?: {
    selfie?: {
      publicId?: string;
      resourceType?: "image" | "raw";
      secureUrl?: string | null;
    } | null;
  } | null;
};

export const resolveAvatarUrl = (user: AvatarSource): string | null => {
  const fromProfile = resolveAssetUrl(user.profileImage);
  if (fromProfile) return fromProfile;
  return resolveAssetUrl(user.identityDocuments?.selfie);
};

export const toSafeUser = (user: UserDocument): SafeUser => {
  const access = canAccessDashboard(user);
  return {
    id: String(user._id),
    firebaseUid: user.firebaseUid,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone ?? null,
    role: user.role,
    emailVerified: user.emailVerified,
    approvalStatus: user.approvalStatus,
    accountStatus: user.accountStatus,
    canAccessDashboard: access,
    dashboardRoute: access ? ROLE_DASHBOARD_ROUTES[user.role] : null,
    avatarUrl: resolveAvatarUrl(user),
    address: user.address,
    rejectionReason:
      user.approvalStatus === "rejected" ? user.rejectionReason ?? null : null,
    suspensionReason:
      user.accountStatus === "suspended" ? user.suspensionReason ?? null : null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const findUserByFirebaseUid = async (firebaseUid: string) => {
  return User.findOne({ firebaseUid });
};

export const findUserById = async (userId: string) => {
  return User.findById(userId);
};

export const syncEmailVerified = async (
  user: UserDocument,
  emailVerified: boolean
): Promise<UserDocument> => {
  if (user.emailVerified === emailVerified) {
    return user;
  }
  user.emailVerified = emailVerified;
  await user.save();
  return user;
};

export const touchLastLogin = async (user: UserDocument): Promise<void> => {
  user.lastLoginAt = new Date();
  await user.save();
};
